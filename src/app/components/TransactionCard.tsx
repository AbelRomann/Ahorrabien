import React, { useState } from 'react';
import { getCategoryById } from '../data/categories';
import { Transaction } from '../data/types';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFinanceStore } from '../store/useFinanceStore';
import { toast } from 'sonner';
import { formatDateLabel } from '../utils/date';
import { AnimatePresence, motion } from 'motion/react';

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
    return formatDateLabel(dateStr);
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col p-0 bg-surface-elevated/90 rounded-2xl overflow-hidden transition-all duration-200 shadow-[0_12px_34px_rgba(0,0,0,0.18)] ring-1 ring-white/6"
    >
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.04]"
        onClick={() => setExpanded(!expanded)}
      >
        {Icon && (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
            style={{ background: `linear-gradient(145deg, ${category?.color}33, ${category?.color}12)` }}
          >
            <Icon size={24} style={{ color: category?.color }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate font-medium">{transaction.description || 'Sin descripción'}</p>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className={`rounded-full px-2.5 py-1 text-sm font-bold ${
            transaction.type === 'income' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground mb-1">{category?.name}</p>
        </div>
        
        <div className="text-muted-foreground ml-1">
           {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded Actions */}
      <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
        <div className="flex bg-white/[0.03] border-t border-white/10 p-2 px-4 justify-end gap-2">
          <button 
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl font-medium"
          >
            <Edit2 size={16} />
            Editar
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl font-medium"
          >
            <Trash2 size={16} />
            Borrar
          </button>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
