import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, History, BarChart3, User } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion } from 'motion/react';

const navItems = [
  { path: '/home', label: 'Inicio', icon: Home },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/reports', label: 'Reportes', icon: BarChart3 },
  { path: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto border-t border-white/10 bg-background/78 backdrop-blur-2xl shadow-[0_-18px_45px_rgba(0,0,0,0.32)]">
        <div className="flex justify-around items-center h-20 px-4 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className="relative flex h-8 w-12 items-center justify-center">
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-primary/12 ring-1 ring-primary/20"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={23} className="relative z-10" fill={isActive ? 'currentColor' : 'none'} />
              </span>
              <span className="text-[11px] font-semibold">{item.label}</span>
              <span className={`h-1 w-1 rounded-full transition-all ${isActive ? 'bg-glow-primary shadow-[0_0_12px_#00F0B5]' : 'bg-transparent'}`} />
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
