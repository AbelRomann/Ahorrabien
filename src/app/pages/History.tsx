import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { Input } from '../components/ui/input';
import { TransactionCard } from '../components/TransactionCard';
import { BottomNav } from '../components/BottomNav';
import { mockTransactions } from '../data/mockData';
import { categories } from '../data/categories';

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const key = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);
    return acc;
  }, {} as Record<string, typeof mockTransactions>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">Historial</h1>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-12 bg-background border-border rounded-2xl"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-background border border-border text-muted-foreground'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filterType === 'income'
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-background border border-border text-muted-foreground'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filterType === 'expense'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-background border border-border text-muted-foreground'
              }`}
            >
              Gastos
            </button>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="px-6 pt-4">
        {Object.entries(groupedTransactions).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar size={40} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No hay transacciones</h3>
            <p className="text-sm text-muted-foreground text-center">
              Tus transacciones aparecerán aquí
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-3 font-semibold">{date}</h3>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
