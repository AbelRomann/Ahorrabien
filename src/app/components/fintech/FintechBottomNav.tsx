import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, ScrollText, WalletCards, SlidersHorizontal } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'Inicio', icon: Home },
  { path: '/history', label: 'Transacciones', icon: ScrollText },
  { path: '/reports', label: 'Cuentas', icon: WalletCards },
  { path: '/budgets', label: 'Límites', icon: SlidersHorizontal },
];

export function FintechBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="mx-auto flex h-18 w-full max-w-md items-center justify-between rounded-[28px] border border-white/70 bg-white/95 px-3 shadow-[0_20px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-w-0 flex-1 items-center justify-center rounded-2xl py-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-[#1FA971] to-[#22C55E] text-white shadow-[0_8px_20px_rgba(34,197,94,0.35)]'
                  : 'text-slate-500'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon size={18} />
                <span className="text-[11px] font-semibold leading-none">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
