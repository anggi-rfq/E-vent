import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClayModal } from '../common/ClayModal';
import { RoleBadge } from '../common/ClayBadge';
import { Check, Shield, Crown, Sparkles, User as UserIcon } from 'lucide-react';
import { UserRole } from '../../types';

interface QuickUserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickUserSwitcherModal: React.FC<QuickUserSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { users, currentUser, switchUserRole } = useApp();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'EVENT_MANAGER':
        return <Crown className="w-5 h-5 text-rose-500" />;
      case 'COORDINATOR':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'MEMBER':
      default:
        return <UserIcon className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Akses penuh: Kelola semua user, lihat seluruh event, audit log & konfigurasi master.';
      case 'EVENT_MANAGER':
        return 'Ketua Panitia: Buat event, bentuk divisi, tentukan koordinator, pantau seluruh progres & deadline.';
      case 'COORDINATOR':
        return 'Koordinator Divisi: Kelola anggota divisi sendiri, buat & bagikan task, review pekerjaan anggota.';
      case 'MEMBER':
      default:
        return 'Anggota Panitia: Lihat task pribadi, update progres kerja, unggah berkas, dan ajukan review.';
    }
  };

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title="Beralih Pengguna & Role"
      subtitle="Pilih profil untuk menguji tampilan dan hak akses sistem (RBAC) secara instan"
      maxWidth="xl"
    >
      <div className="space-y-3 py-2">
        {users.map((user) => {
          const isSelected = user.id === currentUser.id;

          return (
            <button
              key={user.id}
              onClick={() => {
                switchUserRole(user.id);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 ${
                isSelected
                  ? 'bg-indigo-50/80 border-2 border-indigo-500 shadow-[inset_2px_2px_4px_rgba(99,102,241,0.2),4px_4px_12px_rgba(99,102,241,0.15)]'
                  : 'clay-card-flat clay-card-hover border border-transparent'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-13 h-13 rounded-2xl object-cover shadow-[2px_2px_6px_rgba(0,0,0,0.15)] border-2 border-white"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-800 text-base">{user.name}</h4>
                  <RoleBadge role={user.role} />
                </div>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{user.department || user.email}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {getRoleDescription(user.role)}
                </p>
              </div>

              <div className="shrink-0 pl-2">
                {isSelected ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs hover:bg-indigo-100 hover:text-indigo-600">
                    Pilih
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ClayModal>
  );
};
