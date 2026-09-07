import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventManagerDashboard } from './EventManagerDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { MemberDashboard } from './MemberDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Task } from '../../types';
import { NavTab } from '../layout/Navbar';

interface DashboardViewProps {
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTask,
  onOpenCreateTask,
  onNavigateTab,
}) => {
  const { currentUser } = useApp();

  switch (currentUser.role) {
    case 'ADMIN':
      return (
        <AdminDashboard
          onNavigateToUsers={() => onNavigateTab('users')}
          onNavigateToEvents={() => onNavigateTab('timeline')}
        />
      );
    case 'COORDINATOR':
      return (
        <CoordinatorDashboard
          onSelectTask={onSelectTask}
          onOpenCreateTask={onOpenCreateTask}
          onNavigateToTasks={() => onNavigateTab('tasks')}
        />
      );
    case 'MEMBER':
      return (
        <MemberDashboard
          onSelectTask={onSelectTask}
          onNavigateToTasks={() => onNavigateTab('tasks')}
        />
      );
    case 'EVENT_MANAGER':
    default:
      return (
        <EventManagerDashboard
          onSelectTask={onSelectTask}
          onOpenCreateTask={onOpenCreateTask}
          onNavigateToTasks={() => onNavigateTab('tasks')}
          onNavigateToDivisions={() => onNavigateTab('divisions')}
        />
      );
  }
};
