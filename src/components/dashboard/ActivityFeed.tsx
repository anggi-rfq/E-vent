import React from 'react';
import { ActivityLog, User } from '../../types';
import { getTimeAgo } from '../../utils/dateUtils';
import { Activity, CheckCircle2, FileText, FolderPlus, UserPlus } from 'lucide-react';

interface ActivityFeedProps {
  logs: ActivityLog[];
  users: User[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs, users }) => {
  const getIcon = (type: ActivityLog['targetType']) => {
    switch (type) {
      case 'TASK':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#7CA1FF]" />;
      case 'FILE':
        return <FileText className="w-3.5 h-3.5 text-[#065F46]" />;
      case 'DIVISION':
        return <FolderPlus className="w-3.5 h-3.5 text-[#6D28D9]" />;
      case 'MEMBER':
        return <UserPlus className="w-3.5 h-3.5 text-[#9A3412]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-[#4A5568]" />;
    }
  };

  return (
    <div className="clay-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-inner">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#2D3748] font-display">
            Aktivitas Terkini
          </h3>
          <p className="text-xs text-[#4A5568] font-medium">
            Log pembaruan tugas dan koordinasi
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {logs.slice(0, 8).map((log) => {
          const user = users.find((u) => u.id === log.userId);

          return (
            <div
              key={log.id}
              className="clay-card-flat p-3 flex items-start gap-3 hover:bg-white transition-all text-xs"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-xl object-cover border border-white shadow-sm shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0">
                <p className="text-[#2D3748] leading-relaxed">
                  <span className="font-extrabold">{user?.name || 'Pengguna'}</span>{' '}
                  <span className="text-[#4A5568]">{log.action}</span>{' '}
                  <span className="font-bold text-[#1E40AF]">"{log.targetName}"</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#4A5568] font-medium">
                  {getIcon(log.targetType)}
                  <span>{getTimeAgo(log.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            Belum ada aktivitas tercatat.
          </div>
        )}
      </div>
    </div>
  );
};
