import React from 'react';
import { getCategoryById } from '../data/categories';
import { Transaction } from '../data/mockData';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const category = getCategoryById(transaction.category);
  const Icon = category?.icon;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
      {Icon && (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${category?.color}20` }}
        >
          <Icon size={24} style={{ color: category?.color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">{category?.name}</p>
      </div>
    </div>
  );
}
