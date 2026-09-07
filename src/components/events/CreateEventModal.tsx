import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { Event, EventStatus } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event | null;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
}) => {
  const { addEvent, updateEvent, currentUser, users } = useApp();

  const [name, setName] = useState(eventToEdit?.name || '');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [startDate, setStartDate] = useState(eventToEdit?.startDate || '2026-10-15');
  const [endDate, setEndDate] = useState(eventToEdit?.endDate || '2026-10-18');
  const [location, setLocation] = useState(eventToEdit?.location || '');
  const [status, setStatus] = useState<EventStatus>(eventToEdit?.status || 'PREPARATION');
  const [managerId, setManagerId] = useState(eventToEdit?.managerId || currentUser.id);
  const [targetAttendees, setTargetAttendees] = useState(eventToEdit?.targetAttendees || 1000);
  const [budgetTotal, setBudgetTotal] = useState(eventToEdit?.budgetTotal || 100000000);

  // Sync when eventToEdit changes
  React.useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setDescription(eventToEdit.description);
      setStartDate(eventToEdit.startDate);
      setEndDate(eventToEdit.endDate);
      setLocation(eventToEdit.location);
      setStatus(eventToEdit.status);
      setManagerId(eventToEdit.managerId);
      setTargetAttendees(eventToEdit.targetAttendees || 1000);
      setBudgetTotal(eventToEdit.budgetTotal || 100000000);
    } else {
      setName('');
      setDescription('');
      setStartDate('2026-10-15');
      setEndDate('2026-10-18');
      setLocation('');
      setStatus('PLANNING');
      setManagerId(currentUser.id);
      setTargetAttendees(1000);
      setBudgetTotal(100000000);
    }
  }, [eventToEdit, isOpen, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
        location: location.trim(),
        status,
        managerId,
        targetAttendees: Number(targetAttendees),
        budgetTotal: Number(budgetTotal),
      });
    } else {
      addEvent({
        name: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
        location: location.trim(),
        status,
        managerId,
        targetAttendees: Number(targetAttendees),
        budgetTotal: Number(budgetTotal),
        budgetSpent: 0,
        bannerColor: 'from-indigo-500 to-purple-600',
      });
    }

    onClose();
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Informasi Event' : 'Buat Event Baru'}
      subtitle="Definisikan nama, jadwal pelaksanaan, lokasi, dan target anggaran event"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Event *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: National Youth Innovation Summit 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deskripsi & Tujuan Event
          </label>
          <textarea
            rows={3}
            placeholder="Jelaskan gambaran umum, konsep acara, dan sasaran peserta..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tanggal Mulai *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tanggal Selesai *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Lokasi / Venue Event *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Grand Ballroom Hotel Indonesia Kempinski / Online Zoom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full clay-input p-3 text-sm text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Event
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            >
              <option value="PLANNING">PLANNING (Perencanaan)</option>
              <option value="PREPARATION">PREPARATION (Persiapan & Produksi)</option>
              <option value="ONGOING">ONGOING (Sedang Berlangsung)</option>
              <option value="COMPLETED">COMPLETED (Telah Selesai)</option>
              <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ketua Panitia / Event Manager
            </label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Jumlah Peserta
            </label>
            <input
              type="number"
              min={1}
              value={targetAttendees}
              onChange={(e) => setTargetAttendees(Number(e.target.value))}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Alokasi Total Anggaran (IDR)
            </label>
            <input
              type="number"
              min={0}
              step={1000000}
              value={budgetTotal}
              onChange={(e) => setBudgetTotal(Number(e.target.value))}
              className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
          <ClayButton
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Batal
          </ClayButton>
          <ClayButton type="submit" variant="primary" size="md">
            {eventToEdit ? 'Simpan Perubahan' : 'Buat Event'}
          </ClayButton>
        </div>
      </form>
    </ClayModal>
  );
};
