import React from 'react';
import { Division, Task } from '../../types';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { Layers } from 'lucide-react';

interface DivisionProgressComparisonProps {
  divisions: Division[];
  tasks: Task[];
  onSelectDivision?: (divisionId: string) => void;
}

export const DivisionProgressComparison: React.FC<DivisionProgressComparisonProps> = ({
  divisions,
  tasks,
  onSelectDivision,
}) => {
  const divisionStats = divisions.map((div) => {
    const divTasks = tasks.filter((t) => t.divisionId === div.id);
    const totalTasks = divTasks.length;
    const completedTasks = divTasks.filter((t) => t.status === 'COMPLETED').length;

    const avgProgress = totalTasks > 0
      ? Math.round(divTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / totalTasks)
      : 0;

    return {
      division: div,
      totalTasks,
      completedTasks,
      avgProgress,
    };
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 font-display">
            Progres Divisi
          </h3>
          <p className="text-xs text-slate-500">
            Status penyelesaian tugas per bidang
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {divisionStats.map((stat) => (
          <div
            key={stat.division.id}
            onClick={() => onSelectDivision && onSelectDivision(stat.division.id)}
            className="p-3.5 rounded-lg border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: stat.division.color || '#4F46E5' }}
                />
                <h4 className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {stat.division.name}
                </h4>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <span className="text-slate-500">
                  {stat.completedTasks}/{stat.totalTasks} Selesai
                </span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                  {stat.avgProgress}%
                </span>
              </div>
            </div>

            <ClayProgressBar progress={stat.avgProgress} size="sm" />
          </div>
        ))}

        {divisionStats.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            Belum ada divisi untuk event ini.
          </div>
        )}
      </div>
    </div>
  );
};
