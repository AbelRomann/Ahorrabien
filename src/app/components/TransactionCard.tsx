import React, { useState } from 'react';
import { getCategoryById } from '../data/categories';
import { Transaction } from '../data/types';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFinanceStore } from '../store/useFinanceStore';
import { toast } from 'sonner';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const category = getCategoryById(transaction.category);
  const Icon = category?.icon;
  const navigate = useNavigate();
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      await deleteTransaction(transaction.id);
      toast.success('Movimiento eliminado');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-transaction/${transaction.id}`);
  };

  return (
    <div 
      className="flex flex-col p-0 bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200"
    >
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30"
        onClick={() => setExpanded(!expanded)}
      >
        {Icon && (
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            <Icon size={24} style={{ color: category?.color }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate font-medium">{transaction.description || 'Sin descripción'}</p>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className={`font-semibold ${
            transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mb-1">{category?.name}</p>
        </div>
        
        <div className="text-muted-foreground ml-1">
           {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded Actions */}
      {expanded && (
        <div className="flex bg-muted/20 border-t border-border p-2 px-4 justify-end gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium"
          >
            <Edit2 size={16} />
            Editar
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors font-medium"
          >
            <Trash2 size={16} />
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}
