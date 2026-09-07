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
      <div className="clay-card p-6 bg-gradient-to-r from-[#F0F4FF] via-[#E9F0FD] to-[#E6EEFA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] block mb-1">
              Admin Console
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] font-display">
              Panel Kendali Sistem & Master Data
            </h2>
          </div>
        </div>

        <button
          onClick={onNavigateToUsers}
          className="clay-btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna ({users.length})</span>
        </button>
      </div>

      {/* Global Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Users */}
        <div
          onClick={onNavigateToUsers}
          className="clay-card p-5 cursor-pointer clay-card-hover group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total Akun</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{users.length}</h3>
            <p className="text-xs font-semibold text-[#6D28D9] mt-1 flex items-center gap-1">
              <span>{adminCount} Admin, {managerCount} Ketua</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Total Events */}
        <div
          onClick={onNavigateToEvents}
          className="clay-card p-5 cursor-pointer clay-card-hover group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total Event</span>
            <div className="w-9 h-9 rounded-2xl bg-[#DCE8FE] text-[#1E40AF] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{events.length}</h3>
            <p className="text-xs font-semibold text-[#1E40AF] mt-1">
              Event terdaftar
            </p>
          </div>
        </div>

        {/* Global Tasks */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Semua Tugas</span>
            <div className="w-9 h-9 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center shadow-inner">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] font-display">{tasks.length}</h3>
            <p className="text-xs font-semibold text-[#4A5568] mt-1">
              {tasks.filter((t) => t.status === 'COMPLETED').length} tugas tuntas
            </p>
          </div>
        </div>

        {/* Attachments Stored */}
        <div className="clay-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Berkas Terunggah</span>
            <div className="w-9 h-9 rounded-2xl bg-[#D5F5E3] text-[#065F46] flex items-center justify-center shadow-inner">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#065F46] font-display">{attachments.length}</h3>
            <p className="text-xs font-semibold text-[#065F46] mt-1">
              Dokumen & lampiran
            </p>
          </div>
        </div>
      </div>

      {/* Role Distribution & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Role Distribution Card */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#DDD6FE] text-[#6D28D9] flex items-center justify-center shadow-inner">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[#2D3748] text-base font-display">Distribusi Hak Akses</h3>
            </div>

            <div className="space-y-2.5">
              <div className="clay-card-flat p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6D28D9]" />
                  <span className="text-xs font-bold text-[#2D3748]">Administrator</span>
                </div>
                <span className="text-xs font-extrabold text-[#6D28D9] bg-[#DDD6FE] px-2 py-0.5 rounded-full">
                  {adminCount} Akun
                </span>
              </div>

              <div className="clay-card-flat p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-[#2D3748]">Event Manager</span>
                </div>
                <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  {managerCount} Akun
                </span>
              </div>

              <div className="clay-card-flat p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7CA1FF]" />
                  <span className="text-xs font-bold text-[#2D3748]">Koordinator Divisi</span>
                </div>
                <span className="text-xs font-extrabold text-[#1E40AF] bg-[#DCE8FE] px-2 py-0.5 rounded-full">
                  {coordCount} Akun
                </span>
              </div>

              <div className="clay-card-flat p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#065F46]" />
                  <span className="text-xs font-bold text-[#2D3748]">Anggota Panitia</span>
                </div>
                <span className="text-xs font-extrabold text-[#065F46] bg-[#D5F5E3] px-2 py-0.5 rounded-full">
                  {memberCount} Akun
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#D1D9E6]/60">
            <button
              onClick={onNavigateToUsers}
              className="w-full py-2 rounded-xl clay-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#6D28D9]" />
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
