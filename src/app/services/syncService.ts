/**
 * syncService.ts
 * ──────────────
 * Arquitectura offline-first:
 *  1. Toda escritura va primero a SQLite local (sin latencia, siempre disponible).
 *  2. Si hay internet, sube inmediatamente a Supabase en background.
 *  3. Si no hay internet, encola la operación en `sync_queue` (SQLite).
 *  4. Al reconectar (evento online) o al abrir la app, drena la cola.
 *  5. En el loadData inicial, descarga cambios remotos más nuevos (pull).
 */

import { supabase, getDeviceId, isOnline } from './supabase';
import { dbService } from './database';
import { Transaction, Budget, RecurringTransaction } from '../data/types';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type SyncOperation =
  | { table: 'transactions';          op: 'upsert' | 'delete'; payload: Transaction }
  | { table: 'budgets';               op: 'upsert' | 'delete'; payload: Budget }
  | { table: 'recurring_transactions'; op: 'upsert' | 'delete'; payload: RecurringTransaction }
  | { table: 'preferences';           op: 'upsert';             payload: { savings_goal: number; category_colors: Record<string, string> } };

// ─── Sync Service ─────────────────────────────────────────────────────────────

class SyncService {
  private isSyncing = false;
  private listeners: Array<(state: SyncState) => void> = [];
  private hasHydratedState = false;

  // Estado observable desde la UI
  state: SyncState = { status: 'idle', pendingCount: 0 };

  constructor() {
    // Drena la cola automáticamente cuando recupera conexión
    window.addEventListener('online', () => {
      this.drainQueue();
    });
  }

