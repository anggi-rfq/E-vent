import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { Task, TaskPriority, TaskStatus } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultDivisionId?: string;
  defaultStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultDivisionId,
  defaultStatus = 'TODO',
}) => {
  const { activeEvent, divisions, users, members, addTask, updateTask, currentUser } = useApp();

  const eventDivisions = React.useMemo(() => divisions.filter((d) => d.eventId === activeEvent?.id), [divisions, activeEvent?.id]);
  const eventMembers = React.useMemo(() => members.filter((m) => m.eventId === activeEvent?.id), [members, activeEvent?.id]);

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [divisionId, setDivisionId] = useState(
    taskToEdit?.divisionId || defaultDivisionId || eventDivisions[0]?.id || ''
  );
  const [assignedTo, setAssignedTo] = useState(taskToEdit?.assignedTo || users[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || defaultStatus);
  const [deadline, setDeadline] = useState(taskToEdit?.deadline || '2026-09-10');
  const [progress, setProgress] = useState(taskToEdit?.progress || 0);
  const [estimatedHours, setEstimatedHours] = useState(taskToEdit?.estimatedHours || 8);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDivisionId(taskToEdit.divisionId);
      setAssignedTo(taskToEdit.assignedTo);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDeadline(taskToEdit.deadline);
      setProgress(taskToEdit.progress);
      setEstimatedHours(taskToEdit.estimatedHours || 8);
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setDivisionId(defaultDivisionId || eventDivisions[0]?.id || '');
      setAssignedTo(eventMembers[0]?.userId || users[0]?.id || '');
      setPriority('MEDIUM');
      setStatus(defaultStatus);
      setDeadline('2026-09-10');
      setProgress(0);
      setEstimatedHours(8);
    }
  }, [taskToEdit, isOpen, defaultDivisionId, defaultStatus, eventDivisions, eventMembers, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !divisionId || !assignedTo || !activeEvent) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        divisionId,
        assignedTo,
        priority,
        status,
        deadline,
        progress: Number(progress),
        estimatedHours: Number(estimatedHours),
      });
    } else {
      addTask({
        eventId: activeEvent.id,
        divisionId,
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        createdBy: currentUser.id,
        priority,
        status,
        deadline,
        progress: Number(progress),
        estimatedHours: Number(estimatedHours),
      });
    }

    onClose();
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Parameter Tugas' : 'Buat Tugas / Task Baru'}
      subtitle={`Event: ${activeEvent?.name || ''}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Judul Tugas *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Finalisasi Desain Backdrop Panggung & Merchandise"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Divisi Terkait *
            </label>
            <select
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            >
              {eventDivisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Penanggung Jawab (PIC) *
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.department || u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tingkat Prioritas *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            >
              <option value="LOW">🌱 LOW (Rendah)</option>
              <option value="MEDIUM">⏳ MEDIUM (Sedang)</option>
              <option value="HIGH">⚡ HIGH (Tinggi)</option>
              <option value="URGENT">🔥 URGENT (Mendesak)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Awal
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            >
              <option value="TODO">TO DO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="IN_REVIEW">IN REVIEW</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Batas Waktu (Deadline) *
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimasi Jam Kerja (Jam)
            </label>
            <input
              type="number"
              min={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Progres Awal ({progress}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deskripsi & Instruksi Pengerjaan
          </label>
          <textarea
            rows={3}
            placeholder="Jelaskan instruksi spesifik, deliverable yang diharapkan, format berkas, atau link referensi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <ClayButton
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Batal
          </ClayButton>
          <ClayButton type="submit" variant="primary" size="md">
            {taskToEdit ? 'Simpan Perubahan' : 'Buat Task'}
          </ClayButton>
        </div>
      </form>
    </ClayModal>
  );
};
