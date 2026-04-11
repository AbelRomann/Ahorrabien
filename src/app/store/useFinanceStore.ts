import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import { Transaction, Budget } from '../data/types';
import { dbService } from '../services/database';

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
  updateCategoryColor: (categoryId: string, color: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  budgets: [],
  isLoading: true,
  error: null,
  savingsGoal: 0,
  categoryColors: {},

  loadData: async () => {
    try {
      set({ isLoading: true, error: null });
      await dbService.init();
      const transactions = await dbService.getTransactions();
      const budgets = await dbService.getBudgets();
      
      const goalRes = await Preferences.get({ key: 'savings_goal' });
      const colorsRes = await Preferences.get({ key: 'category_colors' });
      
      const savingsGoal = goalRes.value ? parseFloat(goalRes.value) : 0;
      const categoryColors = colorsRes.value ? JSON.parse(colorsRes.value) : {};

      set({ transactions, budgets, savingsGoal, categoryColors, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to load data', error);
    }
  },

  addTransaction: async (tx: Transaction) => {
    try {
      await dbService.addTransaction(tx);
      set((state) => ({ transactions: [tx, ...state.transactions] }));
      
      // Update budget spent amount if applicable
      set((state) => {
        if (tx.type === 'expense') {
          const updatedBudgets = state.budgets.map(b => {
            if (b.category === tx.category) {
              const newBudget = { ...b, spent: b.spent + tx.amount };
              dbService.updateBudget(newBudget); // Fire and forget update to DB
              return newBudget;
            }
            return b;
          });
          return { budgets: updatedBudgets };
        }
        return state;
      });
      
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateTransaction: async (tx: Transaction) => {
    try {
      // First, we need to revert the old transaction's impact on the budget, then apply the new one.
      // To keep it robust, let's just let the delete and add logic handle it if they need to, 
      // but for simplicity we will do a targeted budget update here.
      let oldTx: Transaction | undefined;
      set((state) => {
        oldTx = state.transactions.find(t => t.id === tx.id);
        return state;
      });

      await dbService.updateTransaction(tx);
      
      set((state) => {
        const newTransactions = state.transactions.map(t => t.id === tx.id ? tx : t);
        let newBudgets = state.budgets;
        
        // Re-adjust budget if category or amount or type changed
        if (oldTx) {
          // Revert old impact
          if (oldTx.type === 'expense') {
            newBudgets = newBudgets.map(b => {
              if (b.category === oldTx?.category) {
                const revertAmount = Math.max(0, b.spent - oldTx.amount);
                dbService.updateBudget({ ...b, spent: revertAmount });
                return { ...b, spent: revertAmount };
              }
              return b;
            });
          }
          // Apply new impact
          if (tx.type === 'expense') {
            newBudgets = newBudgets.map(b => {
              if (b.category === tx.category) {
                const addAmount = b.spent + tx.amount;
                dbService.updateBudget({ ...b, spent: addAmount });
                return { ...b, spent: addAmount };
              }
              return b;
            });
          }
        }
        
        return { transactions: newTransactions, budgets: newBudgets };
      });
      
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      // First, get the transaction to update budget appropriately
      let txAmount = 0;
      let txCategory = '';
      let txType = '';
      set((state) => {
        const tx = state.transactions.find(t => t.id === id);
        if (tx) {
          txAmount = tx.amount;
          txCategory = tx.category;
          txType = tx.type;
        }
        return state; // Doesn't change state yet
      });

      await dbService.deleteTransaction(id);
      
      set((state) => {
        const newTransactions = state.transactions.filter(t => t.id !== id);
        let newBudgets = state.budgets;
        
        // Revert budget spent amount if it was an expense
        if (txType === 'expense') {
           newBudgets = state.budgets.map(b => {
             if (b.category === txCategory) {
               const updated = { ...b, spent: Math.max(0, b.spent - txAmount) };
               dbService.updateBudget(updated);
               return updated;
             }
             return b;
           });
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
      set((state) => ({ budgets: [...state.budgets, budget] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateBudget: async (budget: Budget) => {
    try {
      await dbService.updateBudget(budget);
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
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateCategoryColor: async (categoryId: string, color: string) => {
    try {
      set((state) => {
        const newColors = { ...state.categoryColors, [categoryId]: color };
        Preferences.set({ key: 'category_colors', value: JSON.stringify(newColors) }).catch(console.error);
        return { categoryColors: newColors };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
