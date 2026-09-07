import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { OverdueAlertBanner } from './OverdueAlertBanner';
import { DivisionProgressComparison } from './DivisionProgressComparison';
import { ActivityFeed } from './ActivityFeed';
import { PriorityBadge } from '../common/ClayBadge';
import { getDeadlineCondition, formatIndonesianDate } from '../../utils/dateUtils';
import { Task } from '../../types';
import { 
  Layers, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight,
  Plus
} from 'lucide-react';

interface EventManagerDashboardProps {
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onNavigateToTasks: () => void;
  onNavigateToDivisions: () => void;
}

export const EventManagerDashboard: React.FC<EventManagerDashboardProps> = ({
  onSelectTask,
  onOpenCreateTask,
  onNavigateToTasks,
  onNavigateToDivisions,
}) => {
  const { activeEvent, divisions, members, tasks, users, activityLogs } = useApp();

  const eventTasks = tasks.filter(t => t.eventId === activeEvent?.id);
  const eventDivisions = divisions.filter(d => d.eventId === activeEvent?.id);
  const eventMembers = members.filter(m => m.eventId === activeEvent?.id);

  const completedTasks = eventTasks.filter(t => t.status === 'COMPLETED');
  const inProgressTasks = eventTasks.filter(t => t.status === 'IN_PROGRESS');

  const overdueTasks = eventTasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const cond = getDeadlineCondition(t.deadline, false);
    return cond.condition === 'OVERDUE';
  });

  const upcomingDeadlines = eventTasks
    .filter(t => t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const overallProgress = eventTasks.length > 0
    ? Math.round(eventTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / eventTasks.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overdue Alert Banner */}
      <OverdueAlertBanner
        overdueTasks={overdueTasks}
        users={users}
        divisions={divisions}
        onSelectTask={onSelectTask}
      />

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Divisions */}
        <div 
          onClick={onNavigateToDivisions}
          className="clay-card p-5 cursor-pointer clay-card-hover group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total Divisi</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{eventDivisions.length}</h3>
            <p className="text-xs font-semibold text-[#7CA1FF] mt-1 flex items-center gap-1">
              <span>{eventMembers.length} panitia</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Total Tasks */}
        <div 
          onClick={onNavigateToTasks}
          className="clay-card p-5 cursor-pointer clay-card-hover group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total Tugas</span>
            <div className="w-9 h-9 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{eventTasks.length}</h3>
            <p className="text-xs font-semibold text-[#4A5568] mt-1">
              {completedTasks.length} selesai • {inProgressTasks.length} proses
            </p>
          </div>
        </div>

        {/* Overdue Count */}
        <div 
          onClick={onNavigateToTasks}
          className={`clay-card p-5 cursor-pointer clay-card-hover group flex flex-col justify-between ${
            overdueTasks.length > 0 ? 'bg-[#FFE2E7]/40 border border-rose-200' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Tugas Overdue</span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${
              overdueTasks.length > 0 ? 'bg-[#FFB6C1] text-[#881337] shadow-sm' : 'bg-[#E9F0FD] text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl sm:text-3xl font-extrabold font-display ${overdueTasks.length > 0 ? 'text-rose-600' : 'text-[#2D3748]'}`}>
              {overdueTasks.length}
            </h3>
            <p className="text-xs font-semibold text-rose-500 mt-1">
              {overdueTasks.length > 0 ? 'Perlu tindakan' : 'Tepat waktu'}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Capaian Event</span>
            <div className="w-9 h-9 rounded-2xl bg-[#D5F5E3] text-[#065F46] flex items-center justify-center shadow-inner">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#065F46] font-display">{overallProgress}%</h3>
              <span className="text-xs font-bold text-[#4A5568]">keseluruhan</span>
            </div>
            <div className="mt-2">
              <ClayProgressBar progress={overallProgress} size="sm" variant="green" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Division Breakdown & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Division Progress Comparison (2 columns) */}
        <div className="lg:col-span-2">
          <DivisionProgressComparison
            divisions={eventDivisions}
            tasks={eventTasks}
            onSelectDivision={() => onNavigateToTasks()}
          />
        </div>

        {/* Upcoming Deadlines Widget (1 column) */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FED7AA] text-[#9A3412] flex items-center justify-center shadow-inner">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#2D3748] text-base font-display">Tenggat Mendatang</h3>
                <p className="text-[11px] text-[#4A5568] font-medium">Tugas dengan deadline terdekat</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.map((task) => {
                const assignedUser = users.find(u => u.id === task.assignedTo);
                const deadlineInfo = getDeadlineCondition(task.deadline, false);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="clay-card-flat p-3 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${deadlineInfo.badgeClass}`}>
                        {deadlineInfo.label}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="font-bold text-[#2D3748] text-xs line-clamp-1 group-hover:text-[#7CA1FF] transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={assignedUser?.avatar}
                          alt={assignedUser?.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-[#4A5568] font-semibold truncate max-w-[90px]">
                          {assignedUser?.name || 'Belum ada'}
                        </span>
                      </div>
                      <span className="text-[#1E40AF] font-extrabold">{task.progress}%</span>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tidak ada tugas mendekati deadline.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D1D9E6]/60">
            <button
              onClick={onNavigateToTasks}
              className="w-full py-2 text-xs font-bold text-[#1E40AF] hover:text-[#7CA1FF] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Buka Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Activity Feed & Event Details Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed logs={activityLogs} users={users} />
        </div>

        {/* Quick Event Summary Card */}
        <div className="clay-card p-6 flex flex-col justify-between bg-gradient-to-br from-[#F0F4FF] to-[#E9F0FD]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7CA1FF]">Info Event</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#2D3748] font-display mb-1.5">
              {activeEvent?.name}
            </h3>
            <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-3 mb-4">
              {activeEvent?.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#D1D9E6]/60">
                <span className="text-[#4A5568] font-medium">Tanggal:</span>
                <span className="font-bold text-[#2D3748]">
                  {formatIndonesianDate(activeEvent?.startDate || '')} - {formatIndonesianDate(activeEvent?.endDate || '')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D1D9E6]/60">
                <span className="text-[#4A5568] font-medium">Lokasi:</span>
                <span className="font-bold text-[#2D3748] truncate max-w-[150px]">{activeEvent?.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D1D9E6]/60">
                <span className="text-[#4A5568] font-medium">Status:</span>
                <span className="font-bold text-[#1E40AF] bg-[#DCE8FE] px-2 py-0.5 rounded-full text-[10px]">
                  {activeEvent?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#D1D9E6]/70">
            <button
              onClick={onOpenCreateTask}
              className="w-full py-2.5 px-4 rounded-2xl clay-btn-primary text-xs font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
