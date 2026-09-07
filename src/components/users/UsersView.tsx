import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/ClayBadge';
import { ClayModal } from '../common/ClayModal';
import { ClayButton } from '../common/ClayButton';
import { User, UserRole } from '../../types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Building2, 
  Edit, 
  Trash2, 
  KeyRound, 
  Check,
  Search,
  RotateCcw
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, currentUser, switchUser, addUser, updateUser, deleteUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const isAdmin = currentUser.role === 'ADMIN';

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setName('');
    setEmail('');
    setRole('MEMBER');
    setDepartment('');
    setPhone('');
    setAvatar(`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department || '');
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (userToEdit) {
      updateUser(userToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        role,
        department: department.trim(),
        phone: phone.trim(),
        avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      });
    } else {
      addUser({
        name: name.trim(),
        email: email.trim(),
        role,
        department: department.trim(),
        phone: phone.trim(),
        avatar: avatar.trim() || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=120&auto=format&fit=crop&q=80`,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('Anda tidak dapat menghapus akun yang sedang Anda gunakan saat ini.');
      return;
    }
    if (confirm(`Yakin ingin menghapus akun ${userName}?`)) {
      deleteUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-5 sm:p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] block mb-0.5">
              Manajemen Pengguna
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              Direktori Pengguna & Hak Akses
            </h2>
          </div>
        </div>

        {isAdmin && (
          <ClayButton
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Tambah Pengguna
          </ClayButton>
        )}
      </div>

      {/* Filter Bar */}
      <div className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, instansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full clay-input pl-9 pr-3 py-2 text-xs text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="clay-input px-3 py-2 text-xs text-slate-800 font-bold w-full sm:w-auto"
          >
            <option value="ALL">Semua Peran / Role</option>
            <option value="ADMIN">Administrator</option>
            <option value="EVENT_MANAGER">Event Manager (Ketua)</option>
            <option value="COORDINATOR">Koordinator Divisi</option>
            <option value="MEMBER">Anggota Panitia</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const isMe = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`clay-card p-6 flex flex-col justify-between transition-all ${
                isMe ? 'ring-2 ring-indigo-500 bg-indigo-50/20 shadow-indigo-100' : 'hover:scale-[1.01]'
              }`}
            >
              <div>
                {/* Header with Avatar and Role */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />

                  <div className="flex flex-col items-end gap-1">
                    <RoleBadge role={user.role} />
                    {isMe && (
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        Akun Aktif Anda
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-800 font-display">
                  {user.name}
                </h3>

                <p className="text-xs text-indigo-600 font-bold mt-0.5">
                  {user.department || 'BEM / Panitia Universitas'}
                </p>

                {/* Contact info */}
                <div className="space-y-2 mt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!isMe ? (
                  <button
                    onClick={() => switchUser(user.id)}
                    className="clay-pill-blue text-xs px-3 py-1.5 font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Beralih ke Akun Ini
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    Sedang Digunakan
                  </span>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="w-8 h-8 rounded-xl clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-indigo-600"
                      title="Edit Akun"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!isMe && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="w-8 h-8 rounded-xl clay-btn-secondary flex items-center justify-center text-slate-500 hover:text-rose-600"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit User */}
      <ClayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={userToEdit ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
        subtitle="Kelola profil dan hak akses pengguna dalam sistem kepanitiaan"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sarah Nurhaliza, S.Kom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Alamat Email *
            </label>
            <input
              type="email"
              required
              placeholder="sarah@event.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Peran / Role Sistem *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full clay-input p-3 text-sm text-slate-800 font-bold"
              >
                <option value="ADMIN">ADMINISTRATOR (Full Akses)</option>
                <option value="EVENT_MANAGER">EVENT MANAGER (Ketua Panitia)</option>
                <option value="COORDINATOR">COORDINATOR (Koordinator Divisi)</option>
                <option value="MEMBER">MEMBER (Anggota Panitia)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+62 812-3456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full clay-input p-3 text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Departemen / Instansi / Fakultas
            </label>
            <input
              type="text"
              placeholder="Contoh: BEM Fakultas Ilmu Komputer / Divisi Acara"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full clay-input p-3 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Foto Profil / Avatar
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full clay-input p-3 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <ClayButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </ClayButton>
            <ClayButton type="submit" variant="primary" size="md">
              {userToEdit ? 'Simpan Perubahan' : 'Buat Pengguna'}
            </ClayButton>
          </div>
        </form>
      </ClayModal>
    </div>
  );
};
