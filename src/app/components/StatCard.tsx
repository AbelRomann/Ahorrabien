import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  iconColor = '#10B981',
  iconBgColor = '#10B98120'
}: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
