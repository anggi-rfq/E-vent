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
    <div className="clay-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#2D3748] font-display">
            Progres Divisi
          </h3>
          <p className="text-xs text-[#4A5568] font-medium">
            Status penyelesaian tugas per bidang
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {divisionStats.map((stat) => (
          <div
            key={stat.division.id}
            onClick={() => onSelectDivision && onSelectDivision(stat.division.id)}
            className="clay-card-flat p-4 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: stat.division.color || '#7CA1FF' }}
                />
                <h4 className="text-sm font-bold text-[#2D3748] group-hover:text-[#7CA1FF] transition-colors">
                  {stat.division.name}
                </h4>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-[#4A5568]">
                  {stat.completedTasks}/{stat.totalTasks} Selesai
                </span>
                <span className="font-extrabold text-[#1E40AF] bg-[#DCE8FE] px-2 py-0.5 rounded-lg">
                  {stat.avgProgress}%
                </span>
              </div>
            </div>

            <ClayProgressBar progress={stat.avgProgress} size="sm" />
          </div>
        ))}

        {divisionStats.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-sm">
            Belum ada divisi untuk event ini.
          </div>
        )}
      </div>
    </div>
  );
};
