import React from 'react';

interface ClayProgressBarProps {
  progress: number; // 0 - 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'blue' | 'green' | 'amber' | 'purple' | 'gradient';
  className?: string;
  id?: string;
}

export const ClayProgressBar: React.FC<ClayProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  variant = 'gradient',
  className = '',
  id,
}) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const getFillColor = () => {
    if (variant === 'green' || safeProgress === 100) return 'bg-emerald-500';
    if (variant === 'amber') return 'bg-amber-500';
    if (variant === 'purple') return 'bg-purple-600';
    if (variant === 'blue') return 'bg-indigo-600';
    
    // Adaptive color based on percentage
    if (safeProgress >= 80) return 'bg-emerald-500';
    if (safeProgress >= 40) return 'bg-indigo-600';
    return 'bg-amber-500';
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-medium text-slate-600">Progres Penyelesaian</span>
          <span className="font-semibold text-slate-900">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full ${getFillColor()} transition-all duration-300 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
