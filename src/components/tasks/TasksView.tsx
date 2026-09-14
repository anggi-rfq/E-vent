import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskKanbanBoard } from './TaskKanbanBoard';
import { TaskDetailModal } from './TaskDetailModal';
import { CreateTaskModal } from './CreateTaskModal';
import { ClayButton } from '../common/ClayButton';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { PriorityBadge, StatusBadge } from '../common/ClayBadge';
import { getDeadlineCondition } from '../../utils/dateUtils';
import { Task, TaskStatus } from '../../types';
import { 
  CheckSquare, 
  Plus, 
  LayoutGrid, 
  List, 
  Search, 
  Clock, 
  RotateCcw
} from 'lucide-react';

interface TasksViewProps {
  initialTaskId?: string | null;
}

export const TasksView: React.FC<TasksViewProps> = ({ initialTaskId }) => {
  const { 
    activeEvent, 
    tasks, 
    divisions, 
    users, 
    attachments, 
    taskUpdates, 
    currentUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisionId, setFilterDivisionId] = useState<string>('ALL');
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDeadline, setFilterDeadline] = useState<string>('ALL');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState<TaskStatus>('TODO');

  const canCreateTask = Boolean(currentUser?.role && currentUser.role !== 'MEMBER');

  // If initialTaskId provided, select it
  React.useEffect(() => {
    if (initialTaskId) {
      const found = tasks.find((t) => t.id === initialTaskId);
      if (found) {
        setSelectedTask(found);
        setIsDetailOpen(true);
      }
    }
  }, [initialTaskId, tasks]);

  const eventTasks = tasks.filter((t) => t.eventId === activeEvent?.id);
  const eventDivisions = divisions.filter((d) => d.eventId === activeEvent?.id);

  // Attachments and updates lookup
  const attachmentsCountByTask = useMemo(() => {
    const map: { [taskId: string]: number } = {};
    attachments.forEach((a) => {
      map[a.taskId] = (map[a.taskId] || 0) + 1;
    });
    return map;
  }, [attachments]);

  const updatesCountByTask = useMemo(() => {
    const map: { [taskId: string]: number } = {};
    taskUpdates.forEach((u) => {
      map[u.taskId] = (map[u.taskId] || 0) + 1;
    });
    return map;
  }, [taskUpdates]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return eventTasks.filter((t) => {
      if (filterDivisionId !== 'ALL' && t.divisionId !== filterDivisionId) return false;
      if (filterAssignedTo !== 'ALL' && t.assignedTo !== filterAssignedTo) return false;
      if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
      if (filterDeadline !== 'ALL') {
        const cond = getDeadlineCondition(t.deadline, t.status === 'COMPLETED');
        if (cond.condition !== filterDeadline) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const assignee = users.find((u) => u.id === t.assignedTo);
        const matchesUser = assignee?.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesUser) return false;
      }
      return true;
    });
  }, [
    eventTasks,
    filterDivisionId,
    filterAssignedTo,
    filterPriority,
    filterStatus,
    filterDeadline,
    searchQuery,
    users,
  ]);

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleOpenCreateInColumn = (status: TaskStatus) => {
    setDefaultStatusForNewTask(status);
    setTaskToEdit(null);
    setIsCreateOpen(true);
  };

  const handleEditFromDetail = (task: Task) => {
    setIsDetailOpen(false);
    setTaskToEdit(task);
    setIsCreateOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterDivisionId('ALL');
    setFilterAssignedTo('ALL');
    setFilterPriority('ALL');
    setFilterStatus('ALL');
    setFilterDeadline('ALL');
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Manajemen Tugas
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {activeEvent?.name}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-display">
              Daftar & Alur Kerja Tugas
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200/60 flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          {canCreateTask && (
            <ClayButton
              variant="primary"
              size="md"
              onClick={() => {
                setTaskToEdit(null);
                setDefaultStatusForNewTask('TODO');
                setIsCreateOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Buat Task
            </ClayButton>
          )}
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tugas, PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full clay-input pl-8 pr-3 py-2 text-xs"
            />
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={filterDivisionId}
              onChange={(e) => setFilterDivisionId(e.target.value)}
              className="w-full clay-input px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Semua Divisi</option>
              {eventDivisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full clay-input px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Deadline Filter */}
          <div>
            <select
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
              className="w-full clay-input px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Semua Deadline</option>
              <option value="OVERDUE">Overdue</option>
              <option value="DUE_TODAY">Hari Ini</option>
              <option value="UPCOMING">≤ 3 Hari</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>

          {/* PIC Filter */}
          <div>
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              className="w-full clay-input px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Semua PIC</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 flex-wrap gap-2">
          <span>
            Menampilkan <strong className="font-semibold text-slate-800">{filteredTasks.length}</strong> dari <strong className="font-semibold text-slate-800">{eventTasks.length}</strong> tugas
          </span>

          {(searchQuery ||
            filterDivisionId !== 'ALL' ||
            filterAssignedTo !== 'ALL' ||
            filterPriority !== 'ALL' ||
            filterStatus !== 'ALL' ||
            filterDeadline !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <TaskKanbanBoard
          tasks={filteredTasks}
          users={users}
          divisions={divisions}
          attachmentsCountByTask={attachmentsCountByTask}
          updatesCountByTask={updatesCountByTask}
          onSelectTask={handleOpenDetail}
          onAddTaskInColumn={handleOpenCreateInColumn}
          canCreateTask={canCreateTask}
        />
      ) : (
        /* List / Table View */
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-medium text-[11px]">
                  <th className="pb-3 px-3">Tugas</th>
                  <th className="pb-3 px-3">Divisi</th>
                  <th className="pb-3 px-3">Prioritas</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">PIC</th>
                  <th className="pb-3 px-3">Deadline</th>
                  <th className="pb-3 px-3 text-right">Progres</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => {
                  const assignedUser = users.find((u) => u.id === task.assignedTo);
                  const division = divisions.find((d) => d.id === task.divisionId);
                  const deadlineInfo = getDeadlineCondition(task.deadline, task.status === 'COMPLETED');

                  return (
                    <tr
                      key={task.id}
                      onClick={() => handleOpenDetail(task)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3 font-medium text-slate-900 group-hover:text-indigo-600">
                        {task.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-indigo-600">
                          {division?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignedUser?.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-slate-600">{assignedUser?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${deadlineInfo.badgeClass}`}>
                          <Clock className="w-3 h-3" />
                          {deadlineInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="w-24 ml-auto">
                          <div className="text-[11px] font-semibold text-indigo-600 mb-0.5">
                            {task.progress}%
                          </div>
                          <ClayProgressBar progress={task.progress} size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      Tidak ada tugas yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTask(null);
          }}
          taskId={selectedTask.id}
          onEditTask={handleEditFromDetail}
        />
      )}

      {/* Create / Edit Task Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        defaultStatus={defaultStatusForNewTask}
      />
    </div>
  );
};
