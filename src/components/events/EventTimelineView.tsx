import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { EventMilestone } from '../../types';
import { formatIndonesianDate } from '../../utils/dateUtils';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  Flag, 
  Sparkles, 
  CheckCheck,
  CalendarCheck2
} from 'lucide-react';

export const EventTimelineView: React.FC = () => {
  const { 
    activeEvent, 
    milestones, 
    toggleMilestone, 
    addMilestone, 
    currentUser 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMonth, setNewMonth] = useState('SEPTEMBER 2026');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('2026-09-15');
  const [newCategory, setNewCategory] = useState<EventMilestone['category']>('PREPARATION');

  const canManageTimeline = currentUser.role === 'ADMIN' || currentUser.role === 'EVENT_MANAGER';

  const eventMilestones = milestones.filter(m => m.eventId === activeEvent?.id);
  const completedMilestones = eventMilestones.filter(m => m.isCompleted).length;
  const progressPercent = eventMilestones.length > 0
    ? Math.round((completedMilestones / eventMilestones.length) * 100)
    : 0;

  // Group by month
  const groupedMilestones: { [month: string]: EventMilestone[] } = {};
  eventMilestones.forEach(m => {
    if (!groupedMilestones[m.month]) {
      groupedMilestones[m.month] = [];
    }
    groupedMilestones[m.month].push(m);
  });

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeEvent) return;

    addMilestone({
      eventId: activeEvent.id,
      month: newMonth.toUpperCase(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      targetDate: newTargetDate,
      isCompleted: false,
      category: newCategory,
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-6 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-300">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Master Road Map
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-sm">
                {activeEvent?.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-display mt-0.5">
              Timeline & Tahapan Pelaksanaan Event
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Rangkaian milestone mulai dari perencanaan, persiapan, gladi bersih, hingga hari-H pelaksanaan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="clay-card-flat px-4 py-2 text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Milestone Tercapai</span>
            <p className="text-lg font-extrabold text-indigo-600 font-display">
              {completedMilestones} / {eventMilestones.length} ({progressPercent}%)
            </p>
          </div>

          {canManageTimeline && (
            <ClayButton
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Tambah Milestone
            </ClayButton>
          )}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-1 before:bg-indigo-200 before:rounded-full">
        {Object.entries(groupedMilestones).map(([month, items], groupIndex) => (
          <div key={month} className="space-y-4">
            {/* Month Header Pill */}
            <div className="flex justify-start md:justify-center relative z-10 pl-14 md:pl-0">
              <div className="clay-pill bg-indigo-600 text-white px-5 py-2 text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-indigo-300">
                📅 {month}
              </div>
            </div>

            {/* Milestones in this month */}
            <div className="space-y-4">
              {items.map((milestone, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={milestone.id}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-4 relative pl-14 md:pl-0 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Checkbox / Bullet Icon on Center Line */}
                    <button
                      onClick={() => canManageTimeline && toggleMilestone(milestone.id)}
                      disabled={!canManageTimeline}
                      title={canManageTimeline ? 'Klik untuk mengubah status milestone' : undefined}
                      className={`absolute left-3.5 md:left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        milestone.isCompleted
                          ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.7)] scale-110'
                          : 'bg-white border-2 border-slate-300 text-slate-400 hover:border-indigo-500'
                      }`}
                    >
                      {milestone.isCompleted ? (
                        <CheckCheck className="w-4 h-4 font-bold" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </button>

                    {/* Milestone Card Content */}
                    <div className="w-full md:w-[calc(50%-2rem)]">
                      <div
                        onClick={() => canManageTimeline && toggleMilestone(milestone.id)}
                        className={`clay-card p-5 transition-all ${
                          canManageTimeline ? 'cursor-pointer hover:scale-[1.01]' : ''
                        } ${
                          milestone.isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200 shadow-emerald-100'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            milestone.isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {milestone.category}
                          </span>

                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            {formatIndonesianDate(milestone.targetDate)}
                          </span>
                        </div>

                        <h4 className={`text-base font-extrabold font-display ${
                          milestone.isCompleted ? 'text-emerald-900 line-through' : 'text-slate-800'
                        }`}>
                          {milestone.title}
                        </h4>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {milestone.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className={milestone.isCompleted ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                            {milestone.isCompleted ? '✓ Telah Rampung' : '⏳ Belum Selesai'}
                          </span>

                          {canManageTimeline && (
                            <span className="text-slate-400 font-medium">
                              Klik untuk switch status
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Milestone Modal */}
      <ClayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Milestone Timeline"
        subtitle="Tambahkan tahapan dan target waktu penting untuk kepanitiaan event"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Milestone *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Gladi Bersih Main Stage & Sound Test"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bulan & Tahun *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: SEPTEMBER 2026"
                value={newMonth}
                onChange={(e) => setNewMonth(e.target.value)}
                className="w-full clay-input p-3 text-sm text-slate-800 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Tanggal *
              </label>
              <input
                type="date"
                required
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full clay-input p-3 text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kategori Tahapan
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
            >
              <option value="PLANNING">PLANNING (Perencanaan & Konsep)</option>
              <option value="PREPARATION">PREPARATION (Persiapan & Promosi)</option>
              <option value="EXECUTION">EXECUTION (Pelaksanaan & Hari-H)</option>
              <option value="EVALUATION">EVALUATION (Evaluasi & LPJ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Detail
            </label>
            <textarea
              rows={3}
              placeholder="Rincian target atau checklist yang harus dicapai..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <ClayButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </ClayButton>
            <ClayButton type="submit" variant="primary" size="md">
              Simpan Milestone
            </ClayButton>
          </div>
        </form>
      </ClayModal>
    </div>
  );
};
