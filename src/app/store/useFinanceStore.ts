import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import { Transaction, Budget, RecurringTransaction } from '../data/types';
import { dbService } from '../services/database';
import { syncService } from '../services/syncService';
import { toast } from 'sonner';
import { formatLocalDateForStorage, parseAppDate } from '../utils/date';

// --- Budget Alert Engine ---
const ALERTED_KEY = 'budget_alerts_session';

const checkBudgetAlerts = async (budgets: Budget[], categoryNames: Record<string, string>) => {
  const sessionRes = await Preferences.get({ key: ALERTED_KEY });
  const alerted: Record<string, number> = sessionRes.value ? JSON.parse(sessionRes.value) : {};
  let changed = false;

  for (const b of budgets) {
    if (b.limit <= 0) continue;
    const pct = (b.spent / b.limit) * 100;
    const name = categoryNames[b.category] ?? b.category;
    const prev = alerted[b.id] ?? 0;

    if (pct >= 100 && prev < 100) {
      toast.error(`🚨 Presupuesto de ${name} agotado (100%)`);
      alerted[b.id] = 100;
      changed = true;
    } else if (pct >= 90 && prev < 90) {
      toast.warning(`⚠️ ${name}: 90% del presupuesto usado`);
      alerted[b.id] = 90;
      changed = true;
    } else if (pct >= 70 && prev < 70) {
      toast.warning(`📊 ${name}: 70% del presupuesto usado`);
      alerted[b.id] = 70;
      changed = true;
    }
  }

  if (changed) {
    await Preferences.set({ key: ALERTED_KEY, value: JSON.stringify(alerted) });
  }
};

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  savingsGoal: number;
  categoryColors: Record<string, string>;
  updateSavingsGoal: (goal: number) => Promise<void>;
  recurring: RecurringTransaction[];
  updateCategoryColor: (categoryId: string, color: string) => Promise<void>;
  addRecurring: (rt: RecurringTransaction) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  budgets: [],
  recurring: [],
  isLoading: true,
  error: null,
  savingsGoal: 0,
  categoryColors: {},

  loadData: async () => {
    try {
      set({ isLoading: true, error: null });
      await dbService.init();

      // ── 1. Cargar datos locales primero (rápido, siempre disponible) ──────
      let transactions = await dbService.getTransactions();
      let budgets      = await dbService.getBudgets();
      let recurring    = await dbService.getRecurringTransactions();

      const goalRes   = await Preferences.get({ key: 'savings_goal' });
      const colorsRes = await Preferences.get({ key: 'category_colors' });

      let savingsGoal    = goalRes.value   ? parseFloat(goalRes.value)       : 0;
      let categoryColors = colorsRes.value ? JSON.parse(colorsRes.value)     : {};

      // Muestra datos locales de inmediato
      set({ transactions, budgets, recurring, savingsGoal, categoryColors, isLoading: false });

      // ── 2. Sync inteligente con Supabase (si hay internet) ───────────────
      // Drenar cola pendiente ANTES de hacer pull para evitar race condition:
      // si hay un delete encolado, hay que enviarlo a Supabase primero o el
      // pull traerá de vuelta la transacción eliminada.
      await syncService.drainQueue();
      const remote = await syncService.pull();
      if (remote) {
        const remoteHasData = remote.transactions.length > 0 || remote.budgets.length > 0;
        const localHasData  = transactions.length > 0 || budgets.length > 0;

        if (!remoteHasData && localHasData) {
          // Primera vez usando Supabase: sube todos los datos locales a la nube
          await syncService.seedRemote(transactions, budgets, recurring, savingsGoal, categoryColors);
        } else if (remoteHasData) {
          // Supabase tiene datos → es la fuente de verdad, reemplaza local
          await dbService.replaceAllData(remote.transactions, remote.budgets, remote.recurring);

          if (remote.savingsGoal !== savingsGoal) {
            await Preferences.set({ key: 'savings_goal', value: remote.savingsGoal.toString() });
          }
          if (Object.keys(remote.categoryColors).length > 0) {
            await Preferences.set({ key: 'category_colors', value: JSON.stringify(remote.categoryColors) });
          }

          transactions   = remote.transactions;
          budgets        = remote.budgets;
          recurring      = remote.recurring;
          savingsGoal    = remote.savingsGoal || savingsGoal;
          categoryColors = Object.keys(remote.categoryColors).length > 0 ? remote.categoryColors : categoryColors;

          set({ transactions, budgets, recurring, savingsGoal, categoryColors });
        }
        // Si ambos vacíos → no hacer nada
      }


      // ── 4. Catch-up de transacciones recurrentes ───────────────────────────
      const now = new Date();
      let addedAny = false;

      for (const rt of recurring) {
        let nextDate = parseAppDate(rt.next_date);
        let updated  = false;

        while (nextDate <= now) {
          const tx: Transaction = {
            id:            crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
            type:          rt.type,
            amount:        rt.amount,
            category:      rt.category,
            description:   rt.description,
            date:          formatLocalDateForStorage(nextDate),
            paymentMethod: rt.paymentMethod
          };

          await get().addTransaction(tx);
          addedAny = true;
          updated  = true;

          if (rt.frequency === 'daily')      nextDate.setDate(nextDate.getDate() + 1);
          else if (rt.frequency === 'weekly')    nextDate.setDate(nextDate.getDate() + 7);
          else if (rt.frequency === 'biweekly')  nextDate.setDate(nextDate.getDate() + 14);
          else if (rt.frequency === 'monthly')   nextDate.setMonth(nextDate.getMonth() + 1);
          else if (rt.frequency === 'yearly')    nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        if (updated) {
          const newStr = nextDate.toISOString();
          await dbService.updateRecurringTransactionDate(rt.id, newStr);
          // Sync la fecha actualizada
          await syncService.push({
            table: 'recurring_transactions',
            op: 'upsert',
            payload: { ...rt, next_date: newStr },
          });
          rt.next_date = newStr;
        }
      }

      if (addedAny) {
        set({ transactions: get().transactions, budgets: get().budgets, recurring });
      }

    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to load data', error);
    }
  },

  addTransaction: async (tx: Transaction) => {
    try {
      let newBudget: Budget | undefined = undefined;
      let currentState = useFinanceStore.getState();

      if (tx.type === 'expense') {
        const budget = currentState.budgets.find(b => b.category === tx.category);
        if (budget) {
          newBudget = { ...budget, spent: budget.spent + tx.amount };
        }
      }

      await dbService.addTransactionWithBudget(tx, newBudget);

      // Sync a Supabase
      await syncService.push({ table: 'transactions', op: 'upsert', payload: tx });
      if (newBudget) {
        await syncService.push({ table: 'budgets', op: 'upsert', payload: newBudget });
      }

      set((state) => {
        let updatedBudgets = state.budgets;
        if (newBudget) {
          updatedBudgets = state.budgets.map(b => b.id === newBudget!.id ? newBudget! : b);
        }
        const categoryNames = updatedBudgets.reduce((acc, b) => ({ ...acc, [b.category]: b.category }), {} as Record<string, string>);
        checkBudgetAlerts(updatedBudgets, categoryNames).catch(console.error);
        return {
          transactions: [tx, ...state.transactions],
          budgets: updatedBudgets
        };
      });

    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateTransaction: async (tx: Transaction) => {
    try {
      let currentState = useFinanceStore.getState();
      const oldTx = currentState.transactions.find(t => t.id === tx.id);
      if (!oldTx) throw new Error("Transaction not found");

      let oldBudgetRevert: Budget | undefined = undefined;
      let newBudgetApply: Budget | undefined  = undefined;

      if (oldTx.category === tx.category) {
        if (oldTx.type === 'expense' && tx.type === 'expense') {
          const diff   = tx.amount - oldTx.amount;
          const budget = currentState.budgets.find(b => b.category === tx.category);
          if (budget) newBudgetApply = { ...budget, spent: Math.max(0, budget.spent + diff) };
        } else if (oldTx.type === 'expense' && tx.type !== 'expense') {
          const budget = currentState.budgets.find(b => b.category === oldTx.category);
          if (budget) newBudgetApply = { ...budget, spent: Math.max(0, budget.spent - oldTx.amount) };
        } else if (oldTx.type !== 'expense' && tx.type === 'expense') {
          const budget = currentState.budgets.find(b => b.category === tx.category);
          if (budget) newBudgetApply = { ...budget, spent: budget.spent + tx.amount };
        }
      } else {
        if (oldTx.type === 'expense') {
          const budget = currentState.budgets.find(b => b.category === oldTx.category);
          if (budget) oldBudgetRevert = { ...budget, spent: Math.max(0, budget.spent - oldTx.amount) };
        }
        if (tx.type === 'expense') {
          const budget = currentState.budgets.find(b => b.category === tx.category);
          if (budget) newBudgetApply = { ...budget, spent: budget.spent + tx.amount };
        }
      }

      await dbService.updateTransactionWithBudgets(tx, oldBudgetRevert, newBudgetApply);

      // Sync
      await syncService.push({ table: 'transactions', op: 'upsert', payload: tx });
      if (oldBudgetRevert) await syncService.push({ table: 'budgets', op: 'upsert', payload: oldBudgetRevert });
      if (newBudgetApply)  await syncService.push({ table: 'budgets', op: 'upsert', payload: newBudgetApply });

      set((state) => {
        const newTransactions = state.transactions.map(t => t.id === tx.id ? tx : t);
        let newBudgets = state.budgets.map(b => {
          if (oldBudgetRevert && b.id === oldBudgetRevert.id) return oldBudgetRevert;
          if (newBudgetApply  && b.id === newBudgetApply.id)  return newBudgetApply;
          return b;
        });
        return { transactions: newTransactions, budgets: newBudgets };
      });

    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      let currentState = useFinanceStore.getState();
      const tx = currentState.transactions.find(t => t.id === id);
      if (!tx) return;

      let revertBudget: Budget | undefined = undefined;

      if (tx.type === 'expense') {
        const budget = currentState.budgets.find(b => b.category === tx.category);
        if (budget) {
          revertBudget = { ...budget, spent: Math.max(0, budget.spent - tx.amount) };
        }
      }

      await dbService.deleteTransactionWithBudget(id, revertBudget);

      // Sync (soft delete en Supabase)
      await syncService.push({ table: 'transactions', op: 'delete', payload: tx });
      if (revertBudget) await syncService.push({ table: 'budgets', op: 'upsert', payload: revertBudget });

      set((state) => {
        const newTransactions = state.transactions.filter(t => t.id !== id);
        let newBudgets = state.budgets;
        if (revertBudget) {
          newBudgets = state.budgets.map(b => b.id === revertBudget!.id ? revertBudget! : b);
        }
        return { transactions: newTransactions, budgets: newBudgets };
      });

    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addBudget: async (budget: Budget) => {
    try {
      await dbService.addBudget(budget);
      await syncService.push({ table: 'budgets', op: 'upsert', payload: budget });
      set((state) => ({ budgets: [...state.budgets, budget] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateBudget: async (budget: Budget) => {
    try {
      await dbService.updateBudget(budget);
      await syncService.push({ table: 'budgets', op: 'upsert', payload: budget });
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateSavingsGoal: async (goal: number) => {
    try {
      await Preferences.set({ key: 'savings_goal', value: goal.toString() });
      set({ savingsGoal: goal });
      // Sync preferencias completas
      const { categoryColors } = useFinanceStore.getState();
      await syncService.syncPreferences(goal, categoryColors);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateCategoryColor: async (categoryId: string, color: string) => {
    try {
      set((state) => {
        const newColors = { ...state.categoryColors, [categoryId]: color };
        Preferences.set({ key: 'category_colors', value: JSON.stringify(newColors) }).catch(console.error);
        // Sync preferencias con los nuevos colores
        syncService.syncPreferences(state.savingsGoal, newColors).catch(console.error);
        return { categoryColors: newColors };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addRecurring: async (rt: RecurringTransaction) => {
    try {
      await dbService.addRecurringTransaction(rt);
      await syncService.push({ table: 'recurring_transactions', op: 'upsert', payload: rt });
      set((state) => ({ recurring: [...state.recurring, rt] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteRecurring: async (id: string) => {
    try {
      const rt = useFinanceStore.getState().recurring.find(r => r.id === id);
      await dbService.deleteRecurringTransaction(id);
      if (rt) await syncService.push({ table: 'recurring_transactions', op: 'delete', payload: rt });
      set((state) => ({
        recurring: state.recurring.filter((rt) => rt.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
