import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { Division } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDivisionId?: string;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  defaultDivisionId,
}) => {
  const { activeEvent, divisions, users, members, addMember } = useApp();

  const eventDivisions = divisions.filter((d) => d.eventId === activeEvent?.id);
  const existingUserIds = new Set(
    members.filter((m) => m.eventId === activeEvent?.id).map((m) => m.userId)
  );

  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');
  const [divisionId, setDivisionId] = useState(defaultDivisionId || eventDivisions[0]?.id || '');
  const [position, setPosition] = useState('');

  React.useEffect(() => {
    if (defaultDivisionId) {
      setDivisionId(defaultDivisionId);
    } else if (eventDivisions.length > 0 && !divisionId) {
      setDivisionId(eventDivisions[0].id);
    }
  }, [defaultDivisionId, eventDivisions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !divisionId || !position.trim() || !activeEvent) return;

    addMember({
      eventId: activeEvent.id,
      userId: selectedUserId,
      divisionId,
      position: position.trim(),
    });

    setPosition('');
    onClose();
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambahkan Anggota ke Panitia"
      subtitle={`Event: ${activeEvent?.name || ''}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Pilih Pengguna / Personil *
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — ({u.department || u.role}) {existingUserIds.has(u.id) ? '⚠️ Sudah terdaftar' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Divisi Penempatan *
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
            Jabatan / Posisi Spesifik *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Staff Rundown & Stage Management / LO Guest Star"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
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
            Tambahkan Anggota
          </ClayButton>
        </div>
      </form>
    </ClayModal>
  );
};
