import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventTimelineView } from './EventTimelineView';
import { CreateEventModal } from './CreateEventModal';
import { ClayButton } from '../common/ClayButton';
import { ClayProgressBar } from '../common/ClayProgressBar';
import { formatIndonesianDate } from '../../utils/dateUtils';
import { Event } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { 
    events, 
    activeEventId, 
    setActiveEventId, 
    deleteEvent, 
    divisions, 
    members, 
    tasks, 
    users, 
    currentUser 
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [subView, setSubView] = useState<'timeline' | 'all-events'>('timeline');

  const canManageEvents = currentUser.role === 'ADMIN' || currentUser.role === 'EVENT_MANAGER';

  const handleEdit = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToEdit(event);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (eventId: string, eventName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Yakin ingin menghapus event "${eventName}" beserta seluruh divisi dan tugas di dalamnya?`)) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs: Master Timeline vs Daftar Seluruh Event */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-3">
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200/60 flex items-center gap-1">
          <button
            onClick={() => setSubView('timeline')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${
              subView === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Master Timeline & Milestones</span>
          </button>

          <button
            onClick={() => setSubView('all-events')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${
              subView === 'all-events'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semua Event ({events.length})</span>
          </button>
        </div>

        {canManageEvents && (
          <ClayButton
            variant="primary"
            size="sm"
            onClick={() => {
              setEventToEdit(null);
              setIsCreateModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Buat Event Baru
          </ClayButton>
        )}
      </div>

      {subView === 'timeline' ? (
        <EventTimelineView />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const isActive = ev.id === activeEventId;
            const eventDivs = divisions.filter((d) => d.eventId === ev.id);
            const eventMems = members.filter((m) => m.eventId === ev.id);
            const eventTasks = tasks.filter((t) => t.eventId === ev.id);
            const manager = users.find((u) => u.id === ev.managerId);

            const progress = eventTasks.length > 0
              ? Math.round(
                  (eventTasks.filter((t) => t.status === 'COMPLETED').length /
                    eventTasks.length) *
                    100
                )
              : 0;

            return (
              <div
                key={ev.id}
                onClick={() => setActiveEventId(ev.id)}
                className={`bg-white border rounded-xl p-5 cursor-pointer shadow-xs transition-colors flex flex-col justify-between group ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/15'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-md ${
                      ev.status === 'ONGOING'
                        ? 'clay-pill-green'
                        : ev.status === 'PREPARATION'
                        ? 'clay-pill-blue'
                        : 'clay-pill-amber'
                    }`}>
                      {ev.status}
                    </span>

                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 font-medium rounded-md bg-indigo-100 text-indigo-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 font-display group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {ev.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Metadata list */}
                  <div className="space-y-1.5 mt-3.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {formatIndonesianDate(ev.startDate)} - {formatIndonesianDate(ev.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Ketua: <strong className="font-medium text-slate-900">{manager?.name || 'Ketua Panitia'}</strong></span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Divisi</span>
                      <p className="text-sm font-semibold text-slate-900 font-display">{eventDivs.length}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Panitia</span>
                      <p className="text-sm font-semibold text-indigo-600 font-display">{eventMems.length}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Tugas</span>
                      <p className="text-sm font-semibold text-emerald-600 font-display">{eventTasks.length}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3.5">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="font-medium">Progres Event</span>
                      <span className="font-semibold text-indigo-600">{progress}%</span>
                    </div>
                    <ClayProgressBar progress={progress} size="sm" />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600">
                    {isActive ? 'Sedang Aktif' : 'Klik untuk Beralih →'}
                  </span>

                  {canManageEvents && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleEdit(ev, e)}
                        className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Edit Informasi Event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(ev.id, ev.name, e)}
                        className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors"
                        title="Hapus Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal create / edit */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};
