import { DeadlineCondition } from '../types';

export function getDeadlineCondition(deadlineDateStr: string, isCompleted: boolean = false): {
  condition: DeadlineCondition;
  label: string;
  daysRemaining: number;
  badgeClass: string;
} {
  if (isCompleted) {
    return {
      condition: 'NORMAL',
      label: 'Selesai',
      daysRemaining: 999,
      badgeClass: 'clay-pill-green',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineDateStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      condition: 'OVERDUE',
      label: `Terlambat ${Math.abs(diffDays)} hari`,
      daysRemaining: diffDays,
      badgeClass: 'clay-pill-rose animate-pulse',
    };
  } else if (diffDays === 0) {
    return {
      condition: 'DUE_TODAY',
      label: 'Hari Ini!',
      daysRemaining: 0,
      badgeClass: 'clay-pill-rose',
    };
  } else if (diffDays <= 3) {
    return {
      condition: 'UPCOMING',
      label: `${diffDays} hari lagi`,
      daysRemaining: diffDays,
      badgeClass: 'clay-pill-amber',
    };
  } else {
    return {
      condition: 'NORMAL',
      label: `${diffDays} hari lagi`,
      daysRemaining: diffDays,
      badgeClass: 'clay-pill-blue',
    };
  }
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Baru saja';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  return `${Math.floor(diffSec / 86400)} hari lalu`;
}
