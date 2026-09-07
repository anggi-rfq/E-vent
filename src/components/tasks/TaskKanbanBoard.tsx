import React from 'react';
import { Task, User, Division, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus, CheckCircle2, Clock, Eye } from 'lucide-react';

interface TaskKanbanBoardProps {
  tasks: Task[];
  users: User[];
  divisions: Division[];
  attachmentsCountByTask: { [taskId: string]: number };
  updatesCountByTask: { [taskId: string]: number };
  onSelectTask: (task: Task) => void;
  onAddTaskInColumn: (status: TaskStatus) => void;
  canCreateTask: boolean;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  badgeClass: string;
  icon: React.ReactNode;
  headerColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'TODO',
    title: 'To Do',
    badgeClass: 'clay-pill-amber',
    icon: <Clock className="w-4 h-4 text-[#9A3412]" />,
    headerColor: 'border-[#FED7AA]',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    badgeClass: 'clay-pill-blue',
    icon: <Clock className="w-4 h-4 text-[#1E40AF]" />,
    headerColor: 'border-[#7CA1FF]',
  },
  {
    id: 'IN_REVIEW',
    title: 'In Review',
    badgeClass: 'clay-pill-purple',
    icon: <Eye className="w-4 h-4 text-[#6D28D9]" />,
    headerColor: 'border-[#DDD6FE]',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    badgeClass: 'clay-pill-green',
    icon: <CheckCircle2 className="w-4 h-4 text-[#065F46]" />,
    headerColor: 'border-[#A2E0C1]',
  },
];

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  users,
  divisions,
  attachmentsCountByTask,
  updatesCountByTask,
  onSelectTask,
  onAddTaskInColumn,
  canCreateTask,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="clay-sunken p-3 rounded-2xl flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl bg-white shadow-sm mb-3 border-l-4 ${col.headerColor}`}>
              <div className="flex items-center gap-2 min-w-0">
                {col.icon}
                <h4 className="font-extrabold text-[#2D3748] text-xs sm:text-sm truncate">
                  {col.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badgeClass}`}>
                  {columnTasks.length}
                </span>

                {canCreateTask && (
                  <button
                    onClick={() => onAddTaskInColumn(col.id)}
                    className="w-6 h-6 rounded-lg clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-[#1E40AF]"
                    title={`Tambah di ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Task Cards List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[720px] pr-1">
              {columnTasks.map((task) => {
                const assignedUser = users.find((u) => u.id === task.assignedTo);
                const division = divisions.find((d) => d.id === task.divisionId);

                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignedUser={assignedUser}
                    division={division}
                    attachmentCount={attachmentsCountByTask[task.id] || 0}
                    updateCount={updatesCountByTask[task.id] || 0}
                    onClick={() => onSelectTask(task)}
                  />
                );
              })}

              {columnTasks.length === 0 && (
                <div className="text-center py-12 px-3 text-slate-400 text-xs border border-dashed border-[#D1D9E6] rounded-xl my-2">
                  Kosong
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
