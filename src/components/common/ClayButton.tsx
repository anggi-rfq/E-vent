import React from 'react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  id,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 rounded-lg',
    md: 'px-4 py-2 text-sm font-medium gap-2 rounded-xl',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
  };

  const variantClasses = {
    primary: 'clay-btn-primary',
    secondary: 'clay-btn-secondary',
    danger: 'clay-btn-danger',
    success: 'clay-btn-success',
    warning: 'clay-btn-warning',
    purple: 'clay-btn-purple',
  };

  return (
    <button
      id={id}
      className={`clay-btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
