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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Divisions */}
        <div 
          onClick={onNavigateToDivisions}
          className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 cursor-pointer hover:border-slate-300 shadow-xs transition-colors group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Divisi</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{eventDivisions.length}</h3>
            <p className="text-xs font-medium text-indigo-600 mt-1 flex items-center gap-1">
              <span>{eventMembers.length} panitia</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Total Tasks */}
        <div 
          onClick={onNavigateToTasks}
          className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 cursor-pointer hover:border-slate-300 shadow-xs transition-colors group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tugas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{eventTasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasks.length} selesai • {inProgressTasks.length} proses
            </p>
          </div>
        </div>

        {/* Overdue Count */}
        <div 
          onClick={onNavigateToTasks}
          className={`bg-white border rounded-xl p-4 sm:p-5 cursor-pointer shadow-xs transition-colors group flex flex-col justify-between ${
            overdueTasks.length > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
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
              {overdueTasks.length > 0 ? 'Perlu tindakan segera' : 'Tepat waktu'}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Capaian Event</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-display">{overallProgress}%</h3>
              <span className="text-xs text-slate-500 font-normal">keseluruhan</span>
            </div>
            <div className="mt-2.5">
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm font-display">Tenggat Mendatang</h3>
                <p className="text-xs text-slate-500">Tugas dengan deadline terdekat</p>
              </div>
            </div>

            <div className="space-y-2">
              {upcomingDeadlines.map((task) => {
                const assignedUser = users.find(u => u.id === task.assignedTo);
                const deadlineInfo = getDeadlineCondition(task.deadline, false);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${deadlineInfo.badgeClass}`}>
                        {deadlineInfo.label}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="font-medium text-slate-800 text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={assignedUser?.avatar}
                          alt={assignedUser?.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-slate-600 font-normal truncate max-w-[100px]">
                          {assignedUser?.name || 'Belum ada'}
                        </span>
                      </div>
                      <span className="text-indigo-600 font-semibold">{task.progress}%</span>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs font-normal">
                  Tidak ada tugas mendekati deadline.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToTasks}
              className="w-full py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors"
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600">Info Event</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 font-display mb-1">
              {activeEvent?.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
              {activeEvent?.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tanggal:</span>
                <span className="font-medium text-slate-800">
                  {formatIndonesianDate(activeEvent?.startDate || '')} - {formatIndonesianDate(activeEvent?.endDate || '')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Lokasi:</span>
                <span className="font-medium text-slate-800 truncate max-w-[150px]">{activeEvent?.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md text-[10px]">
                  {activeEvent?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <button
              onClick={onOpenCreateTask}
              className="w-full py-2 px-3 rounded-lg clay-btn-primary text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
