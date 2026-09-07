import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayButton } from '../common/ClayButton';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { formatIndonesianDate, formatFileSize, getTimeAgo } from '../../utils/dateUtils';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Paperclip, 
  BookOpen
} from 'lucide-react';

export const ReportsAndFilesView: React.FC = () => {
  const { 
    activeEvent, 
    divisions, 
    tasks, 
    attachments, 
    users 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lpj' | 'files'>('lpj');
  const [fileSearch, setFileSearch] = useState('');
  const [fileDivFilter, setFileDivFilter] = useState<string>('ALL');

  const eventTasks = tasks.filter((t) => t.eventId === activeEvent?.id);
  const eventDivisions = divisions.filter((d) => d.eventId === activeEvent?.id);
  const eventTaskIds = new Set(eventTasks.map((t) => t.id));
  const eventAttachments = attachments.filter((a) => eventTaskIds.has(a.taskId));

  const completedTasks = eventTasks.filter((t) => t.status === 'COMPLETED');
  const overallProgress = eventTasks.length > 0
    ? Math.round(eventTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / eventTasks.length)
    : 0;

  // Filtered files
  const filteredFiles = eventAttachments.filter((file) => {
    const task = tasks.find((t) => t.id === file.taskId);
    const matchesSearch = !fileSearch.trim() || 
      file.fileName.toLowerCase().includes(fileSearch.toLowerCase()) ||
      task?.title.toLowerCase().includes(fileSearch.toLowerCase());
    const matchesDiv = fileDivFilter === 'ALL' || task?.divisionId === fileDivFilter;
    return matchesSearch && matchesDiv;
  });

  const handlePrintLPJ = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Laporan & Dokumen
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-display">
              LPJ Event & Berkas Terlampir
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ClayButton
            variant="secondary"
            size="md"
            onClick={handlePrintLPJ}
            icon={<Printer className="w-4 h-4 text-slate-600" />}
          >
            Cetak / Ekspor PDF
          </ClayButton>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="border-b border-slate-200/80 flex items-center gap-4">
        <button
          onClick={() => setActiveTab('lpj')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'lpj'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kompilasi Draft LPJ Panitia</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'files'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
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
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="text-center border-b border-slate-100 pb-6">
              <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                Laporan Pertanggungjawaban (LPJ) Resmi
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-1">
                {activeEvent?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Periode: {formatIndonesianDate(activeEvent?.startDate || '')} s/d {formatIndonesianDate(activeEvent?.endDate || '')} • Lokasi: {activeEvent?.location}
              </p>
            </div>

            {/* Event Performance KPIs */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 font-display uppercase tracking-wider mb-3">
                I. Ringkasan Eksekutif & Indikator Kinerja (KPI)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 text-center">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Tingkat Penyelesaian</span>
                  <p className="text-xl font-semibold text-emerald-600 font-display mt-1">
                    {overallProgress}%
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 text-center">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Total Tugas Dituntaskan</span>
                  <p className="text-xl font-semibold text-slate-900 font-display mt-1">
                    {completedTasks.length} / {eventTasks.length}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 text-center">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Divisi Terlibat</span>
                  <p className="text-xl font-semibold text-slate-900 font-display mt-1">
                    {eventDivisions.length} Divisi
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 text-center">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Dokumen Terarsip</span>
                  <p className="text-xl font-semibold text-indigo-600 font-display mt-1">
                    {eventAttachments.length} Berkas
                  </p>
                </div>
              </div>
            </div>

            {/* Division Breakdown for LPJ */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 font-display uppercase tracking-wider mb-3">
                II. Laporan Pertanggungjawaban per Divisi
              </h3>

              <div className="space-y-3">
                {eventDivisions.map((div) => {
                  const divTasks = eventTasks.filter((t) => t.divisionId === div.id);
                  const divDone = divTasks.filter((t) => t.status === 'COMPLETED').length;
                  const divCoordinator = users.find((u) => u.id === div.coordinatorId);
                  const divProgress = divTasks.length > 0
                    ? Math.round((divDone / divTasks.length) * 100)
                    : 0;

                  return (
                    <div key={div.id} className="p-4 rounded-lg border border-slate-200/70 bg-white space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{div.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Koordinator: <strong className="font-medium text-slate-700">{divCoordinator?.name || '-'}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-indigo-600">{divProgress}% Selesai</span>
                          <p className="text-[11px] text-slate-400">{divDone} dari {divTasks.length} tugas tuntas</p>
                        </div>
                      </div>

                      <ClayProgressBar progress={divProgress} size="sm" />

                      <div className="text-xs text-slate-600">
                        <p className="font-medium text-slate-700 mb-1">Capaian Utama:</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                          {divTasks.slice(0, 3).map((t) => (
                            <li key={t.id}>
                              {t.title} — <span className="font-medium text-slate-700">{t.status}</span> ({t.progress}%)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evaluation & Conclusion Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 font-display uppercase tracking-wider mb-2">
                III. Evaluasi & Catatan Rekomendasi
              </h3>
              <div className="p-4 rounded-lg border border-slate-200/70 bg-slate-50 text-xs text-slate-600 leading-relaxed space-y-2">
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
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
              className="clay-input px-3 py-2 text-xs text-slate-800 font-medium w-full sm:w-auto"
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
                <tr className="border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
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
                            <p className="font-medium text-slate-900 text-xs sm:text-sm">
                              {file.fileName}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {getTimeAgo(file.uploadedAt)} ({formatIndonesianDate(file.uploadedAt)})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 font-medium text-slate-700 text-xs">
                        {task?.title || '-'}
                      </td>

                      <td className="py-3.5">
                        <span className="text-xs px-2.5 py-0.5 font-medium rounded-md bg-indigo-50 text-indigo-700">
                          {div?.name || 'Umum'}
                        </span>
                      </td>

                      <td className="py-3.5 text-xs text-slate-600 font-normal">
                        {uploader?.name || 'Panitia'}
                      </td>

                      <td className="py-3.5 text-xs text-slate-500 font-medium">
                        {formatFileSize(file.fileSize)}
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-2.5 py-1 font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
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
