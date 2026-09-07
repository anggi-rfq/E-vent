import React from 'react';

interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'slate' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  id,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-0.5 font-medium rounded-md',
    lg: 'text-sm px-3 py-1 font-semibold rounded-lg',
  };

  const variantClasses = {
    default: 'clay-pill-blue',
    blue: 'clay-pill-blue',
    green: 'clay-pill-green',
    amber: 'clay-pill-amber',
    rose: 'clay-pill-rose',
    purple: 'clay-pill-purple',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      id={id}
      className={`clay-pill ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; id?: string }> = ({
  priority,
  id,
}) => {
  switch (priority) {
    case 'URGENT':
      return (
        <ClayBadge id={id} variant="rose" size="sm" className="font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 inline-block" />
          Urgent
        </ClayBadge>
      );
    case 'HIGH':
      return (
        <ClayBadge id={id} variant="amber" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block" />
          Tinggi
        </ClayBadge>
      );
    case 'MEDIUM':
      return (
        <ClayBadge id={id} variant="blue" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 inline-block" />
          Sedang
        </ClayBadge>
      );
    case 'LOW':
    default:
      return (
        <ClayBadge id={id} variant="green" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
          Rendah
        </ClayBadge>
      );
  }
};

export const StatusBadge: React.FC<{ status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED'; id?: string }> = ({
  status,
  id,
}) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <ClayBadge id={id} variant="green" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
          Selesai
        </ClayBadge>
      );
    case 'IN_REVIEW':
      return (
        <ClayBadge id={id} variant="purple" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5 inline-block" />
          In Review
        </ClayBadge>
      );
    case 'IN_PROGRESS':
      return (
        <ClayBadge id={id} variant="blue" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 inline-block" />
          Progres
        </ClayBadge>
      );
    case 'TODO':
    default:
      return (
        <ClayBadge id={id} variant="amber" size="sm" className="font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block" />
          To Do
        </ClayBadge>
      );
  }
};

export const RoleBadge: React.FC<{ role: 'ADMIN' | 'EVENT_MANAGER' | 'COORDINATOR' | 'MEMBER'; id?: string }> = ({
  role,
  id,
}) => {
  switch (role) {
    case 'ADMIN':
      return (
        <ClayBadge id={id} variant="purple" size="sm" className="font-semibold">
          Admin
        </ClayBadge>
      );
    case 'EVENT_MANAGER':
      return (
        <ClayBadge id={id} variant="rose" size="sm" className="font-semibold">
          Ketua Panitia
        </ClayBadge>
      );
    case 'COORDINATOR':
      return (
        <ClayBadge id={id} variant="blue" size="sm" className="font-medium">
          Koordinator
        </ClayBadge>
      );
    case 'MEMBER':
    default:
      return (
        <ClayBadge id={id} variant="slate" size="sm" className="font-medium">
          Anggota
        </ClayBadge>
      );
  }
};
