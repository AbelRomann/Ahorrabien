import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Transaction, Budget } from '../data/types'; // We'll need to create this

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
}

export const dbService = new DatabaseService();
