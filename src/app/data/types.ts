export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}
