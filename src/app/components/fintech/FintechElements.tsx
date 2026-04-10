import React from 'react';

export function FintechBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(74,222,128,0.34),transparent_40%),radial-gradient(circle_at_15%_30%,rgba(16,185,129,0.22),transparent_35%),linear-gradient(165deg,#072a23_0%,#0b5c46_45%,#14895f_100%)]" />
      <div className="pointer-events-none absolute left-[-25%] top-[28%] h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[14%] right-[-15%] h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.65)_0.8px,transparent_0.8px)] [background-size:36px_36px]" />
    </>
  );
}

type FilterChipsProps = {
  options: string[];
  active: string;
  onChange?: (option: string) => void;
};

export function FilterChips({ options, active, onChange }: FilterChipsProps) {
  return (
    <div className="inline-flex rounded-full bg-white/22 p-1 backdrop-blur-sm">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              isActive ? 'bg-white text-emerald-700 shadow-sm' : 'text-white/85 hover:text-white'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

type CurrencySwitchProps = {
  active: 'RDS' | 'US$';
  onChange?: (currency: 'RDS' | 'US$') => void;
};

export function CurrencySwitch({ active, onChange }: CurrencySwitchProps) {
  return (
    <div className="inline-flex rounded-full bg-white/22 p-1 backdrop-blur-sm">
      {(['RDS', 'US$'] as const).map((currency) => (
        <button
          key={currency}
          type="button"
          onClick={() => onChange?.(currency)}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
            active === currency ? 'bg-white text-emerald-700' : 'text-white/85'
          }`}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}

export function ProgressTrack({ value, tone = 'green' }: { value: number; tone?: 'green' | 'red' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${tone === 'green' ? 'bg-gradient-to-r from-[#1FA971] to-[#22C55E]' : 'bg-gradient-to-r from-[#f87171] to-[#ef4444]'}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
