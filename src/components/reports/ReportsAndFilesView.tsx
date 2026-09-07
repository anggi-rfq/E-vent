import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayButton } from '../common/ClayButton';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { formatIndonesianDate, formatFileSize, getTimeAgo } from '../../utils/dateUtils';
import { 
  FileText, 
  Download, 
  Paperclip, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  Layers, 
  Clock, 
  TrendingUp,
  FileCheck,
  Search,
  BookOpen
} from 'lucide-react';

export const ReportsAndFilesView: React.FC = () => {
  const { 
    activeEvent, 
    divisions, 
    tasks, 
    attachments, 
    users, 
    members, 
    milestones, 
    taskUpdates 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lpj' | 'files'>('lpj');
  const [fileSearch, setFileSearch] = useState('');
  const [fileDivFilter, setFileDivFilter] = useState('ALL');

  const eventTasks = tasks.filter((t) => t.eventId === activeEvent?.id);
  const eventDivisions = divisions.filter((d) => d.eventId === activeEvent?.id);
  const eventMembers = members.filter((m) => m.eventId === activeEvent?.id);
  const eventMilestones = milestones.filter((m) => m.eventId === activeEvent?.id);

  // Files in active event
  const eventTaskIds = new Set(eventTasks.map((t) => t.id));
  const eventAttachments = attachments.filter((a) => eventTaskIds.has(a.taskId));

  const filteredFiles = eventAttachments.filter((f) => {
    const task = tasks.find((t) => t.id === f.taskId);
    const matchesDiv = fileDivFilter === 'ALL' || task?.divisionId === fileDivFilter;
    const matchesSearch =
      !fileSearch.trim() ||
      f.fileName.toLowerCase().includes(fileSearch.toLowerCase()) ||
      task?.title.toLowerCase().includes(fileSearch.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const completedTasks = eventTasks.filter((t) => t.status === 'COMPLETED').length;
  const overallProgress = eventTasks.length > 0
    ? Math.round((completedTasks / eventTasks.length) * 100)
    : 0;

  const handlePrintLPJ = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-5 sm:p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#A2E0C1] text-[#065F46] flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] block mb-0.5">
              Laporan & Dokumen
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              LPJ Event & Berkas Terlampir
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ClayButton
            variant="secondary"
            size="md"
            onClick={handlePrintLPJ}
            icon={<Printer className="w-4 h-4 text-emerald-600" />}
          >
            Cetak / Ekspor PDF
          </ClayButton>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="border-b border-slate-200/80 flex items-center gap-3">
        <button
          onClick={() => setActiveTab('lpj')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'lpj'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kompilasi Draft LPJ Panitia</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'files'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>Repositori Dokumen & Lampiran ({eventAttachments.length})</span>
        </button>
      </div>

      {activeTab === 'lpj' ? (
        /* LPJ View */
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="clay-card p-6 sm:p-8 space-y-6 bg-white">
            <div className="text-center border-b border-slate-200 pb-6">
              <span className="clay-pill-purple text-xs font-extrabold px-3 py-1 uppercase tracking-wider mb-2 inline-block">
                Laporan Pertanggungjawaban (LPJ) Resmi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                {activeEvent?.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Periode: {formatIndonesianDate(activeEvent?.startDate || '')} s/d {formatIndonesianDate(activeEvent?.endDate || '')} • Lokasi: {activeEvent?.location}
              </p>
            </div>

            {/* Event Performance KPIs */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 font-display uppercase tracking-wider mb-3">
                I. Ringkasan Eksekutif & Indikator Kinerja (KPI)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="clay-sunken p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Penyelesaian</span>
                  <p className="text-2xl font-extrabold text-emerald-600 font-display mt-1">
                    {overallProgress}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{completedTasks}/{eventTasks.length} Tugas Beres</p>
                </div>

                <div className="clay-sunken p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Personil Panitia</span>
                  <p className="text-2xl font-extrabold text-indigo-600 font-display mt-1">
                    {eventMembers.length} Orang
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{eventDivisions.length} Divisi Kerja</p>
                </div>

                <div className="clay-sunken p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Milestone Tercapai</span>
                  <p className="text-2xl font-extrabold text-purple-600 font-display mt-1">
                    {eventMilestones.filter((m) => m.isCompleted).length}/{eventMilestones.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tahapan Road Map</p>
                </div>

                <div className="clay-sunken p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Partisipan</span>
                  <p className="text-2xl font-extrabold text-blue-600 font-display mt-1">
                    {activeEvent?.targetAttendees || 1000}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Peserta / Audiens</p>
                </div>
              </div>
            </div>

            {/* Division Breakdown Section */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 font-display uppercase tracking-wider mb-3">
                II. Laporan Perkembangan Masing-Masing Divisi
              </h3>

              <div className="space-y-4">
                {eventDivisions.map((div) => {
                  const divTasks = eventTasks.filter((t) => t.divisionId === div.id);
                  const divCoordinator = users.find((u) => u.id === div.coordinatorId);
                  const divMembers = eventMembers.filter((m) => m.divisionId === div.id);
                  const divCompleted = divTasks.filter((t) => t.status === 'COMPLETED').length;
                  const divProgress = divTasks.length > 0
                    ? Math.round(divTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / divTasks.length)
                    : 0;

                  return (
                    <div key={div.id} className="clay-card-flat p-4 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: div.color }} />
                          <h4 className="font-extrabold text-slate-800 text-sm">{div.name}</h4>
                          <span className="text-xs text-slate-500">
                            (Koordinator: <strong>{divCoordinator?.name}</strong> • {divMembers.length} Anggota)
                          </span>
                        </div>

                        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                          Progres: {divProgress}% ({divCompleted}/{divTasks.length} Tugas)
                        </span>
                      </div>

                      <ClayProgressBar progress={divProgress} size="sm" />

                      {/* Tasks breakdown list */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <ul className="text-xs space-y-1.5 text-slate-600">
                          {divTasks.map((t) => {
                            const assignee = users.find((u) => u.id === t.assignedTo);
                            return (
                              <li key={t.id} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={t.status === 'COMPLETED' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                    {t.status === 'COMPLETED' ? '✓' : '○'}
                                  </span>
                                  <span className={`truncate ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                                    {t.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 shrink-0">(PIC: {assignee?.name})</span>
                                </div>
                                <span className="text-[11px] font-bold text-indigo-600 shrink-0">{t.progress}%</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evaluation & Conclusion Section */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 font-display uppercase tracking-wider mb-2">
                III. Evaluasi & Catatan Rekomendasi
              </h3>
              <div className="clay-sunken p-4 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  • <strong>Koordinasi Antar Divisi:</strong> Alur komunikasi terpusat via E-vent membantu meminimalisir miskomunikasi teknis pada gladi bersih.
                </p>
                <p>
                  • <strong>Ketepatan Waktu:</strong> Fitur auto-indikator deadline berhasil menekan keterlambatan penyelesaian materi publikasi dan logistik.
                </p>
                <p>
                  • <strong>Rekomendasi Kegiatan Berikutnya:</strong> Disarankan untuk mempercepat konfirmasi pihak ketiga (vendor & sponsorship) minimal 3 pekan sebelum hari pelaksanaan acara.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Repository Files View */
        <div className="clay-card p-6 space-y-4">
          {/* File search & filter bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berkas dokumen, proposal..."
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                className="w-full clay-input pl-9 pr-3 py-2 text-xs text-slate-800"
              />
            </div>

            <select
              value={fileDivFilter}
              onChange={(e) => setFileDivFilter(e.target.value)}
              className="clay-input px-3 py-2 text-xs text-slate-800 font-bold w-full sm:w-auto"
            >
              <option value="ALL">Semua Divisi</option>
              {eventDivisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Files Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Nama Berkas</th>
                  <th className="pb-3">Terkait Tugas</th>
                  <th className="pb-3">Divisi</th>
                  <th className="pb-3">Diunggah Oleh</th>
                  <th className="pb-3">Ukuran</th>
                  <th className="pb-3 pr-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => {
                  const task = tasks.find((t) => t.id === file.taskId);
                  const div = divisions.find((d) => d.id === task?.divisionId);
                  const uploader = users.find((u) => u.id === file.userId);

                  return (
                    <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-xs sm:text-sm">
                              {file.fileName}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {getTimeAgo(file.uploadedAt)} ({formatIndonesianDate(file.uploadedAt)})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 font-semibold text-slate-700">
                        {task?.title || '-'}
                      </td>

                      <td className="py-3.5">
                        <span className="clay-pill-blue text-xs px-2.5 py-0.5 font-bold">
                          {div?.name || 'Umum'}
                        </span>
                      </td>

                      <td className="py-3.5 text-xs text-slate-600 font-medium">
                        {uploader?.name || 'Panitia'}
                      </td>

                      <td className="py-3.5 text-xs text-slate-500 font-bold">
                        {formatFileSize(file.fileSize)}
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="clay-pill-green text-xs px-3 py-1.5 font-bold inline-flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}

                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                      Belum ada berkas lampiran yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
