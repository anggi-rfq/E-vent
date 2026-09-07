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
    sm: 'text-[11px] px-2.5 py-0.5 tracking-tight',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5 font-bold',
  };

  const variantClasses = {
    default: 'clay-pill-blue',
    blue: 'clay-pill-blue',
    green: 'clay-pill-green',
    amber: 'clay-pill-amber',
    rose: 'clay-pill-rose',
    purple: 'clay-pill-purple',
    slate: 'bg-slate-200 text-slate-700 shadow-[3px_3px_6px_#cbd5e1,-2px_-2px_5px_#ffffff]',
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
        <ClayBadge id={id} variant="rose" size="sm" className="font-bold border border-rose-300">
          🔥 URGENT
        </ClayBadge>
      );
    case 'HIGH':
      return (
        <ClayBadge id={id} variant="amber" size="sm" className="font-semibold">
          ⚡ TINGGI
        </ClayBadge>
      );
    case 'MEDIUM':
      return (
        <ClayBadge id={id} variant="blue" size="sm">
          ⏳ SEDANG
        </ClayBadge>
      );
    case 'LOW':
    default:
      return (
        <ClayBadge id={id} variant="green" size="sm">
          🌱 RENDAH
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
        <ClayBadge id={id} variant="green" size="sm" className="font-bold">
          ✓ SELESAI
        </ClayBadge>
      );
    case 'IN_REVIEW':
      return (
        <ClayBadge id={id} variant="purple" size="sm" className="font-semibold">
          👁️ IN REVIEW
        </ClayBadge>
      );
    case 'IN_PROGRESS':
      return (
        <ClayBadge id={id} variant="blue" size="sm" className="font-semibold">
          🔄 PROGRES
        </ClayBadge>
      );
    case 'TODO':
    default:
      return (
        <ClayBadge id={id} variant="amber" size="sm">
          📋 TO DO
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
        <ClayBadge id={id} variant="purple" size="sm" className="font-extrabold uppercase">
          🛡️ Admin
        </ClayBadge>
      );
    case 'EVENT_MANAGER':
      return (
        <ClayBadge id={id} variant="rose" size="sm" className="font-bold uppercase">
          👑 Ketua Panitia
        </ClayBadge>
      );
    case 'COORDINATOR':
      return (
        <ClayBadge id={id} variant="blue" size="sm" className="font-semibold uppercase">
          ⭐ Koordinator
        </ClayBadge>
      );
    case 'MEMBER':
    default:
      return (
        <ClayBadge id={id} variant="green" size="sm">
          👤 Anggota
        </ClayBadge>
      );
  }
};
