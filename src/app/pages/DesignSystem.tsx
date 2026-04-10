import React from 'react';
import { CurrencySwitch, FilterChips, ProgressTrack } from '../components/fintech/FintechElements';

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-[#f6faf8] p-6 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-4xl font-black">GastaBien Design System</h1>
          <p className="mt-1 text-slate-500">Componentes reutilizables para una app fintech premium.</p>
        </header>

        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <h2 className="mb-4 text-2xl font-bold">Chips & estados</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterChips options={['Hoy', 'Semana', 'Mes', 'Año']} active="Mes" />
            <CurrencySwitch active="RDS" />
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Activo</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">Inactivo</span>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <h2 className="mb-4 text-2xl font-bold">Cards financieras</h2>
          <div className="space-y-3">
            <article className="rounded-3xl bg-gradient-to-br from-[#1FA971] to-[#22C55E] p-5 text-white">
              <p className="text-sm uppercase tracking-[0.2em]">Balance del mes</p>
              <p className="mt-2 text-5xl font-black">RD$29,886.00</p>
            </article>
            <article className="rounded-3xl border border-slate-100 bg-white p-5">
              <p className="text-sm text-slate-500">Presupuesto mensual</p>
              <p className="text-4xl font-black">RD$23,000.00</p>
              <div className="mt-3"><ProgressTrack value={42} /></div>
            </article>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <h2 className="mb-4 text-2xl font-bold">Inputs & botón principal</h2>
          <div className="space-y-3">
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4" placeholder="Buscar transacciones" />
            <button className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#1FA971] to-[#22C55E] text-lg font-semibold text-white shadow-[0_10px_25px_rgba(34,197,94,0.35)]">Agregar gasto</button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <h2 className="mb-4 text-2xl font-bold">Bottom navigation</h2>
          <div className="grid grid-cols-4 gap-2 rounded-3xl bg-slate-50 p-3">
            {['Inicio', 'Transacciones', 'Cuentas', 'Límites'].map((item, index) => (
              <div key={item} className={`rounded-2xl px-2 py-3 text-center text-xs font-semibold ${index === 0 ? 'bg-gradient-to-r from-[#1FA971] to-[#22C55E] text-white' : 'text-slate-500'}`}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
