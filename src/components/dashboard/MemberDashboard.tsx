import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { PriorityBadge, StatusBadge } from '../common/ClayBadge';
import { getDeadlineCondition } from '../../utils/dateUtils';
import { Task } from '../../types';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  FileCheck,
  UserCheck
} from 'lucide-react';

interface MemberDashboardProps {
  onSelectTask: (task: Task) => void;
  onNavigateToTasks: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  onSelectTask,
  onNavigateToTasks,
}) => {
  const { currentUser, activeEvent, divisions, tasks } = useApp();

  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.id);
  const eventMyTasks = myTasks.filter((t) => t.eventId === activeEvent?.id);

  const completedTasks = eventMyTasks.filter((t) => t.status === 'COMPLETED');
  const inProgressTasks = eventMyTasks.filter((t) => t.status === 'IN_PROGRESS');
  const inReviewTasks = eventMyTasks.filter((t) => t.status === 'IN_REVIEW');

  const overdueTasks = eventMyTasks.filter((t) => {
    if (t.status === 'COMPLETED') return false;
    const cond = getDeadlineCondition(t.deadline, false);
    return cond.condition === 'OVERDUE';
  });

  const personalProgress = eventMyTasks.length > 0
    ? Math.round(eventMyTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / eventMyTasks.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="clay-card p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A2E0C1] text-[#065F46] flex items-center justify-center shadow-md">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] block mb-1">
              Dashboard Anggota
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              Halo, {currentUser.name}
            </h2>
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-[#4A5568] font-bold uppercase tracking-wider block">Capaian Tugas</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#065F46] font-display">{personalProgress}%</p>
        </div>
      </div>

      {/* Metric Cards Grid for Member */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Assigned */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Tugas Saya</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{eventMyTasks.length}</h3>
            <p className="text-xs font-semibold text-[#4A5568] mt-1">
              Tanggung jawab Anda
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Pengerjaan</span>
            <div className="w-9 h-9 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center shadow-inner">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00838F] font-display">{inProgressTasks.length}</h3>
            <p className="text-xs font-semibold text-[#00838F] mt-1">
              {inReviewTasks.length} dalam review
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Tugas Selesai</span>
            <div className="w-9 h-9 rounded-2xl bg-[#D5F5E3] text-[#065F46] flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#065F46] font-display">{completedTasks.length}</h3>
            <p className="text-xs font-semibold text-[#065F46] mt-1">
              Telah diselesaikan
            </p>
          </div>
        </div>

        {/* Overdue Alert */}
        <div className={`clay-card p-5 flex flex-col justify-between ${
          overdueTasks.length > 0 ? 'bg-[#FFE2E7]/40 border border-rose-200' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Overdue</span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-inner ${
              overdueTasks.length > 0 ? 'bg-[#FFB6C1] text-[#881337]' : 'bg-[#E9F0FD] text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl sm:text-3xl font-extrabold font-display ${overdueTasks.length > 0 ? 'text-rose-600' : 'text-[#2D3748]'}`}>
              {overdueTasks.length}
            </h3>
            <p className="text-xs font-semibold text-rose-500 mt-1">
              {overdueTasks.length > 0 ? 'Segera tindak lanjuti' : 'Tepat waktu'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar of Member */}
      <div className="clay-card p-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-extrabold text-[#2D3748] text-sm sm:text-base font-display">
            Progres Tugas Saya
          </h3>
          <span className="text-xl font-extrabold text-[#065F46] font-display">{personalProgress}%</span>
        </div>
        <ClayProgressBar progress={personalProgress} size="md" variant="green" />
      </div>

      {/* Tasks List */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#2D3748] font-display">
              Daftar Tugas Saya
            </h3>
          </div>

          <button
            onClick={onNavigateToTasks}
            className="text-xs font-bold text-[#1E40AF] hover:text-[#7CA1FF] flex items-center gap-1"
          >
            <span>Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {eventMyTasks.map((task) => {
            const division = divisions.find((d) => d.id === task.divisionId);
            const deadlineInfo = getDeadlineCondition(task.deadline, task.status === 'COMPLETED');

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="clay-card-flat p-3.5 hover:bg-white transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-[#7CA1FF]">{division?.name}</span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${deadlineInfo.badgeClass}`}>
                      {deadlineInfo.label}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#2D3748] text-sm group-hover:text-[#7CA1FF] transition-colors">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-[#4A5568] mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 sm:w-40">
                  <div className="w-full">
                    <div className="flex justify-between text-xs font-bold text-[#4A5568] mb-1">
                      <span>Progres</span>
                      <span className="text-[#1E40AF] font-extrabold">{task.progress}%</span>
                    </div>
                    <ClayProgressBar progress={task.progress} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}

          {eventMyTasks.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada tugas yang ditugaskan kepada Anda saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
