import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Transaction, Budget, RecurringTransaction } from '../data/types'; // We'll need to create this

const DB_NAME = 'ahorrrard_db';

class DatabaseService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private isReady: boolean = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async init(): Promise<void> {
    if (this.isReady) return;

    try {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'web') {
        const jeepSqliteEl = document.querySelector('jeep-sqlite');
        if (jeepSqliteEl != null) {
          await this.sqlite.initWebStore();
        }
      }

      this.db = await this.sqlite.createConnection(
        DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();

      // Create Tables
      const schema = `
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          paymentMethod TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY NOT NULL,
          category TEXT NOT NULL,
          "limit" REAL NOT NULL,
          spent REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS recurring_transactions (
          id TEXT PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          frequency TEXT NOT NULL,
          next_date TEXT NOT NULL,
          paymentMethod TEXT NOT NULL
        );
      `;
      await this.db.execute(schema);
      this.isReady = true;
    } catch (e) {
      console.error('Error initializing DB:', e);
      throw e;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.isReady) await this.init();
    const res = await this.db.query('SELECT * FROM transactions ORDER BY date DESC');
    return res.values as Transaction[] || [];
  }

  async addTransaction(tx: Transaction): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'INSERT INTO transactions (id, type, amount, category, description, date, paymentMethod) VALUES (?,?,?,?,?,?,?)',
      [tx.id, tx.type, tx.amount, tx.category, tx.description, tx.date, tx.paymentMethod]
    );
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run('DELETE FROM transactions WHERE id = ?', [id]);
  }

  async updateTransaction(tx: Transaction): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ?, paymentMethod = ? WHERE id = ?',
      [tx.type, tx.amount, tx.category, tx.description, tx.date, tx.paymentMethod, tx.id]
    );
  }

  async getBudgets(): Promise<Budget[]> {
    if (!this.isReady) await this.init();
    const res = await this.db.query('SELECT * FROM budgets');
    return res.values as Budget[] || [];
  }

  async addBudget(budget: Budget): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'INSERT INTO budgets (id, category, "limit", spent) VALUES (?,?,?,?)',
      [budget.id, budget.category, budget.limit, budget.spent]
    );
  }

  async updateBudget(budget: Budget): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
      [budget.limit, budget.spent, budget.id]
    );
  }

  async executeSet(set: capSQLiteSet[]): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.executeSet(set);
  }

  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    if (!this.isReady) await this.init();
    const res = await this.db.query('SELECT * FROM recurring_transactions ORDER BY next_date ASC');
    return res.values as RecurringTransaction[] || [];
  }

  async addRecurringTransaction(rt: RecurringTransaction): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'INSERT INTO recurring_transactions (id, type, amount, category, description, frequency, next_date, paymentMethod) VALUES (?,?,?,?,?,?,?,?)',
      [rt.id, rt.type, rt.amount, rt.category, rt.description, rt.frequency, rt.next_date, rt.paymentMethod]
    );
  }

  async updateRecurringTransactionDate(id: string, next_date: string): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run(
      'UPDATE recurring_transactions SET next_date = ? WHERE id = ?',
      [next_date, id]
    );
  }

  async deleteRecurringTransaction(id: string): Promise<void> {
    if (!this.isReady) await this.init();
    await this.db.run('DELETE FROM recurring_transactions WHERE id = ?', [id]);
  }

  async addTransactionWithBudget(tx: Transaction, budget?: Budget): Promise<void> {
    const set: capSQLiteSet[] = [
      {
        statement: 'INSERT INTO transactions (id, type, amount, category, description, date, paymentMethod) VALUES (?,?,?,?,?,?,?)',
        values: [tx.id, tx.type, tx.amount, tx.category, tx.description, tx.date, tx.paymentMethod]
      }
    ];
    if (budget) {
      set.push({
        statement: 'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
        values: [budget.limit, budget.spent, budget.id]
      });
    }
    await this.executeSet(set);
  }

  async deleteTransactionWithBudget(id: string, budget?: Budget): Promise<void> {
    const set: capSQLiteSet[] = [
      {
        statement: 'DELETE FROM transactions WHERE id = ?',
        values: [id]
      }
    ];
    if (budget) {
      set.push({
        statement: 'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
        values: [budget.limit, budget.spent, budget.id]
      });
    }
    await this.executeSet(set);
  }

  async updateTransactionWithBudgets(tx: Transaction, oldBudget?: Budget, newBudget?: Budget): Promise<void> {
    const set: capSQLiteSet[] = [
      {
        statement: 'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ?, paymentMethod = ? WHERE id = ?',
        values: [tx.type, tx.amount, tx.category, tx.description, tx.date, tx.paymentMethod, tx.id]
      }
    ];
    if (oldBudget) {
      set.push({
        statement: 'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
        values: [oldBudget.limit, oldBudget.spent, oldBudget.id]
      });
    }
    if (newBudget && newBudget.id !== oldBudget?.id) {
       set.push({
        statement: 'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
        values: [newBudget.limit, newBudget.spent, newBudget.id]
      });
    } else if (newBudget && newBudget.id === oldBudget?.id) {
       // If it's the exact same budget object reference just updated, the oldBudget block above already overrides it conceptually, but typically we'd just want to apply the final state.
       // Let's replace the last statement if it's the same budget ID to just reflect the newBudget.
       set.pop(); // remove oldBudget update
       set.push({
        statement: 'UPDATE budgets SET "limit" = ?, spent = ? WHERE id = ?',
        values: [newBudget.limit, newBudget.spent, newBudget.id]
      });
    }
    await this.executeSet(set);
  }
}

export const dbService = new DatabaseService();
