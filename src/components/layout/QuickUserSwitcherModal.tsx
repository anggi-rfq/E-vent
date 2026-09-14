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
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
      case 'EVENT_MANAGER':
        return <Crown className="w-3.5 h-3.5 text-rose-500" />;
      case 'COORDINATOR':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-500" />;
      case 'MEMBER':
      default:
        return <UserIcon className="w-3.5 h-3.5 text-emerald-500" />;
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
      <div className="space-y-2.5 py-1">
        {users.map((user) => {
          const isSelected = user.id === currentUser?.id;

          return (
            <button
              key={user.id}
              onClick={() => {
                switchUserRole(user.id);
                onClose();
              }}
              className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center gap-3.5 ${
                isSelected
                  ? 'bg-indigo-50/70 border border-indigo-400 shadow-xs'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-slate-900 text-sm">{user.name}</h4>
                  <RoleBadge role={user.role} />
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{user.department || user.email}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {getRoleDescription(user.role)}
                </p>
              </div>

              <div className="shrink-0 pl-2">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400 hover:text-indigo-600">
                    Pilih
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ClayModal>
  );
};
