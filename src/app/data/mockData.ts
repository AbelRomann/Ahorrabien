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

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 450,
    category: 'food',
    description: 'Supermercado',
    date: '2026-04-08',
    paymentMethod: 'Tarjeta'
  },
  {
    id: '2',
    type: 'expense',
    amount: 200,
    category: 'transport',
    description: 'Gasolina',
    date: '2026-04-08',
    paymentMethod: 'Efectivo'
  },
  {
    id: '3',
    type: 'income',
    amount: 35000,
    category: 'salary',
    description: 'Salario abril',
    date: '2026-04-01',
    paymentMethod: 'Transferencia'
  },
  {
    id: '4',
    type: 'expense',
    amount: 1200,
    category: 'services',
    description: 'Luz y agua',
    date: '2026-04-07',
    paymentMethod: 'Transferencia'
  },
  {
    id: '5',
    type: 'expense',
    amount: 800,
    category: 'entertainment',
    description: 'Cine y cena',
    date: '2026-04-06',
    paymentMethod: 'Tarjeta'
  },
  {
    id: '6',
    type: 'expense',
    amount: 350,
    category: 'food',
    description: 'Restaurante',
    date: '2026-04-05',
    paymentMethod: 'Tarjeta'
  },
  {
    id: '7',
    type: 'expense',
    amount: 600,
    category: 'health',
    description: 'Consulta médica',
    date: '2026-04-04',
    paymentMethod: 'Efectivo'
  },
  {
    id: '8',
    type: 'expense',
    amount: 280,
    category: 'transport',
    description: 'Uber',
    date: '2026-04-03',
    paymentMethod: 'Tarjeta'
  },
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'food', limit: 5000, spent: 800 },
  { id: '2', category: 'transport', limit: 3000, spent: 480 },
  { id: '3', category: 'services', limit: 4000, spent: 1200 },
  { id: '4', category: 'entertainment', limit: 2000, spent: 800 },
  { id: '5', category: 'health', limit: 2500, spent: 600 },
];
