import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityFeed } from './ActivityFeed';
import { 
  Shield, 
  Users, 
  Calendar, 
  CheckSquare, 
  FileText, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToUsers: () => void;
  onNavigateToEvents: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToUsers,
  onNavigateToEvents,
}) => {
  const { users, events, tasks, attachments, activityLogs } = useApp();

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const managerCount = users.filter((u) => u.role === 'EVENT_MANAGER').length;
  const coordCount = users.filter((u) => u.role === 'COORDINATOR').length;
  const memberCount = users.filter((u) => u.role === 'MEMBER').length;

  return (
    <div className="space-y-6">
      {/* Admin Greeting Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Admin Console
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-display">
              Panel Kendali Sistem & Master Data
            </h2>
          </div>
        </div>

        <button
          onClick={onNavigateToUsers}
          className="clay-btn-primary px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna ({users.length})</span>
        </button>
      </div>

      {/* Global Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={onNavigateToUsers}
          className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-colors group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Akun</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{users.length}</h3>
            <p className="text-xs font-medium text-purple-600 mt-1 flex items-center gap-1">
              <span>{adminCount} Admin, {managerCount} Ketua</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Total Events */}
        <div
          onClick={onNavigateToEvents}
          className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-colors group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Event</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{events.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Event terdaftar
            </p>
          </div>
        </div>

        {/* Global Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Semua Tugas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{tasks.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {tasks.filter((t) => t.status === 'COMPLETED').length} tugas tuntas
            </p>
          </div>
        </div>

        {/* Attachments Stored */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Berkas Terunggah</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">{attachments.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Dokumen & lampiran
            </p>
          </div>
        </div>
      </div>

      {/* Role Distribution & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Role Distribution Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm font-display">Distribusi Hak Akses</h3>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-xs font-medium text-slate-800">Administrator</span>
                </div>
                <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {adminCount} Akun
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-medium text-slate-800">Event Manager</span>
                </div>
                <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  {managerCount} Akun
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-medium text-slate-800">Koordinator Divisi</span>
                </div>
                <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {coordCount} Akun
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-800">Anggota Panitia</span>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {memberCount} Akun
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToUsers}
              className="w-full py-2 rounded-lg clay-btn-secondary text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Kelola Pengguna</span>
            </button>
          </div>
        </div>

        {/* Global Activity Feed (2 cols) */}
        <div className="lg:col-span-2">
          <ActivityFeed logs={activityLogs} users={users} />
        </div>
      </div>
    </div>
  );
};
