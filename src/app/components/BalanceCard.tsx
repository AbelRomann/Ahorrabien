import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[1.9rem] border border-white/12 bg-[linear-gradient(145deg,rgba(25,192,159,0.34),rgba(7,91,114,0.92))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.2),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-shimmer" />
      <p className="relative text-white/72 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">Balance Total</p>
      <motion.h2
        key={balance}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-white text-[2.4rem] font-extrabold leading-none tracking-tight"
      >
        ${balance.toLocaleString()}
      </motion.h2>
      <div className="relative mt-5 grid grid-cols-2 gap-5 rounded-[1.4rem] border border-white/10 bg-black/12 px-3.5 py-3 backdrop-blur-xl">
        <div className="pointer-events-none absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-white/14" />
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#22C55E]/14 ring-1 ring-[#22C55E]/22">
            <ArrowDownRight size={15} className="text-[#86EFAC]" />
          </div>
          <div className="min-w-0">
            <p className="text-white/60 text-[11px] font-medium">Ingresos</p>
            <p className="text-white text-[clamp(0.84rem,2.8vw,1rem)] font-semibold leading-tight tracking-tight">
              ${income.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/14 ring-1 ring-[#EF4444]/22">
            <ArrowUpRight size={15} className="text-[#FCA5A5]" />
          </div>
          <div className="min-w-0">
            <p className="text-white/60 text-[11px] font-medium">Gastos</p>
            <p className="text-white text-[clamp(0.84rem,2.8vw,1rem)] font-semibold leading-tight tracking-tight">
              ${expenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
