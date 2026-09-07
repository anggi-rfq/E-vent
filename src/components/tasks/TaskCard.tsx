import React from 'react';
import { Task, User, Division } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/ClayBadge';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { getDeadlineCondition, formatIndonesianDate } from '../../utils/dateUtils';
import { Calendar, Clock, Paperclip, MessageSquare, ArrowRight, User as UserIcon } from 'lucide-react';

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
      className={`clay-card p-4 cursor-pointer clay-card-hover group flex flex-col justify-between select-none relative ${
        isCompleted
          ? 'bg-emerald-50/40 border-emerald-200'
          : deadlineInfo.condition === 'OVERDUE'
          ? 'bg-rose-50/40 border-rose-200'
          : 'bg-white'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: division?.color || '#6366f1' }}
            />
            <span className="text-[11px] font-extrabold text-indigo-700 truncate">
              {division?.name || 'Divisi'}
            </span>
          </div>

          <PriorityBadge priority={task.priority} />
        </div>

        {/* Title */}
        <h4 className={`text-sm font-extrabold font-display leading-snug group-hover:text-indigo-600 transition-colors ${
          isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
        }`}>
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-3.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>Progres</span>
            <span className={isCompleted ? 'text-emerald-600 font-extrabold' : 'text-indigo-600 font-extrabold'}>
              {task.progress}%
            </span>
          </div>
          <ClayProgressBar progress={task.progress} size="sm" />
        </div>
      </div>

      {/* Footer Info: Deadline, Assignee, Attachments */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* PIC Avatar */}
        <div className="flex items-center gap-2 min-w-0">
          {assignedUser ? (
            <img
              src={assignedUser.avatar}
              alt={assignedUser.name}
              className="w-6 h-6 rounded-lg object-cover border border-white shadow-sm shrink-0"
              title={`PIC: ${assignedUser.name}`}
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-slate-600 font-semibold truncate max-w-[90px] text-[11px]">
            {assignedUser?.name || 'Belum ada PIC'}
          </span>
        </div>

        {/* Deadline Badge & counts */}
        <div className="flex items-center gap-2 shrink-0">
          {attachmentCount > 0 && (
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5" title={`${attachmentCount} berkas terlampir`}>
              <Paperclip className="w-3 h-3" />
              {attachmentCount}
            </span>
          )}

          {updateCount > 0 && (
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5" title={`${updateCount} catatan progres`}>
              <MessageSquare className="w-3 h-3" />
              {updateCount}
            </span>
          )}

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${deadlineInfo.badgeClass}`}
            title={`Deadline: ${formatIndonesianDate(task.deadline)}`}
          >
            <Clock className="w-3 h-3" />
            {deadlineInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};
