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
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'FILE':
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case 'DIVISION':
        return <FolderPlus className="w-3.5 h-3.5 text-purple-600" />;
      case 'MEMBER':
        return <UserPlus className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 font-display">
            Aktivitas Terkini
          </h3>
          <p className="text-xs text-slate-500">
            Log pembaruan tugas dan koordinasi
          </p>
        </div>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {logs.slice(0, 8).map((log) => {
          const user = users.find((u) => u.id === log.userId);

          return (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/50 transition-colors flex items-start gap-3 text-xs"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0">
                <p className="text-slate-800 leading-relaxed">
                  <span className="font-semibold text-slate-900">{user?.name || 'Pengguna'}</span>{' '}
                  <span className="text-slate-500">{log.action}</span>{' '}
                  <span className="font-medium text-indigo-700">"{log.targetName}"</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
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
