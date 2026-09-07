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
  borderClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'TODO',
    title: 'To Do',
    badgeClass: 'clay-pill-amber',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    borderClass: 'border-l-2 border-l-amber-400',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    badgeClass: 'clay-pill-blue',
    icon: <Clock className="w-3.5 h-3.5 text-indigo-600" />,
    borderClass: 'border-l-2 border-l-indigo-500',
  },
  {
    id: 'IN_REVIEW',
    title: 'In Review',
    badgeClass: 'clay-pill-purple',
    icon: <Eye className="w-3.5 h-3.5 text-purple-600" />,
    borderClass: 'border-l-2 border-l-purple-500',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    badgeClass: 'clay-pill-green',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    borderClass: 'border-l-2 border-l-emerald-500',
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
            className="bg-slate-100/70 border border-slate-200/70 p-2.5 rounded-xl flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs mb-2.5 ${col.borderClass}`}>
              <div className="flex items-center gap-2 min-w-0">
                {col.icon}
                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                  {col.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${col.badgeClass}`}>
                  {columnTasks.length}
                </span>

                {canCreateTask && (
                  <button
                    onClick={() => onAddTaskInColumn(col.id)}
                    className="w-5 h-5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                    title={`Tambah di ${col.title}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Task Cards List */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[720px] pr-0.5">
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
                <div className="text-center py-12 px-3 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg my-1">
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
