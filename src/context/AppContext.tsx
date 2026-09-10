import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  UserRole, 
  Event, 
  Division, 
  EventMember, 
  Task, 
  TaskStatus, 
  TaskPriority, 
  TaskUpdate, 
  Attachment, 
  EventMilestone, 
  ActivityLog 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_DIVISIONS, 
  INITIAL_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_UPDATES, 
  INITIAL_ATTACHMENTS, 
  INITIAL_MILESTONES, 
  INITIAL_ACTIVITY_LOGS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (userId: string) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;

  activeEvent: Event | undefined;
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  divisions: Division[];
  addDivision: (division: Omit<Division, 'id' | 'createdAt'>) => void;
  updateDivision: (id: string, division: Partial<Division>) => void;
  deleteDivision: (id: string) => void;

  members: EventMember[];
  addMember: (member: Omit<EventMember, 'id' | 'joinedAt'>) => void;
  updateMember: (id: string, member: Partial<EventMember>) => void;
  removeMember: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, progress: number, note?: string) => void;
  deleteTask: (id: string) => void;

  taskUpdates: TaskUpdate[];
  addTaskUpdate: (taskId: string, progress: number, description: string) => void;

  attachments: Attachment[];
  addAttachment: (attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  deleteAttachment: (id: string) => void;

  milestones: EventMilestone[];
  toggleMilestone: (id: string) => void;
  addMilestone: (milestone: Omit<EventMilestone, 'id'>) => void;

  activityLogs: ActivityLog[];
  resetToDefaultData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'panitiahub_data_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with LocalStorage or Defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Prioritaskan session auth yang tersimpan
    const sessionStr = localStorage.getItem('panitiahub_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const found = users.find(u => u.id === session.userId);
        if (found) return found;
      } catch { /* ignore */ }
    }
    const savedId = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    const found = users.find(u => u.id === savedId);
    return found || users[1]; // Default to Event Manager (Andi)
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'active_event_id');
    return saved || (events[0]?.id ?? 'event-techfest-2026');
  });

  const [divisions, setDivisions] = useState<Division[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'divisions');
    return saved ? JSON.parse(saved) : INITIAL_DIVISIONS;
  });

  const [members, setMembers] = useState<EventMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [taskUpdates, setTaskUpdates] = useState<TaskUpdate[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  const [attachments, setAttachments] = useState<Attachment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'attachments');
    return saved ? JSON.parse(saved) : INITIAL_ATTACHMENTS;
  });

  const [milestones, setMilestones] = useState<EventMilestone[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'active_event_id', activeEventId);
  }, [activeEventId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'divisions', JSON.stringify(divisions));
  }, [divisions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'updates', JSON.stringify(taskUpdates));
  }, [taskUpdates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'attachments', JSON.stringify(attachments));
  }, [attachments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'activity', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  const logActivity = (action: string, targetName: string, targetType: ActivityLog['targetType']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEventId,
      userId: currentUser.id,
      action,
      targetName,
      targetType,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  };

  const switchUserRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role, updatedAt: new Date().toISOString() } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    logActivity('membuat event baru', newEvent.name, 'EVENT');
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
    logActivity('memperbarui informasi event', updates.name || 'Event', 'EVENT');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (activeEventId === id) {
      const remaining = events.filter(e => e.id !== id);
      if (remaining.length > 0) {
        setActiveEventId(remaining[0].id);
      }
    }
  };

  const addDivision = (divData: Omit<Division, 'id' | 'createdAt'>) => {
    const newDiv: Division = {
      ...divData,
      id: `div-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDivisions(prev => [...prev, newDiv]);
    logActivity('menambahkan divisi baru', newDiv.name, 'DIVISION');
  };

  const updateDivision = (id: string, updates: Partial<Division>) => {
    setDivisions(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    logActivity('memperbarui divisi', updates.name || 'Divisi', 'DIVISION');
  };

  const deleteDivision = (id: string) => {
    const divToDelete = divisions.find(d => d.id === id);
    setDivisions(prev => prev.filter(d => d.id !== id));
    if (divToDelete) {
      logActivity('menghapus divisi', divToDelete.name, 'DIVISION');
    }
  };

  const addMember = (memData: Omit<EventMember, 'id' | 'joinedAt'>) => {
    const newMember: EventMember = {
      ...memData,
      id: `mem-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
    const targetUser = users.find(u => u.id === memData.userId);
    logActivity('menambahkan panitia', targetUser?.name || 'Anggota', 'MEMBER');
  };

  const updateMember = (id: string, updates: Partial<EventMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('membuat tugas baru', newTask.title, 'TASK');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
        if (updates.status === 'COMPLETED' && t.status !== 'COMPLETED') {
          updated.progress = 100;
          triggerConfetti();
        }
        return updated;
      }
      return t;
    }));
    logActivity('memperbarui task', updates.title || 'Task', 'TASK');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowCompleted = status === 'COMPLETED';
        if (isNowCompleted) {
          triggerConfetti();
        }
        return {
          ...t,
          status,
          progress: isNowCompleted ? 100 : (t.progress === 100 ? 75 : t.progress),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
    const currentTask = tasks.find(t => t.id === id);
    logActivity(`mengubah status task ke ${status}`, currentTask?.title || 'Task', 'TASK');
  };

  const updateTaskProgress = (id: string, progress: number, note?: string) => {
    const normalized = Math.min(100, Math.max(0, progress));
    const newStatus: TaskStatus = normalized === 100 ? 'COMPLETED' : (normalized > 0 ? 'IN_PROGRESS' : 'TODO');
    
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (normalized === 100 && t.progress < 100) {
          triggerConfetti();
        }
        return {
          ...t,
          progress: normalized,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));

    if (note && note.trim()) {
      addTaskUpdate(id, normalized, note.trim());
    }
  };

  const deleteTask = (id: string) => {
    const t = tasks.find(item => item.id === id);
    setTasks(prev => prev.filter(item => item.id !== id));
    if (t) {
      logActivity('menghapus task', t.title, 'TASK');
    }
  };

  const addTaskUpdate = (taskId: string, progress: number, description: string) => {
    const newUpdate: TaskUpdate = {
      id: `upd-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      progress,
      description,
      createdAt: new Date().toISOString(),
    };
    setTaskUpdates(prev => [newUpdate, ...prev]);
    const targetTask = tasks.find(t => t.id === taskId);
    logActivity(`memperbarui progres ${progress}%: "${description.substring(0, 30)}..."`, targetTask?.title || 'Task', 'TASK');
  };

  const addAttachment = (attData: Omit<Attachment, 'id' | 'uploadedAt'>) => {
    const newAtt: Attachment = {
      ...attData,
      id: `att-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setAttachments(prev => [newAtt, ...prev]);
    logActivity('mengunggah lampiran file', newAtt.fileName, 'FILE');
  };

  const deleteAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.isCompleted;
        if (nextState) triggerConfetti();
        return { ...m, isCompleted: nextState };
      }
      return m;
    }));
  };

  const addMilestone = (milestoneData: Omit<EventMilestone, 'id'>) => {
    const newM: EventMilestone = {
      ...milestoneData,
      id: `ms-${Date.now()}`,
    };
    setMilestones(prev => [...prev, newM]);
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]); // Event manager
    setEvents(INITIAL_EVENTS);
    setActiveEventId(INITIAL_EVENTS[0].id);
    setDivisions(INITIAL_DIVISIONS);
    setMembers(INITIAL_MEMBERS);
    setTasks(INITIAL_TASKS);
    setTaskUpdates(INITIAL_UPDATES);
    setAttachments(INITIAL_ATTACHMENTS);
    setMilestones(INITIAL_MILESTONES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
    triggerConfetti();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        addUser,
        updateUserRole,
        deleteUser,

        activeEvent,
        activeEventId,
        setActiveEventId,
        events,
        addEvent,
        updateEvent,
        deleteEvent,

        divisions,
        addDivision,
        updateDivision,
        deleteDivision,

        members,
        addMember,
        updateMember,
        removeMember,

        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        updateTaskProgress,
        deleteTask,

        taskUpdates,
        addTaskUpdate,

        attachments,
        addAttachment,
        deleteAttachment,

        milestones,
        toggleMilestone,
        addMilestone,

        activityLogs,
        resetToDefaultData,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
