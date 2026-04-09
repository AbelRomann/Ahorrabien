import React from 'react';
import { LucideIcon } from 'lucide-react';

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
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon size={40} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-2 text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-primary hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
