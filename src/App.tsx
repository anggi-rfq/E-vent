import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { Task } from './types';
import { Sparkles, Calendar, Plus, Users, Shield, Layers } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, activeEvent, activeEventId, events } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  const handleSelectTask = (task: Task) => {
    setSelectedTaskForDetail(task);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EEFA] text-[#4A5568] font-sans selection:bg-[#7CA1FF] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
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

      {/* Footer */}
      <footer className="mt-auto border-t border-[#D1D9E6]/80 bg-[#F0F4FF]/80 backdrop-blur-md py-6 text-center text-xs text-[#4A5568] font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7CA1FF] animate-ping" />
            <span className="font-extrabold text-[#2D3748] font-display">E-vent</span>
            <span>— Sistem Manajemen Kepanitiaan Berbasis Claymorphism (Natural Tones)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUserSwitcherOpen(true)}
              className="text-[#7CA1FF] hover:text-[#5F8AE6] font-bold"
            >
              Simulasi Multi-Role (Ganti Akun)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data ke setelan demo awal?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-slate-400 hover:text-rose-500 font-semibold"
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

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={!!selectedTaskForDetail}
        onClose={() => setSelectedTaskForDetail(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
