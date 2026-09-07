import React from 'react';
import { Task, User, Division } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/ClayBadge';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { getDeadlineCondition, formatIndonesianDate } from '../../utils/dateUtils';
import { Clock, Paperclip, MessageSquare, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignedUser?: User;
  division?: Division;
  attachmentCount?: number;
  updateCount?: number;
  onClick: () => void;
  onStatusChange?: (newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  assignedUser,
  division,
  attachmentCount = 0,
  updateCount = 0,
  onClick,
}) => {
  const isCompleted = task.status === 'COMPLETED';
  const deadlineInfo = getDeadlineCondition(task.deadline, isCompleted);

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl p-3.5 cursor-pointer shadow-xs transition-colors hover:border-slate-300 hover:shadow-sm group flex flex-col justify-between select-none relative ${
        isCompleted
          ? 'bg-slate-50/60 border-slate-200/70'
          : deadlineInfo.condition === 'OVERDUE'
          ? 'border-rose-200 bg-rose-50/15'
          : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: division?.color || '#4F46E5' }}
            />
            <span className="text-[11px] font-medium text-slate-600 truncate">
              {division?.name || 'Divisi'}
            </span>
          </div>

          <PriorityBadge priority={task.priority} />
        </div>

        {/* Title */}
        <h4 className={`text-xs sm:text-sm font-medium leading-snug group-hover:text-indigo-600 transition-colors ${
          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
        }`}>
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Progres</span>
            <span className={isCompleted ? 'text-emerald-600 font-semibold' : 'text-indigo-600 font-semibold'}>
              {task.progress}%
            </span>
          </div>
          <ClayProgressBar progress={task.progress} size="sm" />
        </div>
      </div>

      {/* Footer Info: Deadline, Assignee, Attachments */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* PIC Avatar */}
        <div className="flex items-center gap-1.5 min-w-0">
          {assignedUser ? (
            <img
              src={assignedUser.avatar}
              alt={assignedUser.name}
              className="w-5 h-5 rounded-md object-cover border border-slate-200 shrink-0"
              title={`PIC: ${assignedUser.name}`}
            />
          ) : (
            <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">
              <UserIcon className="w-3 h-3" />
            </div>
          )}
          <span className="text-slate-600 font-normal truncate max-w-[80px] text-[11px]">
            {assignedUser?.name || 'Belum ada PIC'}
          </span>
        </div>

        {/* Deadline Badge & counts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {attachmentCount > 0 && (
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title={`${attachmentCount} berkas terlampir`}>
              <Paperclip className="w-3 h-3" />
              {attachmentCount}
            </span>
          )}

          {updateCount > 0 && (
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title={`${updateCount} catatan progres`}>
              <MessageSquare className="w-3 h-3" />
              {updateCount}
            </span>
          )}

          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${deadlineInfo.badgeClass}`}
            title={`Deadline: ${formatIndonesianDate(task.deadline)}`}
          >
            <Clock className="w-2.5 h-2.5" />
            {deadlineInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};
