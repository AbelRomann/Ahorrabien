import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryChipProps {
  name: string;
  icon: LucideIcon;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ name, icon: Icon, color, selected = false, onClick }: CategoryChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{ scale: selected ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
        selected 
          ? 'bg-primary/15 ring-2 ring-primary shadow-[0_0_26px_rgba(0,240,181,0.18)]' 
          : 'bg-surface-elevated/80 ring-1 ring-white/8 hover:ring-primary/40'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-xs text-foreground">{name}</span>
    </motion.button>
  );
}
