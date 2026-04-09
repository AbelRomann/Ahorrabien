import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, History, BarChart3, User } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'Inicio', icon: Home },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/reports', label: 'Reportes', icon: BarChart3 },
  { path: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}