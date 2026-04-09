import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

export function QuickAction({ icon: Icon, label, onClick, color = '#10B981' }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-xs text-foreground text-center">{label}</span>
    </button>
  );
}
