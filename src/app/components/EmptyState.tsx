import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 bg-gradient-to-br from-primary/18 to-secondary/18 rounded-[2rem] flex items-center justify-center mb-4 ring-1 ring-white/10"
      >
        <Icon size={40} className="text-muted-foreground" />
      </motion.div>
      <h3 className="font-bold mb-2 text-center bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-primary/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
