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
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Dashboard Anggota
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-display">
              Halo, {currentUser.name}
            </h2>
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Capaian Tugas</span>
          <p className="text-2xl font-semibold text-emerald-600 font-display">{personalProgress}%</p>
        </div>
      </div>

      {/* Metric Cards Grid for Member */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tugas Saya</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{eventMyTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tanggung jawab Anda
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pengerjaan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{inProgressTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {inReviewTasks.length} dalam review
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tugas Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-display">{completedTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Telah diselesaikan
            </p>
          </div>
        </div>

        {/* Overdue Alert */}
        <div className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
          overdueTasks.length > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overdue</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              overdueTasks.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl sm:text-3xl font-semibold font-display ${overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueTasks.length}
            </h3>
            <p className={`text-xs mt-1 font-medium ${overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
              {overdueTasks.length > 0 ? 'Segera tindak lanjuti' : 'Tepat waktu'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar of Member */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm font-display">
            Progres Tugas Saya
          </h3>
          <span className="text-lg font-semibold text-emerald-600 font-display">{personalProgress}%</span>
        </div>
        <ClayProgressBar progress={personalProgress} size="md" variant="green" />
      </div>

      {/* Tasks List */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 font-display">
              Daftar Tugas Saya
            </h3>
          </div>

          <button
            onClick={onNavigateToTasks}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {eventMyTasks.map((task) => {
            const division = divisions.find((d) => d.id === task.divisionId);
            const deadlineInfo = getDeadlineCondition(task.deadline, task.status === 'COMPLETED');

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-3.5 rounded-lg border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-medium text-indigo-600">{division?.name}</span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${deadlineInfo.badgeClass}`}>
                      {deadlineInfo.label}
                    </span>
                  </div>

                  <h4 className="font-medium text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 sm:w-36">
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progres</span>
                      <span className="text-indigo-600 font-semibold">{task.progress}%</span>
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
