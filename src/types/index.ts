export type UserRole = 'ADMIN' | 'EVENT_MANAGER' | 'COORDINATOR' | 'MEMBER';

export type EventStatus = 'PLANNING' | 'PREPARATION' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';

export type DeadlineCondition = 'NORMAL' | 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  managerId: string;
  bannerColor?: string;
  icon?: string;
  targetAttendees?: number;
  budgetTotal?: number;
  budgetSpent?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Division {
  id: string;
  eventId: string;
  name: string;
  description: string;
  coordinatorId: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventMember {
  id: string;
  eventId: string;
  userId: string;
  divisionId: string;
  position: string;
  joinedAt: string;
}

export interface Task {
  id: string;
  eventId: string;
  divisionId: string;
  title: string;
  description: string;
  assignedTo: string; // userId
  createdBy: string; // userId
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string; // ISO date YYYY-MM-DD
  progress: number; // 0 - 100
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  userId: string;
  progress: number;
  description: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in KB or bytes
  uploadedAt: string;
}

export interface EventMilestone {
  id: string;
  eventId: string;
  month: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
  category: 'PLANNING' | 'PREPARATION' | 'EXECUTION' | 'EVALUATION';
}

export interface ActivityLog {
  id: string;
  eventId: string;
  userId: string;
  action: string;
  targetName: string;
  targetType: 'TASK' | 'DIVISION' | 'MEMBER' | 'EVENT' | 'FILE';
  timestamp: string;
}
