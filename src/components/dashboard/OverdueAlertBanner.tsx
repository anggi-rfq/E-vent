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
    <div className="w-full bg-rose-50/50 border border-rose-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <h4 className="font-display font-semibold text-rose-950 text-sm">
            {overdueTasks.length} Tugas Melewati Batas Waktu
          </h4>
        </div>
        <span className="text-[11px] font-medium text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md">
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
              className="bg-white border border-rose-200/60 rounded-lg p-3 cursor-pointer hover:border-rose-300 hover:shadow-xs transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-indigo-600 truncate">
                    {division?.name || 'Divisi'}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>

                <h5 className="font-medium text-slate-900 text-xs line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {task.title}
                </h5>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={assignedUser?.avatar}
                    alt={assignedUser?.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                    title={assignedUser?.name}
                  />
                  <span className="text-slate-500 font-normal truncate text-[11px] max-w-[100px]">
                    {assignedUser?.name || 'Belum ada PIC'}
                  </span>
                </div>

                <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
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
