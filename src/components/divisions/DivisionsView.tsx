import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateDivisionModal } from './CreateDivisionModal';
import { AddMemberModal } from './AddMemberModal';
import { ClayButton } from '../common/ClayButton';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { RoleBadge } from '../common/ClayBadge';
import { Division, EventMember } from '../../types';
import { formatIndonesianDate } from '../../utils/dateUtils';
import { 
  Layers, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  Phone, 
  CheckSquare, 
  Search, 
  Sparkles,
  UserX
} from 'lucide-react';

export const DivisionsView: React.FC = () => {
  const { 
    activeEvent, 
    divisions, 
    members, 
    tasks, 
    users, 
    deleteDivision, 
    removeMember, 
    currentUser 
  } = useApp();

  const [isCreateDivModalOpen, setIsCreateDivModalOpen] = useState(false);
  const [divisionToEdit, setDivisionToEdit] = useState<Division | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedDivForMember, setSelectedDivForMember] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisionId, setFilterDivisionId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'divisions' | 'members'>('divisions');

  const canManage = currentUser.role === 'ADMIN' || currentUser.role === 'EVENT_MANAGER';
  const isCoordinator = currentUser.role === 'COORDINATOR';

  const eventDivisions = divisions.filter((d) => d.eventId === activeEvent?.id);
  const eventMembers = members.filter((m) => m.eventId === activeEvent?.id);
  const eventTasks = tasks.filter((t) => t.eventId === activeEvent?.id);

  // Filter members
  const filteredMembers = eventMembers.filter((m) => {
    const user = users.find((u) => u.id === m.userId);
    const matchesDiv = filterDivisionId === 'ALL' || m.divisionId === filterDivisionId;
    const matchesSearch = 
      !searchQuery.trim() ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const handleEditDiv = (div: Division) => {
    setDivisionToEdit(div);
    setIsCreateDivModalOpen(true);
  };

  const handleDeleteDiv = (div: Division) => {
    if (confirm(`Hapus divisi "${div.name}"? Tugas dan anggota terkait akan terpengaruh.`)) {
      deleteDivision(div.id);
    }
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    if (confirm(`Hapus ${name} dari kepanitiaan event ini?`)) {
      removeMember(memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-5 sm:p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7CA1FF] text-white flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7CA1FF]">
                Struktur Kepanitiaan
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#1E40AF] shadow-sm">
                {activeEvent?.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              Divisi & Anggota Panitia
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {(canManage || isCoordinator) && (
            <ClayButton
              variant="secondary"
              size="md"
              onClick={() => {
                setSelectedDivForMember(undefined);
                setIsAddMemberModalOpen(true);
              }}
              icon={<UserPlus className="w-4 h-4 text-[#1E40AF]" />}
            >
              Tambah Panitia
            </ClayButton>
          )}

          {canManage && (
            <ClayButton
              variant="primary"
              size="md"
              onClick={() => {
                setDivisionToEdit(null);
                setIsCreateDivModalOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Buat Divisi
            </ClayButton>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Divisi vs Direktori Panitia */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('divisions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'divisions'
                ? 'clay-pill-blue text-indigo-700 bg-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Daftar Divisi ({eventDivisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'members'
                ? 'clay-pill-blue text-indigo-700 bg-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Panitia ({eventMembers.length})</span>
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / posisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-input pl-9 pr-3 py-1.5 text-xs text-slate-800 w-48 sm:w-56"
              />
            </div>

            {/* Division Filter */}
            <select
              value={filterDivisionId}
              onChange={(e) => setFilterDivisionId(e.target.value)}
              className="clay-input px-3 py-1.5 text-xs text-slate-800 font-semibold"
            >
              <option value="ALL">Semua Divisi</option>
              {eventDivisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'divisions' ? (
        /* Grid of Divisions */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventDivisions.map((div) => {
            const coordinator = users.find((u) => u.id === div.coordinatorId);
            const divMembers = eventMembers.filter((m) => m.divisionId === div.id);
            const divTasks = eventTasks.filter((t) => t.divisionId === div.id);
            const completedTasks = divTasks.filter((t) => t.status === 'COMPLETED').length;

            const progress = divTasks.length > 0
              ? Math.round(
                  divTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / divTasks.length
                )
              : 0;

            return (
              <div
                key={div.id}
                className="clay-card p-6 flex flex-col justify-between hover:scale-[1.01] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: div.color || '#6366f1' }}
                      />
                      <h3 className="font-extrabold text-slate-800 text-lg font-display group-hover:text-indigo-600 transition-colors">
                        {div.name}
                      </h3>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditDiv(div)}
                          className="w-7 h-7 rounded-lg clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-indigo-600"
                          title="Edit Divisi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDiv(div)}
                          className="w-7 h-7 rounded-lg clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-rose-600"
                          title="Hapus Divisi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {div.description || 'Tidak ada deskripsi.'}
                  </p>

                  {/* Coordinator Profile Card */}
                  <div className="clay-card-flat p-3 flex items-center gap-3 mb-4 bg-slate-50/80">
                    <img
                      src={coordinator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={coordinator?.name}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">
                        Koordinator Divisi
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {coordinator?.name || 'Belum ditentukan'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{coordinator?.email}</p>
                    </div>
                  </div>

                  {/* Task & Member Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="clay-sunken-sm p-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Anggota</span>
                      <p className="text-base font-extrabold text-slate-800 font-display">
                        {divMembers.length} Orang
                      </p>
                    </div>

                    <div className="clay-sunken-sm p-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tugas</span>
                      <p className="text-base font-extrabold text-indigo-600 font-display">
                        {completedTasks}/{divTasks.length} Selesai
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Progres Divisi</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <ClayProgressBar progress={progress} size="sm" />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setFilterDivisionId(div.id);
                      setActiveTab('members');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Lihat {divMembers.length} Anggota →
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDivForMember(div.id);
                      setIsAddMemberModalOpen(true);
                    }}
                    className="clay-pill-blue text-[11px] px-3 py-1 font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    + Anggota
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table of Members */
        <div className="clay-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Panitia / Personil</th>
                  <th className="pb-3">Divisi</th>
                  <th className="pb-3">Posisi / Jabatan</th>
                  <th className="pb-3">Kontak</th>
                  <th className="pb-3">Bergabung</th>
                  <th className="pb-3 pr-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const user = users.find((u) => u.id === member.userId);
                  const div = divisions.find((d) => d.id === member.divisionId);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm">{user?.name}</p>
                            <div className="mt-0.5">
                              <RoleBadge role={user?.role || 'MEMBER'} />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span className="clay-pill-blue text-xs px-2.5 py-1 font-bold">
                          {div?.name || 'Umum'}
                        </span>
                      </td>

                      <td className="py-3.5 font-bold text-slate-700">
                        {member.position}
                      </td>

                      <td className="py-3.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user?.email}</span>
                        </div>
                        {user?.phone && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user?.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 text-xs text-slate-500 font-medium">
                        {formatIndonesianDate(member.joinedAt)}
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        {canManage && (
                          <button
                            onClick={() => handleRemoveMember(member.id, user?.name || 'Anggota')}
                            className="w-8 h-8 rounded-xl clay-btn-secondary inline-flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus dari Panitia Event"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                      Tidak ada anggota panitia yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateDivisionModal
        isOpen={isCreateDivModalOpen}
        onClose={() => setIsCreateDivModalOpen(false)}
        divisionToEdit={divisionToEdit}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        defaultDivisionId={selectedDivForMember}
      />
    </div>
  );
};
