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
    sm: 'h-2.5 rounded-full',
    md: 'h-4 rounded-full',
    lg: 'h-6 rounded-full',
  };

  const getGradient = () => {
    if (variant === 'green' || safeProgress === 100) {
      return 'from-[#A2E0C1] to-[#6BC9A1] shadow-[0_2px_8px_rgba(107,201,161,0.5)]';
    }
    if (variant === 'amber') {
      return 'from-[#FED7AA] to-[#FDBA74] shadow-[0_2px_8px_rgba(253,186,116,0.5)]';
    }
    if (variant === 'purple') {
      return 'from-[#DDD6FE] to-[#C4B5FD] shadow-[0_2px_8px_rgba(196,181,253,0.5)]';
    }
    if (variant === 'blue') {
      return 'from-[#99B7FF] to-[#7CA1FF] shadow-[0_2px_8px_rgba(124,161,255,0.5)]';
    }
    // Gradient based on %
    if (safeProgress >= 80) return 'from-[#A2E0C1] to-[#6BC9A1] shadow-[0_2px_8px_rgba(107,201,161,0.5)]';
    if (safeProgress >= 40) return 'from-[#99B7FF] to-[#7CA1FF] shadow-[0_2px_8px_rgba(124,161,255,0.5)]';
    return 'from-[#FED7AA] to-[#FFB6C1] shadow-[0_2px_8px_rgba(255,182,193,0.5)]';
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-slate-700">
          <span>Progres Penyelesaian</span>
          <span className="text-indigo-600 font-extrabold">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full clay-sunken overflow-hidden p-0.5 ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-500 ease-out relative`}
          style={{ width: `${safeProgress}%` }}
        >
          {/* 3D clay inner shine on progress bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
