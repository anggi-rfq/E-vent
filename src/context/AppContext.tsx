import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { api } from '../utils/api';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (userId: string) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
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
  // ─── State ────────────────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [members, setMembers] = useState<EventMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskUpdates, setTaskUpdates] = useState<TaskUpdate[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [milestones, setMilestones] = useState<EventMilestone[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const userStr = localStorage.getItem('panitiahub_user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (parsed && parsed.role) return parsed;
      }
    } catch { /* ignore */ }
    return INITIAL_USERS[0];
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'active_event_id');
    return saved || '';
  });

  // ─── Load data dari API saat pertama mount ────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadFromAPI = async () => {
      try {
        console.log('[AppContext] Memuat data dari API backend...');

        const [
          apiUsers,
          apiEvents,
          apiDivisions,
          apiMembers,
          apiTasks,
          apiTaskUpdates,
          apiAttachments,
          apiMilestones,
          apiActivityLogs,
        ] = await Promise.all([
          api.getUsers().catch(() => null),
          api.getEvents().catch(() => null),
          api.getDivisions().catch(() => null),
          api.getMembers().catch(() => null),
          api.getTasks().catch(() => null),
          api.getTaskUpdates().catch(() => null),
          api.getAttachments().catch(() => null),
          api.getMilestones().catch(() => null),
          api.getActivityLogs().catch(() => null),
        ]);

        if (cancelled) return;

        if (apiUsers !== null) {
          setUsers(apiUsers);
          console.log(`[AppContext] ✅ ${apiUsers.length} users dimuat dari DB`);

          // Sinkronisasi currentUser
          const savedUser = localStorage.getItem('panitiahub_user');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              const found = apiUsers.find(
                (u: User) => String(u.id) === String(parsed.id) ||
                             u.email?.toLowerCase() === parsed.email?.toLowerCase()
              );
              if (found && found.role) {
                setCurrentUser(found);
              }
            } catch { /* ignore */ }
          }
        } else {
          console.log('[AppContext] ⚠ Tidak ada users dari API, gunakan mock data');
          setUsers(INITIAL_USERS);
        }

        if (apiEvents !== null) {
          setEvents(apiEvents);
          if (!activeEventId || activeEventId === '' || !apiEvents.some((e: Event) => String(e.id) === String(activeEventId))) {
            setActiveEventId(apiEvents.length > 0 ? apiEvents[0].id : '');
          }
          console.log(`[AppContext] ✅ ${apiEvents.length} events dimuat dari DB`);
        } else {
          setEvents(INITIAL_EVENTS);
          if (!activeEventId) setActiveEventId(INITIAL_EVENTS[0]?.id || '');
        }

        if (apiDivisions !== null) {
          setDivisions(apiDivisions);
          console.log(`[AppContext] ✅ ${apiDivisions.length} divisions dimuat dari DB`);
        } else {
          setDivisions(INITIAL_DIVISIONS);
        }

        if (apiMembers !== null) {
          setMembers(apiMembers);
        } else {
          setMembers(INITIAL_MEMBERS);
        }

        if (apiTasks !== null) {
          setTasks(apiTasks);
          console.log(`[AppContext] ✅ ${apiTasks.length} tasks dimuat dari DB`);
        } else {
          setTasks(INITIAL_TASKS);
        }

        if (apiTaskUpdates !== null) {
          setTaskUpdates(apiTaskUpdates);
        } else {
          setTaskUpdates(INITIAL_UPDATES);
        }

        if (apiAttachments !== null) {
          setAttachments(apiAttachments);
        } else {
          setAttachments(INITIAL_ATTACHMENTS);
        }

        if (apiMilestones !== null) {
          setMilestones(apiMilestones);
        } else {
          setMilestones(INITIAL_MILESTONES);
        }

        if (apiActivityLogs !== null) {
          setActivityLogs(apiActivityLogs);
        } else {
          setActivityLogs(INITIAL_ACTIVITY_LOGS);
        }

        setDataLoaded(true);
        console.log('[AppContext] ✅ Semua data berhasil dimuat dari API');
      } catch (error) {
        console.error('[AppContext] ❌ Gagal memuat data dari API, fallback ke mock data:', error);
        setUsers(INITIAL_USERS);
        setEvents(INITIAL_EVENTS);
        setDivisions(INITIAL_DIVISIONS);
        setMembers(INITIAL_MEMBERS);
        setTasks(INITIAL_TASKS);
        setTaskUpdates(INITIAL_UPDATES);
        setAttachments(INITIAL_ATTACHMENTS);
        setMilestones(INITIAL_MILESTONES);
        setActivityLogs(INITIAL_ACTIVITY_LOGS);
        setDataLoaded(true);
      }
    };

    loadFromAPI();
    return () => { cancelled = true; };
  }, []);

  // ─── Persist active event id ──────────────────────────────────────
  useEffect(() => {
    if (activeEventId) {
      localStorage.setItem(STORAGE_PREFIX + 'active_event_id', activeEventId);
    }
  }, [activeEventId]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUser.id);
    }
  }, [currentUser]);

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  // ─── Helpers ──────────────────────────────────────────────────────
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch { /* ignore */ }
  }, []);

  const logActivity = useCallback((action: string, targetName: string, targetType: ActivityLog['targetType']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEventId,
      userId: currentUser?.id || '',
      action,
      targetName,
      targetType,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // Fire-and-forget ke API
    api.createActivityLog({
      userId: currentUser?.id,
      eventId: activeEventId,
      action,
      description: `${action}: ${targetName}`,
    }).catch(() => { /* ignore */ });
  }, [activeEventId, currentUser?.id]);

  // ─── User mutations ────────────────────────────────────────────────
  const switchUserRole = useCallback((userId: string) => {
    const user = users.find(u => String(u.id) === String(userId));
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('panitiahub_user', JSON.stringify(user));
    }
  }, [users]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    // Optimistic update dulu
    const tempId = `user-temp-${Date.now()}`;
    const tempUser: User = { ...userData, id: tempId, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, tempUser]);

    // Kirim ke API
    api.createUser({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      department: userData.department,
      avatar: userData.avatar,
    }).then(apiUser => {
      console.log('[AppContext] ✅ User dibuat di database:', apiUser);
      // Ganti temp id dengan id asli dari database
      setUsers(prev => prev.map(u => u.id === tempId ? { ...u, ...apiUser } : u));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat user di DB:', err);
      // Rollback: hapus user temporary
      setUsers(prev => prev.filter(u => u.id !== tempId));
      alert(`Gagal membuat user: ${err.message}`);
    });
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u));

    if (String(currentUser?.id) === String(userId)) {
      setCurrentUser(prev => {
        const updated = { ...prev, ...updates };
        localStorage.setItem('panitiahub_user', JSON.stringify(updated));
        return updated;
      });
    }

    api.updateUser(String(userId), updates).catch(err => {
      console.error('[AppContext] ❌ Gagal update user di DB:', err);
    });
  }, [currentUser?.id]);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, role, updatedAt: new Date().toISOString() } : u));

    if (String(currentUser?.id) === String(userId)) {
      setCurrentUser(prev => {
        const updated = { ...prev, role };
        localStorage.setItem('panitiahub_user', JSON.stringify(updated));
        return updated;
      });
    }

    // Kirim ke API
    const user = users.find(u => String(u.id) === String(userId));
    if (user) {
      api.updateUser(String(userId), { ...user, role }).catch(err => {
        console.error('[AppContext] ❌ Gagal update role user di DB:', err);
      });
    }
  }, [users, currentUser?.id]);

  const deleteUser = useCallback((userId: string) => {
    const deletedUser = users.find(u => String(u.id) === String(userId));
    setUsers(prev => prev.filter(u => String(u.id) !== String(userId)));

    api.deleteUser(String(userId)).then(() => {
      console.log('[AppContext] ✅ User dihapus dari database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus user dari DB:', err);
      // Rollback
      if (deletedUser) {
        setUsers(prev => [...prev, deletedUser]);
      }
    });
  }, [users]);

  // ─── Event mutations ───────────────────────────────────────────────
  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const tempId = `event-temp-${Date.now()}`;
    const tempEvent: Event = { ...eventData, id: tempId, createdAt: new Date().toISOString() };
    setEvents(prev => [tempEvent, ...prev]);
    setActiveEventId(tempId);

    api.createEvent(eventData).then(apiEvent => {
      console.log('[AppContext] ✅ Event dibuat di database:', apiEvent.name);
      setEvents(prev => prev.map(e => e.id === tempId ? { ...e, ...apiEvent } : e));
      setActiveEventId(apiEvent.id);
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat event di DB:', err);
      setEvents(prev => prev.filter(e => e.id !== tempId));
      alert(`Gagal membuat event: ${err.message}`);
    });

    logActivity('membuat event baru', eventData.name, 'EVENT');
  }, [logActivity]);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));

    api.updateEvent(String(id), updates).then(() => {
      console.log('[AppContext] ✅ Event diperbarui di database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal update event di DB:', err);
    });

    logActivity('memperbarui informasi event', updates.name || 'Event', 'EVENT');
  }, [logActivity]);

  const deleteEvent = useCallback((id: string) => {
    const deletedEvent = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (activeEventId === id) {
      const remaining = events.filter(e => e.id !== id);
      if (remaining.length > 0) setActiveEventId(remaining[0].id);
    }

    api.deleteEvent(String(id)).then(() => {
      console.log('[AppContext] ✅ Event dihapus dari database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus event dari DB:', err);
      if (deletedEvent) setEvents(prev => [...prev, deletedEvent]);
    });
  }, [events, activeEventId, logActivity]);

  // ─── Division mutations ───────────────────────────────────────────
  const addDivision = useCallback((divData: Omit<Division, 'id' | 'createdAt'>) => {
    const tempId = `div-temp-${Date.now()}`;
    const tempDiv: Division = { ...divData, id: tempId, createdAt: new Date().toISOString() };
    setDivisions(prev => [...prev, tempDiv]);

    api.createDivision(divData).then(apiDiv => {
      console.log('[AppContext] ✅ Division dibuat di database:', apiDiv.name);
      setDivisions(prev => prev.map(d => d.id === tempId ? { ...d, ...apiDiv } : d));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat division di DB:', err);
      setDivisions(prev => prev.filter(d => d.id !== tempId));
      alert(`Gagal membuat divisi: ${err.message}`);
    });

    logActivity('menambahkan divisi baru', divData.name, 'DIVISION');
  }, [logActivity]);

  const updateDivision = useCallback((id: string, updates: Partial<Division>) => {
    setDivisions(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));

    api.updateDivision(String(id), updates).then(() => {
      console.log('[AppContext] ✅ Division diperbarui di database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal update division di DB:', err);
    });

    logActivity('memperbarui divisi', updates.name || 'Divisi', 'DIVISION');
  }, [logActivity]);

  const deleteDivision = useCallback((id: string) => {
    const divToDelete = divisions.find(d => d.id === id);
    setDivisions(prev => prev.filter(d => d.id !== id));

    api.deleteDivision(String(id)).then(() => {
      console.log('[AppContext] ✅ Division dihapus dari database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus division dari DB:', err);
      if (divToDelete) setDivisions(prev => [...prev, divToDelete]);
    });

    if (divToDelete) logActivity('menghapus divisi', divToDelete.name, 'DIVISION');
  }, [divisions, logActivity]);

  // ─── Member mutations ─────────────────────────────────────────────
  const addMember = useCallback((memData: Omit<EventMember, 'id' | 'joinedAt'>) => {
    const tempId = `mem-temp-${Date.now()}`;
    const tempMember: EventMember = { ...memData, id: tempId, joinedAt: new Date().toISOString() };
    setMembers(prev => [...prev, tempMember]);

    api.createMember(memData).then(apiMem => {
      setMembers(prev => prev.map(m => m.id === tempId ? { ...m, ...apiMem } : m));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal menambahkan member di DB:', err);
      setMembers(prev => prev.filter(m => m.id !== tempId));
    });

    const targetUser = users.find(u => u.id === memData.userId);
    logActivity('menambahkan panitia', targetUser?.name || 'Anggota', 'MEMBER');
  }, [users, logActivity]);

  const updateMember = useCallback((id: string, updates: Partial<EventMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    api.deleteMember(String(id)).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus member dari DB:', err);
    });
  }, []);

  // ─── Task mutations ───────────────────────────────────────────────
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `task-temp-${Date.now()}`;
    const tempTask: Task = { ...taskData, id: tempId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTasks(prev => [tempTask, ...prev]);

    api.createTask(taskData).then(apiTask => {
      console.log('[AppContext] ✅ Task dibuat di database:', apiTask.title);
      setTasks(prev => prev.map(t => t.id === tempId ? { ...t, ...apiTask } : t));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat task di DB:', err);
      setTasks(prev => prev.filter(t => t.id !== tempId));
      alert(`Gagal membuat task: ${err.message}`);
    });

    logActivity('membuat tugas baru', taskData.title, 'TASK');
  }, [logActivity]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
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

    api.updateTask(String(id), updates).then(() => {
      console.log('[AppContext] ✅ Task diperbarui di database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal update task di DB:', err);
    });

    logActivity('memperbarui task', updates.title || 'Task', 'TASK');
  }, [triggerConfetti, logActivity]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowCompleted = status === 'COMPLETED';
        if (isNowCompleted) triggerConfetti();
        return {
          ...t,
          status,
          progress: isNowCompleted ? 100 : (t.progress === 100 ? 75 : t.progress),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));

    api.updateTask(String(id), { status }).catch(err => {
      console.error('[AppContext] ❌ Gagal update status task di DB:', err);
    });
  }, [triggerConfetti]);

  const updateTaskProgress = useCallback((id: string, progress: number, note?: string) => {
    const normalized = Math.min(100, Math.max(0, progress));
    const newStatus: TaskStatus = normalized === 100 ? 'COMPLETED' : (normalized > 0 ? 'IN_PROGRESS' : 'TODO');
    
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (normalized === 100 && t.progress < 100) triggerConfetti();
        return { ...t, progress: normalized, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    }));

    api.updateTask(String(id), { progress: normalized, status: newStatus }).catch(err => {
      console.error('[AppContext] ❌ Gagal update progress task di DB:', err);
    });

    if (note && note.trim()) {
      addTaskUpdate(id, normalized, note.trim());
    }
  }, [triggerConfetti]);

  const deleteTask = useCallback((id: string) => {
    const t = tasks.find(item => item.id === id);
    setTasks(prev => prev.filter(item => item.id !== id));

    api.deleteTask(String(id)).then(() => {
      console.log('[AppContext] ✅ Task dihapus dari database');
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus task dari DB:', err);
      if (t) setTasks(prev => [...prev, t]);
    });

    if (t) logActivity('menghapus task', t.title, 'TASK');
  }, [tasks, logActivity]);

  // ─── Task Update mutations ────────────────────────────────────────
  const addTaskUpdate = useCallback((taskId: string, progress: number, description: string) => {
    const tempId = `upd-${Date.now()}`;
    const newUpdate: TaskUpdate = {
      id: tempId,
      taskId,
      userId: currentUser?.id || '',
      progress,
      description,
      createdAt: new Date().toISOString(),
    };
    setTaskUpdates(prev => [newUpdate, ...prev]);

    api.createTaskUpdate(taskId, progress, description, currentUser?.id).then(apiUpdate => {
      setTaskUpdates(prev => prev.map(u => u.id === tempId ? { ...u, ...apiUpdate } : u));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat task update di DB:', err);
    });
  }, [currentUser?.id]);

  // ─── Attachment mutations ─────────────────────────────────────────
  const addAttachment = useCallback((attData: Omit<Attachment, 'id' | 'uploadedAt'>) => {
    const tempId = `att-${Date.now()}`;
    const newAtt: Attachment = { ...attData, id: tempId, uploadedAt: new Date().toISOString() };
    setAttachments(prev => [newAtt, ...prev]);

    api.createAttachment(attData).then(apiAtt => {
      setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, ...apiAtt } : a));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat attachment di DB:', err);
      setAttachments(prev => prev.filter(a => a.id !== tempId));
    });

    logActivity('mengunggah lampiran file', attData.fileName, 'FILE');
  }, [logActivity]);

  const deleteAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    api.deleteAttachment(String(id)).catch(err => {
      console.error('[AppContext] ❌ Gagal menghapus attachment dari DB:', err);
    });
  }, []);

  // ─── Milestone mutations ──────────────────────────────────────────
  const toggleMilestone = useCallback((id: string) => {
    let newState = false;
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        newState = !m.isCompleted;
        if (newState) triggerConfetti();
        return { ...m, isCompleted: newState };
      }
      return m;
    }));

    api.updateMilestone(String(id), { isCompleted: newState }).catch(err => {
      console.error('[AppContext] ❌ Gagal toggle milestone di DB:', err);
    });
  }, [triggerConfetti]);

  const addMilestone = useCallback((milestoneData: Omit<EventMilestone, 'id'>) => {
    const tempId = `ms-${Date.now()}`;
    const newM: EventMilestone = { ...milestoneData, id: tempId };
    setMilestones(prev => [...prev, newM]);

    api.createMilestone(milestoneData).then(apiM => {
      setMilestones(prev => prev.map(m => m.id === tempId ? { ...m, ...apiM } : m));
    }).catch(err => {
      console.error('[AppContext] ❌ Gagal membuat milestone di DB:', err);
      setMilestones(prev => prev.filter(m => m.id !== tempId));
    });
  }, []);

  // ─── Reset ────────────────────────────────────────────────────────
  const resetToDefaultData = useCallback(() => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
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
  }, [triggerConfetti]);

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        addUser,
        updateUser,
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
