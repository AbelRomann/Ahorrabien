import React, { useMemo, useState } from 'react';
import { Funnel, Plus, Search } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { CurrencySwitch, FintechBackdrop } from '../components/fintech/FintechElements';
import { FintechBottomNav } from '../components/fintech/FintechBottomNav';

export function History() {
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState<'RDS' | 'US$'>('RDS');
  const transactions = useFinanceStore((state) => state.transactions);

  const grouped = useMemo(() => {
    const filtered = transactions.filter((t) => (t.description ?? '').toLowerCase().includes(search.toLowerCase()));

    return filtered.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleDateString('es-DO', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    }, {} as Record<string, typeof transactions>);
  }, [transactions, search]);

  const formatAmount = (amount: number) => {
    const value = currency === 'US$' ? amount / 58 : amount;
    return `${currency === 'US$' ? 'US$' : 'RD$'}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7f6] pb-28 text-slate-900">
      <FintechBackdrop />

      <header className="relative rounded-b-[30px] bg-gradient-to-br from-[#1FA971] to-[#22C55E] px-5 pb-6 pt-12 text-white shadow-[0_20px_45px_rgba(0,0,0,0.18)]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-4xl font-black">Transacciones</h1>
          <div className="flex gap-2">
            <button className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm"><Funnel size={18} /></button>
            <button className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm"><Plus size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/75" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar transacciones"
              className="h-11 w-full rounded-2xl border-0 bg-white/20 pl-10 pr-3 text-white placeholder:text-white/70"
            />
          </div>
          <CurrencySwitch active={currency} onChange={setCurrency} />
        </div>
      </header>

      <main className="relative px-5 pt-5">
        {Object.entries(grouped).map(([month, items]) => {
          const monthlyTotal = items.reduce((sum, tx) => sum + tx.amount, 0);
          return (
            <section key={month} className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold capitalize">{month}</h2>
                <p className="text-sm font-semibold text-slate-500">{formatAmount(monthlyTotal)} total gastado</p>
              </div>

              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.08)]">
                {items.map((transaction) => (
                  <article key={transaction.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6fff2] text-lg">🏪</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-slate-900">{transaction.description || 'Comercio'}</p>
                      <p className="text-sm text-slate-500">{transaction.paymentMethod || transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900">{formatAmount(transaction.amount)}</p>
                      <p className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString('es-DO')}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <FintechBottomNav />
    </div>
  );
}
