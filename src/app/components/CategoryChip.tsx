import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryChipProps {
  name: string;
  icon: LucideIcon;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ name, icon: Icon, color, selected = false, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
        selected 
          ? 'bg-primary/20 border-2 border-primary' 
          : 'bg-card border border-border hover:border-primary/50'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-xs text-foreground">{name}</span>
    </button>
  );
}
