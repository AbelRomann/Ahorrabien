import React, { useMemo, useState } from 'react';
import { CirclePlus, ShieldCheck } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { CurrencySwitch, FintechBackdrop, ProgressTrack } from '../components/fintech/FintechElements';
import { FintechBottomNav } from '../components/fintech/FintechBottomNav';
import { getCategoryById } from '../data/categories';

export function Budgets() {
  const [currency, setCurrency] = useState<'RDS' | 'US$'>('RDS');
  const budgets = useFinanceStore((state) => state.budgets);

  const summary = useMemo(() => {
    const total = budgets.reduce((sum, b) => sum + b.limit, 0);
    const spent = budgets.reduce((sum, b) => sum + b.spent, 0);
    return {
      total,
      spent,
      available: total - spent,
      used: total ? (spent / total) * 100 : 0,
    };
  }, [budgets]);

  const formatAmount = (amount: number) => {
    const value = currency === 'US$' ? amount / 58 : amount;
    return `${currency === 'US$' ? 'US$' : 'RD$'}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7f6] pb-28 text-slate-900">
      <FintechBackdrop />

      <header className="relative rounded-b-[30px] bg-gradient-to-br from-[#1FA971] to-[#22C55E] px-5 pb-7 pt-12 text-white shadow-[0_20px_45px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-black">Límites</h1>
            <p className="mt-1 text-white/80">Define cuánto quieres gastar</p>
          </div>
          <div className="flex items-center gap-2">
            <CurrencySwitch active={currency} onChange={setCurrency} />
            <button className="rounded-full border border-white/45 bg-white/20 p-2.5"><CirclePlus size={18} /></button>
          </div>
        </div>
      </header>

      <main className="relative space-y-5 px-5 pt-5">
        <section className="rounded-[26px] bg-gradient-to-br from-[#1FA971] to-[#3dd9a4] p-6 text-white shadow-[0_15px_38px_rgba(16,185,129,0.35)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Resumen mensual</p>
            </div>
            <p className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{summary.used.toFixed(0)}%</p>
          </div>
          <p className="text-sm text-white/85">Presupuesto total</p>
          <p className="text-5xl font-black">{formatAmount(summary.total)}</p>
          <div className="my-4 h-px bg-white/25" />
          <div className="space-y-1">
            <p className="text-2xl font-bold">Gastado {formatAmount(summary.spent)}</p>
            <p className="text-2xl font-bold text-emerald-50">Disponible {formatAmount(summary.available)}</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tus límites activos</h2>
            <p className="font-bold text-[#1FA971]">{budgets.length} límites</p>
          </div>

          <div className="space-y-4">
            {budgets.map((budget) => {
              const category = getCategoryById(budget.category);
              const used = budget.limit ? (budget.spent / budget.limit) * 100 : 0;
              const left = budget.limit - budget.spent;
              return (
                <article key={budget.id} className="rounded-[24px] bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${category?.color}20` }}>
                        <span className="text-xl">🧾</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{category?.name || 'Categoría'}</p>
                        <p className="text-sm text-slate-500">Mensual</p>
                      </div>
                    </div>
                    <p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-[#1FA971]">{used.toFixed(0)}%</p>
                  </div>
                  <ProgressTrack value={used} tone={used >= 100 ? 'red' : 'green'} />
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-slate-500">Gastado <span className="block text-2xl font-black text-slate-900">{formatAmount(budget.spent)}</span></p>
                    <p className="text-right text-slate-500">Disponible <span className="block text-2xl font-black text-[#1FA971]">{formatAmount(left)}</span></p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <FintechBottomNav />
    </div>
  );
}
