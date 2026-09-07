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
  onOpenCreateTask?: () => void;
  onOpenCreateEvent?: () => void;
  onOpenUserSwitcher?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateTask,
  onOpenCreateEvent,
  onOpenUserSwitcher,
}) => {
  const { 
    currentUser, 
    events, 
    activeEvent, 
    setActiveEventId, 
    resetToDefaultData 
  } = useApp();

  const [internalUserSwitcherOpen, setInternalUserSwitcherOpen] = useState(false);
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);

  const handleOpenUserSwitcher = () => {
    if (onOpenUserSwitcher) {
      onOpenUserSwitcher();
    } else {
      setInternalUserSwitcherOpen(true);
    }
  };

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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Brand, Event Selector, User Profile & Actions */}
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                    E-<span className="text-indigo-600">vent</span>
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    v1.0
                  </span>
                </div>
              </div>
            </div>

            {/* Event Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 flex items-center gap-2.5 transition-colors shadow-xs text-left max-w-[200px] sm:max-w-xs md:max-w-md"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="truncate min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Event</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {activeEvent?.name || 'Pilih Event'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>

              {/* Event Dropdown Menu */}
              {isEventMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsEventMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white border border-slate-200/90 rounded-xl p-2 z-30 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Daftar Event Tersedia
                      </p>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                      {events.map((ev) => {
                        const isSelected = ev.id === activeEvent?.id;
                        return (
                          <button
                            key={ev.id}
                            onClick={() => {
                              setActiveEventId(ev.id);
                              setIsEventMenuOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="truncate pr-2">{ev.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isSelected ? 'bg-indigo-200/70 text-indigo-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {ev.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {canCreateEvent && onOpenCreateEvent && (
                      <div className="pt-2 mt-1.5 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsEventMenuOpen(false);
                            onOpenCreateEvent();
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
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
              {canCreateTask && onOpenCreateTask && (
                <ClayButton
                  variant="primary"
                  size="sm"
                  onClick={onOpenCreateTask}
                  icon={<Plus className="w-3.5 h-3.5" />}
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
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-xs flex items-center justify-center transition-colors"
                title="Reset Data Demo ke Default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Current User Pill / Switcher trigger */}
              <button
                onClick={handleOpenUserSwitcher}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 sm:px-3 py-1 flex items-center gap-2 sm:gap-2.5 transition-colors shadow-xs text-left"
                title="Klik untuk mengganti akun / role"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200"
                />
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-900 max-w-[120px] truncate leading-tight">
                    {currentUser.name}
                  </p>
                  <RoleBadge role={currentUser.role} size="sm" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <nav className="flex items-center gap-1 border-t border-slate-100 pt-1 pb-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

      {/* Internal User Switcher fallback if not managed externally */}
      {!onOpenUserSwitcher && (
        <QuickUserSwitcherModal
          isOpen={internalUserSwitcherOpen}
          onClose={() => setInternalUserSwitcherOpen(false)}
        />
      )}
    </>
  );
};
