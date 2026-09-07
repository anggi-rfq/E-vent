import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/ClayBadge';
import { ClayButton } from '../common/ClayButton';
import { QuickUserSwitcherModal } from './QuickUserSwitcherModal';
import { 
  Calendar, 
  Layers, 
  CheckSquare, 
  Paperclip, 
  Users, 
  RotateCcw, 
  Plus, 
  ChevronDown, 
  LayoutDashboard,
  Clock,
  Sparkles
} from 'lucide-react';

export type NavTab = 'dashboard' | 'timeline' | 'divisions' | 'tasks' | 'attachments' | 'users';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenCreateTask: () => void;
  onOpenCreateEvent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateTask,
  onOpenCreateEvent,
}) => {
  const { 
    currentUser, 
    events, 
    activeEvent, 
    setActiveEventId, 
    resetToDefaultData 
  } = useApp();

  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);

  const canCreateTask = currentUser.role !== 'MEMBER';
  const canCreateEvent = currentUser.role === 'ADMIN' || currentUser.role === 'EVENT_MANAGER';

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timeline' as NavTab, label: 'Timeline Event', icon: <Clock className="w-4 h-4" /> },
    { id: 'divisions' as NavTab, label: 'Divisi & Panitia', icon: <Layers className="w-4 h-4" /> },
    { id: 'tasks' as NavTab, label: 'Task Management', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'attachments' as NavTab, label: 'Lampiran Berkas', icon: <Paperclip className="w-4 h-4" /> },
  ];

  if (currentUser.role === 'ADMIN') {
    navItems.push({ id: 'users' as NavTab, label: 'Kelola Pengguna', icon: <Users className="w-4 h-4" /> });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#E6EEFA]/90 backdrop-blur-md border-b border-white/70 shadow-[0_6px_20px_rgba(209,217,230,0.45)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Brand, Event Selector, User Profile & Actions */}
          <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#7CA1FF] flex items-center justify-center text-white shadow-[6px_6px_14px_#C2D0ED,-4px_-4px_10px_#FFFFFF,inset_2px_2px_4px_#99B7FF,inset_-2px_-2px_4px_#5F8AE6] border border-white/40 transform hover:rotate-3 transition-transform">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-2xl tracking-tight text-[#2D3748]">
                    E-<span className="text-[#7CA1FF]">vent</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#DCE8FE] text-[#1E40AF] shadow-inner">
                    PRD v1.0
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#4A5568] tracking-wide">
                  Event & Committee Management
                </p>
              </div>
            </div>

            {/* Event Selector Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
                className="clay-card-sm px-4 py-2.5 flex items-center gap-3 hover:bg-white transition-all text-left max-w-[200px] sm:max-w-xs md:max-w-md"
              >
                <div className="w-8 h-8 rounded-xl bg-[#7CA1FF] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_6px_#C2D0ED,inset_1px_1px_2px_#99B7FF]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="truncate min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7CA1FF]">Event Aktif</p>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2D3748] truncate">
                    {activeEvent?.name || 'Pilih Event'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-auto" />
              </button>

              {/* Event Dropdown Menu */}
              {isEventMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsEventMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 sm:w-80 clay-card p-3 z-30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-[#D1D9E6]/70 mb-2">
                      <p className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                        Daftar Event Tersedia
                      </p>
                    </div>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {events.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => {
                            setActiveEventId(ev.id);
                            setIsEventMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                            ev.id === activeEvent?.id
                              ? 'bg-[#7CA1FF] text-white shadow-md'
                              : 'hover:bg-white/80 text-[#4A5568]'
                          }`}
                        >
                          <span className="truncate pr-2">{ev.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            ev.id === activeEvent?.id ? 'bg-white/25 text-white' : 'bg-[#E9F0FD] text-[#4A5568]'
                          }`}>
                            {ev.status}
                          </span>
                        </button>
                      ))}
                    </div>

                    {canCreateEvent && (
                      <div className="pt-2 mt-2 border-t border-[#D1D9E6]/70">
                        <button
                          onClick={() => {
                            setIsEventMenuOpen(false);
                            onOpenCreateEvent();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#DCE8FE] hover:bg-[#C8DCFE] text-[#1E40AF] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Buat Event Baru</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Quick Action, User Profile Switcher, Reset Demo */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Create Task */}
              {canCreateTask && (
                <ClayButton
                  variant="primary"
                  size="sm"
                  onClick={onOpenCreateTask}
                  icon={<Plus className="w-4 h-4" />}
                  className="hidden sm:inline-flex"
                >
                  Buat Task
                </ClayButton>
              )}

              {/* Reset Demo Data Button */}
              <button
                onClick={() => {
                  if (confirm('Kembalikan seluruh data ke demo awal (PRD default)?')) {
                    resetToDefaultData();
                  }
                }}
                className="w-10 h-10 rounded-2xl clay-btn-secondary flex items-center justify-center text-[#4A5568] hover:text-[#7CA1FF] transition-colors"
                title="Reset Data Demo ke Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Current User Pill / Switcher trigger */}
              <button
                onClick={() => setIsUserSwitcherOpen(true)}
                className="clay-card-sm px-2.5 sm:px-3.5 py-1.5 flex items-center gap-2 sm:gap-3 hover:bg-white transition-all text-left"
                title="Klik untuk mengganti akun / role"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div className="hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold text-[#2D3748] max-w-[110px] truncate">
                      {currentUser.name}
                    </p>
                  </div>
                  <RoleBadge role={currentUser.role} />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2 pb-3 overflow-x-auto no-scrollbar pt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#7CA1FF] text-white shadow-[6px_6px_14px_#C2D0ED,-4px_-4px_10px_#FFFFFF,inset_2px_2px_4px_#99B7FF,inset_-2px_-2px_4px_#5F8AE6] scale-100'
                      : 'text-[#4A5568] hover:text-[#2D3748] hover:bg-white/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* User Switcher Modal */}
      <QuickUserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
      />
    </>
  );
};
