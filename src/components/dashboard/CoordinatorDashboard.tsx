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
      <div className="clay-card p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7CA1FF] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7CA1FF]">
                Koordinator Divisi
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#DCE8FE] text-[#1E40AF]">
                {userDivision?.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              Halo, {currentUser.name}
            </h2>
          </div>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="clay-btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Task Divisi</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Division Members */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Anggota Divisi</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{divisionMembers.length}</h3>
            <p className="text-xs font-semibold text-[#4A5568] mt-1">
              Personil di {userDivision?.name}
            </p>
          </div>
        </div>

        {/* Total Tasks in Division */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total Tugas</span>
            <div className="w-9 h-9 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center shadow-inner">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{divisionTasks.length}</h3>
            <p className="text-xs font-semibold text-[#1E40AF] mt-1">
              {completedTasks.length} selesai • {inProgressTasks.length} proses
            </p>
          </div>
        </div>

        {/* In-Review Tasks */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Perlu Review</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-inner">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#6D28D9] font-display">{inReviewTasks.length}</h3>
            <p className="text-xs font-semibold text-[#6D28D9] mt-1">
              {inReviewTasks.length > 0 ? 'Menunggu persetujuan' : 'Tidak ada antrean'}
            </p>
          </div>
        </div>

        {/* Overdue */}
        <div className={`clay-card p-5 flex flex-col justify-between ${
          overdueTasks.length > 0 ? 'bg-[#FFE2E7]/40 border border-rose-200' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Tugas Overdue</span>
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
              {overdueTasks.length > 0 ? 'Lewat batas waktu' : 'Tepat waktu'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar of Division */}
      <div className="clay-card p-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-extrabold text-[#2D3748] text-sm sm:text-base font-display">
            Capaian Progres Divisi
          </h3>
          <span className="text-xl font-extrabold text-[#1E40AF] font-display">{divisionProgress}%</span>
        </div>
        <ClayProgressBar progress={divisionProgress} size="md" />
      </div>

      {/* Review Queue and Division Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks In Review Queue */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-inner">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#2D3748] text-base font-display">Antrean Review</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#DDD6FE] text-[#6D28D9]">
                {inReviewTasks.length} Tugas
              </span>
            </div>

            <div className="space-y-2.5">
              {inReviewTasks.map((task) => {
                const assignedUser = users.find((u) => u.id === task.assignedTo);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="clay-card-flat p-3.5 hover:bg-white transition-all cursor-pointer group border-l-4 border-l-[#C4B5FD]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs font-bold text-[#6D28D9]">Progres: {task.progress}%</span>
                    </div>

                    <h4 className="font-bold text-[#2D3748] text-xs sm:text-sm group-hover:text-[#6D28D9] transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={assignedUser?.avatar}
                          alt={assignedUser?.name}
                          className="w-5 h-5 rounded-md object-cover"
                        />
                        <span className="text-[#4A5568] font-semibold">{assignedUser?.name}</span>
                      </div>

                      <span className="text-[#6D28D9] font-bold text-[11px] hover:underline flex items-center gap-1">
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
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[#2D3748] text-base font-display">Anggota Divisi</h3>
            </div>

            <div className="space-y-2.5">
              {divisionMembers.map((member) => {
                const user = users.find((u) => u.id === member.userId);
                const userTasks = divisionTasks.filter((t) => t.assignedTo === user?.id);
                const userDone = userTasks.filter((t) => t.status === 'COMPLETED').length;

                return (
                  <div
                    key={member.id}
                    className="clay-card-flat p-3 flex items-center justify-between hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-9 h-9 rounded-xl object-cover border border-white shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-[#2D3748] text-xs sm:text-sm">{user?.name}</h4>
                        <p className="text-[11px] font-semibold text-[#1E40AF]">{member.position}</p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-bold text-[#2D3748]">
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

          <div className="mt-4 pt-3 border-t border-[#D1D9E6]/60">
            <button
              onClick={onNavigateToTasks}
              className="w-full py-2 text-xs font-bold text-[#1E40AF] hover:text-[#7CA1FF] flex items-center justify-center gap-1 transition-colors"
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
