import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Navbar, NavTab } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { DivisionsView } from './components/divisions/DivisionsView';
import { EventsView } from './components/events/EventsView';
import { UsersView } from './components/users/UsersView';
import { ReportsAndFilesView } from './components/reports/ReportsAndFilesView';
import { QuickUserSwitcherModal } from './components/layout/QuickUserSwitcherModal';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { CreateEventModal } from './components/events/CreateEventModal';
import { Task } from './types';

const MainContent: React.FC = () => {
  const { currentUser, activeEvent, activeEventId, events } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  const handleSelectTask = (task: Task) => {
    setSelectedTaskForDetail(task);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Minimalist Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectTask={handleSelectTask}
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'tasks' && <TasksView />}

        {activeTab === 'divisions' && <DivisionsView />}

        {activeTab === 'timeline' && <EventsView />}

        {activeTab === 'reports' && <ReportsAndFilesView />}

        {activeTab === 'users' && <UsersView />}
      </main>

      {/* Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-900 font-display">E-vent</span>
            <span>— Sistem Manajemen Kepanitiaan Modern &amp; Minimalis</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUserSwitcherOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Simulasi Multi-Role (Ganti Akun)
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data ke setelan demo awal?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-slate-400 hover:text-rose-600 font-medium transition-colors"
            >
              Reset Data Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <QuickUserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={!!selectedTaskForDetail}
        onClose={() => setSelectedTaskForDetail(null)}
      />
    </div>
  );
};

/** Auth gate: tampilkan login/register jika belum autentikasi */
const AuthGate: React.FC = () => {
  const { isAuthenticated, isLoading, authPage } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl">E</span>
          </div>
          <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat sistem...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authPage === 'register' ? <RegisterPage /> : <LoginPage />;
  }

  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
