import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { Division } from '../../types';

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  divisionToEdit?: Division | null;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#ef4444', // Red
  '#3b82f6', // Blue
];

export const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({
  isOpen,
  onClose,
  divisionToEdit,
}) => {
  const { activeEvent, addDivision, updateDivision, users } = useApp();

  const [name, setName] = useState(divisionToEdit?.name || '');
  const [description, setDescription] = useState(divisionToEdit?.description || '');
  const [coordinatorId, setCoordinatorId] = useState(divisionToEdit?.coordinatorId || users[2]?.id || '');
  const [color, setColor] = useState(divisionToEdit?.color || '#6366f1');

  useEffect(() => {
    if (divisionToEdit) {
      setName(divisionToEdit.name);
      setDescription(divisionToEdit.description);
      setCoordinatorId(divisionToEdit.coordinatorId);
      setColor(divisionToEdit.color || '#6366f1');
    } else {
      setName('');
      setDescription('');
      setCoordinatorId(users[2]?.id || '');
      setColor('#6366f1');
    }
  }, [divisionToEdit, isOpen, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeEvent) return;

    if (divisionToEdit) {
      updateDivision(divisionToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        coordinatorId,
        color,
      });
    } else {
      addDivision({
        eventId: activeEvent.id,
        name: name.trim(),
        description: description.trim(),
        coordinatorId,
        color,
      });
    }

    onClose();
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title={divisionToEdit ? 'Edit Divisi' : 'Tambah Divisi Baru'}
      subtitle={`Event: ${activeEvent?.name || ''}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Divisi *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Divisi Acara & Show Management"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Koordinator Divisi *
          </label>
          <select
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Warna Identitas Divisi
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-2xl transition-all ${
                  color === c
                    ? 'ring-4 ring-indigo-400 scale-110 shadow-lg'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deskripsi & Tanggung Jawab Divisi
          </label>
          <textarea
            rows={3}
            placeholder="Rincian lingkup kerja, tugas pokok, dan wewenang divisi ini..."
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
            {divisionToEdit ? 'Simpan Perubahan' : 'Buat Divisi'}
          </ClayButton>
        </div>
      </form>
    </ClayModal>
  );
};
