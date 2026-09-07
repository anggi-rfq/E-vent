import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { PriorityBadge, StatusBadge, RoleBadge } from '../common/ClayBadge';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { getDeadlineCondition, formatIndonesianDate, formatFileSize, getTimeAgo } from '../../utils/dateUtils';
import { Task, TaskStatus } from '../../types';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Layers, 
  Paperclip, 
  MessageSquare, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Send,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEditTask?: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEditTask,
}) => {
  const { 
    users, 
    divisions, 
    currentUser, 
    updateTaskStatus, 
    updateTaskProgress, 
    deleteTask,
    taskUpdates,
    attachments,
    addAttachment,
    deleteAttachment
  } = useApp();

  const [progressInput, setProgressInput] = useState(task?.progress || 0);
  const [updateNote, setUpdateNote] = useState('');
  const [activeTab, setActiveTab] = useState<'updates' | 'attachments' | 'info'>('updates');
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (task) {
      setProgressInput(task.progress);
    }
  }, [task]);

  if (!task) return null;

  const assignedUser = users.find((u) => u.id === task.assignedTo);
  const creatorUser = users.find((u) => u.id === task.createdBy);
  const division = divisions.find((d) => d.id === task.divisionId);
  const deadlineInfo = getDeadlineCondition(task.deadline, task.status === 'COMPLETED');

  const updates = taskUpdates.filter((u) => u.taskId === task.id);
  const taskFiles = attachments.filter((a) => a.taskId === task.id);

  const canEditOrReview = 
    currentUser.role === 'ADMIN' || 
    currentUser.role === 'EVENT_MANAGER' || 
    currentUser.role === 'COORDINATOR' ||
    currentUser.id === task.assignedTo;

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskProgress(task.id, progressInput, updateNote);
    setUpdateNote('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      addAttachment({
        taskId: task.id,
        userId: currentUser.id,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size || 1024000,
      });
      setIsUploading(false);
      setActiveTab('attachments');
    }, 600);
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${deadlineInfo.badgeClass}`}>
            {deadlineInfo.label}
          </span>
        </div>
      }
      subtitle={`Divisi: ${division?.name || 'Divisi'} • Dibuat oleh ${creatorUser?.name || 'Panitia'}`}
      maxWidth="3xl"
    >
      <div className="space-y-6 py-1">
        {/* Task Title & Description */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-display">
            {task.title}
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            {task.description || 'Tidak ada catatan deskripsi tambahan.'}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* PIC */}
          <div className="clay-card-flat p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Penanggung Jawab (PIC)
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <img
                src={assignedUser?.avatar}
                alt={assignedUser?.name}
                className="w-7 h-7 rounded-lg object-cover border border-white shadow-sm"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{assignedUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{assignedUser?.department || assignedUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="clay-card-flat p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Batas Waktu
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{formatIndonesianDate(task.deadline)}</span>
            </div>
          </div>

          {/* Status Workflow */}
          <div className="clay-card-flat p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tahap Workflow
            </span>
            <p className="text-xs font-extrabold text-indigo-600 mt-1.5">
              {task.status}
            </p>
          </div>

          {/* Progress */}
          <div className="clay-card-flat p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Capaian Progres
            </span>
            <p className="text-xs font-extrabold text-emerald-600 mt-1.5">
              {task.progress}% Selesai
            </p>
          </div>
        </div>

        {/* Workflow Action Buttons (PRD 6.6 Workflow Transitions) */}
        <div className="clay-sunken p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Ubah Status Tugas:</span>
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => updateTaskStatus(task.id, 'TODO')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                task.status === 'TODO'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'clay-btn-secondary hover:bg-amber-50'
              }`}
            >
              To Do
            </button>

            <button
              onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                task.status === 'IN_PROGRESS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'clay-btn-secondary hover:bg-indigo-50'
              }`}
            >
              In Progress
            </button>

            <button
              onClick={() => updateTaskStatus(task.id, 'IN_REVIEW')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                task.status === 'IN_REVIEW'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'clay-btn-secondary hover:bg-purple-50'
              }`}
            >
              Kirim ke Review 👁️
            </button>

            <button
              onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'clay-btn-secondary hover:bg-emerald-50 text-emerald-700'
              }`}
            >
              ✓ Setujui & Selesai
            </button>
          </div>
        </div>

        {/* Tab Switcher: Riwayat Progres vs Berkas Lampiran */}
        <div className="border-b border-slate-200/80 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('updates')}
            className={`pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'updates'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Riwayat Progres ({updates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attachments')}
            className={`pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'attachments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            <span>Berkas & Lampiran ({taskFiles.length})</span>
          </button>
        </div>

        {activeTab === 'updates' ? (
          /* Task Updates & Progress Form */
          <div className="space-y-5">
            {/* Update Progress Form (PRD 6.7) */}
            {canEditOrReview && (
              <form onSubmit={handleSaveProgress} className="clay-card-flat p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Perbarui Persentase Progres & Catatan
                  </label>
                  <span className="text-sm font-extrabold text-indigo-600 font-display">
                    {progressInput}%
                  </span>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progressInput}
                    onChange={(e) => setProgressInput(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>0% (Belum Mulai)</span>
                    <span>50% (Separuh Jalan)</span>
                    <span>100% (Selesai)</span>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    required={progressInput !== task.progress}
                    placeholder="Tuliskan perkembangan pekerjaan (misal: 'Desain utama selesai, sedang proses revisi koordinator')..."
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    className="w-full clay-input p-3 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end">
                  <ClayButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Simpan & Publikasikan Progres
                  </ClayButton>
                </div>
              </form>
            )}

            {/* Updates Timeline List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Log Riwayat Progres
              </h4>

              {updates.map((upd) => {
                const author = users.find((u) => u.id === upd.userId);

                return (
                  <div key={upd.id} className="clay-card-flat p-3.5 flex items-start gap-3 bg-slate-50/70">
                    <img
                      src={author?.avatar}
                      alt={author?.name}
                      className="w-8 h-8 rounded-xl object-cover border border-white shadow-sm shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-800 text-xs">{author?.name}</span>
                          <RoleBadge role={author?.role || 'MEMBER'} />
                        </div>

                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          Progres: {upd.progress}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                        {upd.description}
                      </p>

                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        {getTimeAgo(upd.createdAt)} ({formatIndonesianDate(upd.createdAt)})
                      </span>
                    </div>
                  </div>
                );
              })}

              {updates.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada catatan progres untuk tugas ini.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Attachments Tab (PRD 6.8) */
          <div className="space-y-4">
            {/* Upload Zone */}
            <div className="clay-sunken p-6 rounded-2xl border-2 border-dashed border-indigo-200 text-center relative hover:border-indigo-400 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {isUploading ? 'Mengunggah Berkas...' : 'Klik atau Tarik File ke Sini'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung PDF, Dokumen Word/Excel, Desain Gambar (JPG/PNG), ZIP hingga 25MB
                  </p>
                </div>
              </div>
            </div>

            {/* List of Attachments */}
            <div className="space-y-2.5">
              {taskFiles.map((file) => {
                const uploader = users.find((u) => u.id === file.userId);
                const isImage = file.fileType.startsWith('image/');

                return (
                  <div
                    key={file.id}
                    className="clay-card-flat p-3 flex items-center justify-between gap-3 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{file.fileName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {formatFileSize(file.fileSize)} • Diunggah oleh {uploader?.name || 'Panitia'} • {getTimeAgo(file.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-xl clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-indigo-600"
                        title="Buka / Unduh File"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      {canEditOrReview && (
                        <button
                          onClick={() => deleteAttachment(file.id)}
                          className="w-8 h-8 rounded-xl clay-btn-secondary flex items-center justify-center text-slate-400 hover:text-rose-600"
                          title="Hapus Lampiran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {taskFiles.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada berkas yang dilampirkan pada tugas ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {canEditOrReview && (
            <button
              onClick={() => {
                if (confirm(`Yakin ingin menghapus tugas "${task.title}"?`)) {
                  deleteTask(task.id);
                  onClose();
                }
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Tugas</span>
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {canEditOrReview && onEditTask && (
              <ClayButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onEditTask(task)}
              >
                Edit Parameter Tugas
              </ClayButton>
            )}

            <ClayButton
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Tutup
            </ClayButton>
          </div>
        </div>
      </div>
    </ClayModal>
  );
};
