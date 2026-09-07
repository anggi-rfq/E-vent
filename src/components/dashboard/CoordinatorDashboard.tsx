import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { PriorityBadge } from '../common/ClayBadge';
import { getDeadlineCondition } from '../../utils/dateUtils';
import { Task } from '../../types';
import { 
  Users, 
  CheckSquare, 
  AlertCircle, 
  Eye, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CoordinatorDashboardProps {
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onNavigateToTasks: () => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  onSelectTask,
  onOpenCreateTask,
  onNavigateToTasks,
}) => {
  const { currentUser, activeEvent, divisions, members, tasks, users } = useApp();

  const userDivision = divisions.find(
    (d) => d.coordinatorId === currentUser.id && d.eventId === activeEvent?.id
  ) || divisions[0];

  const divisionTasks = tasks.filter((t) => t.divisionId === userDivision?.id);
  const divisionMembers = members.filter((m) => m.divisionId === userDivision?.id && m.eventId === activeEvent?.id);

  const completedTasks = divisionTasks.filter((t) => t.status === 'COMPLETED');
  const inProgressTasks = divisionTasks.filter((t) => t.status === 'IN_PROGRESS');
  const inReviewTasks = divisionTasks.filter((t) => t.status === 'IN_REVIEW');

  const overdueTasks = divisionTasks.filter((t) => {
    if (t.status === 'COMPLETED') return false;
    const cond = getDeadlineCondition(t.deadline, false);
    return cond.condition === 'OVERDUE';
  });

  const divisionProgress = divisionTasks.length > 0
    ? Math.round(divisionTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / divisionTasks.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Coordinator Greeting Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Koordinator Divisi
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {userDivision?.name}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-display">
              Halo, {currentUser.name}
            </h2>
          </div>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="clay-btn-primary px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Task Divisi</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Division Members */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Anggota Divisi</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{divisionMembers.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Personil di {userDivision?.name}
            </p>
          </div>
        </div>

        {/* Total Tasks in Division */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tugas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{divisionTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasks.length} selesai • {inProgressTasks.length} proses
            </p>
          </div>
        </div>

        {/* In-Review Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">Perlu Review</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-purple-600 font-display">{inReviewTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {inReviewTasks.length > 0 ? 'Menunggu persetujuan' : 'Tidak ada antrean'}
            </p>
          </div>
        </div>

        {/* Overdue */}
        <div className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
          overdueTasks.length > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tugas Overdue</span>
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
              {overdueTasks.length > 0 ? 'Lewat batas waktu' : 'Tepat waktu'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar of Division */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm font-display">
            Capaian Progres Divisi
          </h3>
          <span className="text-lg font-semibold text-indigo-600 font-display">{divisionProgress}%</span>
        </div>
        <ClayProgressBar progress={divisionProgress} size="md" />
      </div>

      {/* Review Queue and Division Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks In Review Queue */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm font-display">Antrean Review</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-purple-50 text-purple-700 border border-purple-100">
                {inReviewTasks.length} Tugas
              </span>
            </div>

            <div className="space-y-2">
              {inReviewTasks.map((task) => {
                const assignedUser = users.find((u) => u.id === task.assignedTo);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 rounded-lg border border-slate-200/80 hover:border-purple-300 hover:bg-slate-50/50 transition-colors cursor-pointer group border-l-2 border-l-purple-500"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs font-medium text-purple-600">Progres: {task.progress}%</span>
                    </div>

                    <h4 className="font-medium text-slate-800 text-xs sm:text-sm group-hover:text-purple-600 transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={assignedUser?.avatar}
                          alt={assignedUser?.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-slate-600 font-normal">{assignedUser?.name}</span>
                      </div>

                      <span className="text-purple-600 font-medium text-[11px] hover:underline flex items-center gap-1">
                        Review <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {inReviewTasks.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Tidak ada tugas menunggu review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Directory in Division */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm font-display">Anggota Divisi</h3>
            </div>

            <div className="space-y-2">
              {divisionMembers.map((member) => {
                const user = users.find((u) => u.id === member.userId);
                const userTasks = divisionTasks.filter((t) => t.assignedTo === user?.id);
                const userDone = userTasks.filter((t) => t.status === 'COMPLETED').length;

                return (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-medium text-slate-800 text-xs sm:text-sm">{user?.name}</h4>
                        <p className="text-[11px] text-slate-500">{member.position}</p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-medium text-slate-700">
                        {userDone}/{userTasks.length} Selesai
                      </p>
                    </div>
                  </div>
                );
              })}

              {divisionMembers.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Belum ada anggota di divisi ini.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToTasks}
              className="w-full py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Lihat Task Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
