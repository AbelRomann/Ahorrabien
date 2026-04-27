import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor?: string;
  iconBgColor?: string;
  progress?: number;
  progressLabel?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = '#10B981',
  iconBgColor = '#10B98120',
  progress,
  progressLabel,
}: StatCardProps) {
  const hasProgress = typeof progress === 'number';
  const clampedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>

      {hasProgress && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: iconColor, width: `${clampedProgress}%` }}
            />
          </div>
          {progressLabel && (
            <p className="text-[10px] text-muted-foreground mt-1">{progressLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
