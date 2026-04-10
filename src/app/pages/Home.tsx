import React, { useMemo, useState } from 'react';
import { ArrowUp, CircleDollarSign, Gauge, Sparkles, Target } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { CurrencySwitch, FilterChips, FintechBackdrop, ProgressTrack } from '../components/fintech/FintechElements';
import { FintechBottomNav } from '../components/fintech/FintechBottomNav';

const periodOptions = ['Hoy', 'Semana', 'Mes', 'Año'];

export function Home() {
  const [activePeriod, setActivePeriod] = useState('Mes');
  const [currency, setCurrency] = useState<'RDS' | 'US$'>('RDS');
  const transactions = useFinanceStore((state) => state.transactions);

  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const average = expenses / Math.max(new Date().getDate(), 1);
    const monthlyBudget = 38000;
    const pulse = Math.min((average / 1600) * 100, 100);
    const monthProgress = Math.min((expenses / monthlyBudget) * 100, 100);

    return {
      expenses,
      average,
      monthlyBudget,
      pulse,
      monthProgress,
    };
  }, [transactions]);

  const formatter = (amount: number) => {
    const converted = currency === 'US$' ? amount / 58 : amount;
    return `${currency === 'US$' ? 'US$' : 'RD$'}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 pb-28 text-slate-900">
      <FintechBackdrop />

      <section className="relative px-6 pb-10 pt-12 text-white">
        <p className="text-center text-xs uppercase tracking-[0.28em] text-white/75">Hoy es</p>
        <h1 className="mt-2 text-center text-4xl font-bold">Mar, 17 de marzo</h1>

        <div className="mt-6 flex justify-center">
          <FilterChips options={periodOptions} active={activePeriod} onChange={setActivePeriod} />
        </div>

        <p className="mt-7 text-center text-sm uppercase tracking-[0.2em] text-white/80">Este mes has gastado</p>
        <p className="mt-1 text-center text-5xl font-black tracking-tight">{formatter(stats.expenses || 29886)}</p>

        <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm">
          <ArrowUp size={14} className="rounded-full bg-rose-500 p-0.5" />
          <span>100% más que el mes pasado</span>
        </div>

        <div className="mt-5 flex justify-center">
          <CurrencySwitch active={currency} onChange={setCurrency} />
        </div>
      </section>

      <section className="relative -mt-1 rounded-t-[34px] bg-[#f7faf9] px-5 pb-24 pt-5 shadow-[0_-16px_50px_rgba(2,6,23,0.1)]">
        <article className="rounded-[24px] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <div className="mb-3 flex items-center gap-2 text-slate-500">
            <CircleDollarSign size={16} className="text-[#1FA971]" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Gasto promedio mensual</p>
          </div>
          <p className="text-4xl font-black text-slate-900">{formatter(stats.average * 30 || 18768)}</p>
        </article>

        <article className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500">
                <Gauge size={15} className="text-[#1FA971]" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Pulso diario</p>
              </div>
              <p className="text-sm font-semibold text-[#1FA971]">Vas bien hoy</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.pulse.toFixed(0)}%</p>
          </div>
          <ProgressTrack value={stats.pulse} />
          <div className="mt-3 flex justify-between text-sm">
            <p className="text-slate-500">Gastado hoy <span className="font-bold text-slate-900">{formatter(0)}</span></p>
            <p className="text-slate-500">Meta diaria <span className="font-bold text-slate-900">{formatter(1548.39)}</span></p>
          </div>
        </article>

        <article className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <div className="mb-3 flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <Target size={15} className="text-[#1FA971]" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Presupuesto del mes</p>
            </div>
            <Sparkles size={16} className="text-[#1FA971]" />
          </div>
          <p className="text-xl font-bold text-slate-900">{formatter(stats.monthlyBudget - stats.expenses)} disponible</p>
          <p className="mb-3 text-sm text-slate-500">de {formatter(stats.monthlyBudget)}</p>
          <ProgressTrack value={stats.monthProgress} tone={stats.monthProgress > 90 ? 'red' : 'green'} />
        </article>
      </section>

      <FintechBottomNav />
    </div>
  );
}
