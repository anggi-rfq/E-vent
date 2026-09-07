import React from 'react';
import { Task, User, Division } from '../../types';
import { getDeadlineCondition } from '../../utils/dateUtils';
import { AlertCircle, Clock } from 'lucide-react';
import { PriorityBadge } from '../common/ClayBadge';

interface OverdueAlertBannerProps {
  overdueTasks: Task[];
  users: User[];
  divisions: Division[];
  onSelectTask: (task: Task) => void;
}

export const OverdueAlertBanner: React.FC<OverdueAlertBannerProps> = ({
  overdueTasks,
  users,
  divisions,
  onSelectTask,
}) => {
  if (overdueTasks.length === 0) return null;

  return (
    <div className="w-full clay-card p-4 sm:p-5 bg-[#FFE2E7]/40 border border-rose-200/80">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#FFB6C1] text-[#881337] flex items-center justify-center shrink-0 shadow-sm">
            <AlertCircle className="w-4 h-4" />
          </div>
          <h4 className="font-display font-extrabold text-[#2D3748] text-sm sm:text-base">
            {overdueTasks.length} Tugas Melewati Batas Waktu
          </h4>
        </div>
        <span className="text-[11px] font-bold text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
          Perlu Tindakan
        </span>
      </div>

      {/* List of overdue cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {overdueTasks.slice(0, 3).map((task) => {
          const assignedUser = users.find(u => u.id === task.assignedTo);
          const division = divisions.find(d => d.id === task.divisionId);
          const deadlineInfo = getDeadlineCondition(task.deadline, task.status === 'COMPLETED');

          return (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="clay-card-flat p-3 bg-white/95 cursor-pointer hover:bg-white transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold text-[#7CA1FF] truncate">
                    {division?.name || 'Divisi'}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>

                <h5 className="font-bold text-[#2D3748] text-xs sm:text-sm line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {task.title}
                </h5>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={assignedUser?.avatar}
                    alt={assignedUser?.name}
                    className="w-5 h-5 rounded-md object-cover border border-white shrink-0"
                    title={assignedUser?.name}
                  />
                  <span className="text-[#4A5568] font-semibold truncate text-[11px] max-w-[100px]">
                    {assignedUser?.name || 'Belum ada PIC'}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {deadlineInfo.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
