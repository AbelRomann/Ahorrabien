import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

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
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-surface-elevated/90 rounded-2xl p-4 ring-1 ring-white/8 shadow-[0_12px_34px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor, boxShadow: `0 0 24px ${iconBgColor}` }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
      </div>
      <p className="text-2xl font-extrabold tracking-normal">{value}</p>

      {hasProgress && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ background: `linear-gradient(90deg, ${iconColor}, #00F0B5)`, width: `${clampedProgress}%` }}
            />
          </div>
          {progressLabel && (
            <p className="text-[10px] text-muted-foreground mt-1">{progressLabel}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