  // ── Suscripción de estado (para SyncIndicator) ─────────────────────────────
  subscribe(cb: (s: SyncState) => void) {
    this.listeners.push(cb);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  private setState(s: Partial<SyncState>) {
    this.state = { ...this.state, ...s };
    this.listeners.forEach(l => l(this.state));
  }

  async hydrateState(): Promise<void> {
    const pendingCount = await dbService.getPendingSyncOpsCount();
    this.hasHydratedState = true;
    this.setState({
      status: pendingCount > 0 ? 'error' : 'synced',
      pendingCount,
    });
  }

  // ── Enqueue ────────────────────────────────────────────────────────────────
  async enqueue(op: SyncOperation): Promise<void> {
    await dbService.enqueueSyncOp(op);
    this.setState({
      status: 'error',
      pendingCount: this.state.pendingCount + 1,
    });
  }

  // ── Push inmediato o encola ────────────────────────────────────────────────
  async push(op: SyncOperation): Promise<void> {
    if (!isOnline()) {
      await this.enqueue(op);
      return;
    }
    try {
      await this.executeOp(op);
    } catch (e) {
      console.warn('[sync] push failed, enqueueing:', e);
      await this.enqueue(op);
    }
  }

  // ── Ejecutar una operación en Supabase ────────────────────────────────────
  private async executeOp(op: SyncOperation): Promise<void> {
    const deviceId = await getDeviceId();

    if (op.table === 'transactions') {
      if (op.op === 'delete') {
        const { error } = await supabase
          .from('transactions')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', op.payload.id)
          .eq('device_id', deviceId);
        if (error) throw error;
      } else {
        const row = {
          id:             op.payload.id,
          device_id:      deviceId,
          type:           op.payload.type,
          amount:         op.payload.amount,
          category:       op.payload.category,
          description:    op.payload.description ?? '',
          date:           op.payload.date,
          payment_method: op.payload.paymentMethod,
          deleted_at:     null,
          synced_at:      new Date().toISOString(),
        };
        const { error } = await supabase.from('transactions').upsert(row, { onConflict: 'id' });
        if (error) throw error;
      }
    }

    else if (op.table === 'budgets') {
      if (op.op === 'delete') {
        const { error } = await supabase
          .from('budgets').delete().eq('id', op.payload.id).eq('device_id', deviceId);
        if (error) throw error;
      } else {
        const row = {
          id:        op.payload.id,
          device_id: deviceId,
          category:  op.payload.category,
          limit:     op.payload.limit,
          spent:     op.payload.spent,
          synced_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('budgets').upsert(row, { onConflict: 'id' });
        if (error) throw error;
      }
    }

    else if (op.table === 'recurring_transactions') {
      if (op.op === 'delete') {
        const { error } = await supabase
          .from('recurring_transactions').delete().eq('id', op.payload.id).eq('device_id', deviceId);
        if (error) throw error;
      } else {
        const row = {
          id:             op.payload.id,
          device_id:      deviceId,
          type:           op.payload.type,
          amount:         op.payload.amount,
          category:       op.payload.category,
          description:    op.payload.description ?? '',
          frequency:      op.payload.frequency,
          next_date:      op.payload.next_date,
          payment_method: op.payload.paymentMethod,
          synced_at:      new Date().toISOString(),
        };
        const { error } = await supabase.from('recurring_transactions').upsert(row, { onConflict: 'id' });
        if (error) throw error;
      }
    }

    else if (op.table === 'preferences') {
      const row = {
        device_id:       deviceId,
        savings_goal:    op.payload.savings_goal,
        category_colors: op.payload.category_colors,
        updated_at:      new Date().toISOString(),
      };
      const { error } = await supabase.from('preferences').upsert(row, { onConflict: 'device_id' });
      if (error) throw error;
    }
  }

  // ── Drena la cola de operaciones pendientes ────────────────────────────────
  async drainQueue(): Promise<void> {
    if (!this.hasHydratedState) {
      await this.hydrateState();
    }
    if (this.isSyncing || !isOnline()) return;
    this.isSyncing = true;
    this.setState({ status: 'syncing' });

    try {
      const ops = await dbService.getPendingSyncOps();
      if (ops.length === 0) {
        this.setState({ status: 'synced', pendingCount: 0 });
        return;
      }

      let failed = 0;
      for (const { id, op } of ops) {
        try {
          await this.executeOp(op);
          await dbService.deleteSyncOp(id);
        } catch (e) {
          console.warn('[sync] drain op failed:', e);
          failed++;
        }
      }

      const remaining = await dbService.getPendingSyncOpsCount();
      this.setState({
        status: remaining === 0 ? 'synced' : 'error',
        pendingCount: remaining,
      });
    } catch (e) {
      console.error('[sync] drainQueue error:', e);
      this.setState({ status: 'error' });
    } finally {
      this.isSyncing = false;
    }
  }

  // ── Pull: descarga datos remotos más nuevos ────────────────────────────────
  async pull(): Promise<{
    transactions: Transaction[];
    budgets: Budget[];
    recurring: RecurringTransaction[];
    savingsGoal: number;
    categoryColors: Record<string, string>;
  } | null> {
    if (!isOnline()) return null;

    try {
      const deviceId = await getDeviceId();

      // Asegurar que el perfil exista en remoto
      await supabase.from('profiles').upsert(
        { device_id: deviceId },
        { onConflict: 'device_id', ignoreDuplicates: true }
      );

      const [txRes, budgetRes, recurringRes, prefRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('device_id', deviceId)
          .is('deleted_at', null)
          .order('date', { ascending: false }),
        supabase
          .from('budgets')
          .select('*')
          .eq('device_id', deviceId),
        supabase
          .from('recurring_transactions')
          .select('*')
          .eq('device_id', deviceId)
          .order('next_date', { ascending: true }),
        supabase
          .from('preferences')
          .select('*')
          .eq('device_id', deviceId)
          .maybeSingle(),
      ]);

      if (txRes.error || budgetRes.error || recurringRes.error) {
        console.warn('[sync] pull partial error:', txRes.error || budgetRes.error || recurringRes.error);
        return null;
      }

      const transactions: Transaction[] = (txRes.data ?? []).map((r: any) => ({
        id:            r.id,
        type:          r.type,
        amount:        r.amount,
        category:      r.category,
        description:   r.description ?? '',
        date:          r.date,
        paymentMethod: r.payment_method,
      }));

      const budgets: Budget[] = (budgetRes.data ?? []).map((r: any) => ({
        id:       r.id,
        category: r.category,
        limit:    r.limit,
        spent:    r.spent,
      }));

      const recurring: RecurringTransaction[] = (recurringRes.data ?? []).map((r: any) => ({
        id:            r.id,
        type:          r.type,
        amount:        r.amount,
        category:      r.category,
        description:   r.description ?? '',
        frequency:     r.frequency,
        next_date:     r.next_date,
        paymentMethod: r.payment_method,
      }));

      const pref = prefRes.data as any;
      const savingsGoal: number     = pref?.savings_goal ?? 0;
      const categoryColors: Record<string, string> = pref?.category_colors ?? {};

      return { transactions, budgets, recurring, savingsGoal, categoryColors };
    } catch (e) {
      console.warn('[sync] pull failed:', e);
      return null;
    }
  }

  // ── Sync preferences ──────────────────────────────────────────────────────
  async syncPreferences(savingsGoal: number, categoryColors: Record<string, string>): Promise<void> {
    await this.push({
      table: 'preferences',
      op: 'upsert',
      payload: { savings_goal: savingsGoal, category_colors: categoryColors },
    });
  }

  // ── Seed remoto: sube todos los datos locales (primera vez) ───────────────
  async seedRemote(
    transactions: Transaction[],
    budgets: Budget[],
    recurring: RecurringTransaction[],
    savingsGoal: number,
    categoryColors: Record<string, string>
  ): Promise<void> {
    if (!isOnline()) return;

    this.setState({ status: 'syncing' });
    try {
      const deviceId = await getDeviceId();

      // Asegurar perfil
      await supabase.from('profiles').upsert(
        { device_id: deviceId },
        { onConflict: 'device_id', ignoreDuplicates: true }
      );

      // Subir transacciones en batch
      if (transactions.length > 0) {
        const rows = transactions.map(tx => ({
          id:             tx.id,
          device_id:      deviceId,
          type:           tx.type,
          amount:         tx.amount,
          category:       tx.category,
          description:    tx.description ?? '',
          date:           tx.date,
          payment_method: tx.paymentMethod,
          deleted_at:     null,
          synced_at:      new Date().toISOString(),
        }));
        const { error } = await supabase.from('transactions').upsert(rows, { onConflict: 'id' });
        if (error) console.warn('[sync] seed transactions error:', error);
      }

      // Subir presupuestos
      if (budgets.length > 0) {
        const rows = budgets.map(b => ({
          id:        b.id,
          device_id: deviceId,
          category:  b.category,
          limit:     b.limit,
          spent:     b.spent,
          synced_at: new Date().toISOString(),
        }));
        const { error } = await supabase.from('budgets').upsert(rows, { onConflict: 'id' });
        if (error) console.warn('[sync] seed budgets error:', error);
      }

      // Subir recurrentes
      if (recurring.length > 0) {
        const rows = recurring.map(rt => ({
          id:             rt.id,
          device_id:      deviceId,
          type:           rt.type,
          amount:         rt.amount,
          category:       rt.category,
          description:    rt.description ?? '',
          frequency:      rt.frequency,
          next_date:      rt.next_date,
          payment_method: rt.paymentMethod,
          synced_at:      new Date().toISOString(),
        }));
        const { error } = await supabase.from('recurring_transactions').upsert(rows, { onConflict: 'id' });
        if (error) console.warn('[sync] seed recurring error:', error);
      }

      // Subir preferencias
      await supabase.from('preferences').upsert(
        {
          device_id:       deviceId,
          savings_goal:    savingsGoal,
          category_colors: categoryColors,
          updated_at:      new Date().toISOString(),
        },
        { onConflict: 'device_id' }
      );

      this.setState({ status: 'synced', pendingCount: 0 });
      console.log('[sync] seedRemote complete —', transactions.length, 'transactions uploaded');
    } catch (e) {
      console.error('[sync] seedRemote error:', e);
      this.setState({ status: 'error' });
    }
  }
}

export interface SyncState {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  pendingCount: number;
}

export const syncService = new SyncService();
