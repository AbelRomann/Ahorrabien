import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <p className="text-white/80 text-sm mb-2">Balance Total</p>
      <h2 className="text-white text-4xl font-bold mb-4">
        ${balance.toLocaleString()}
      </h2>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E]/20 rounded-lg flex items-center justify-center">
            <ArrowDownRight size={16} className="text-[#22C55E]" />
          </div>
          <div>
            <p className="text-white/60 text-xs">Ingresos</p>
            <p className="text-white font-semibold">${income.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#EF4444]/20 rounded-lg flex items-center justify-center">
            <ArrowUpRight size={16} className="text-[#EF4444]" />
          </div>
          <div>
            <p className="text-white/60 text-xs">Gastos</p>
            <p className="text-white font-semibold">${expenses.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
