const API_BASE_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};

// Users
const getUsers = async () => handleResponse(await fetch(`${API_BASE_URL}/users`));
const createUser = async (user: any) => handleResponse(await fetch(`${API_BASE_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) }));
const updateUser = async (id: string, user: any) => handleResponse(await fetch(`${API_BASE_URL}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) }));
const deleteUser = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' }));

// Events
const getEvents = async () => handleResponse(await fetch(`${API_BASE_URL}/events`));
const createEvent = async (event: any) => handleResponse(await fetch(`${API_BASE_URL}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) }));
const updateEvent = async (id: string, event: any) => handleResponse(await fetch(`${API_BASE_URL}/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) }));
const deleteEvent = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' }));

// Divisions
const getDivisions = async () => handleResponse(await fetch(`${API_BASE_URL}/divisions`));
const createDivision = async (division: any) => handleResponse(await fetch(`${API_BASE_URL}/divisions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(division) }));
const updateDivision = async (id: string, division: any) => handleResponse(await fetch(`${API_BASE_URL}/divisions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(division) }));
const deleteDivision = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/divisions/${id}`, { method: 'DELETE' }));

// Tasks
const getTasks = async () => handleResponse(await fetch(`${API_BASE_URL}/tasks`));
const createTask = async (task: any) => handleResponse(await fetch(`${API_BASE_URL}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) }));
const updateTask = async (id: string, task: any) => handleResponse(await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) }));
const deleteTask = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' }));

// Members
const getMembers = async () => handleResponse(await fetch(`${API_BASE_URL}/members`));
const createMember = async (member: any) => handleResponse(await fetch(`${API_BASE_URL}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(member) }));
const updateMember = async (id: string, member: any) => handleResponse(await fetch(`${API_BASE_URL}/members/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(member) }));
const deleteMember = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/members/${id}`, { method: 'DELETE' }));

// Task Updates
const getTaskUpdates = async () => handleResponse(await fetch(`${API_BASE_URL}/task-updates`));
const createTaskUpdate = async (taskId: string, progress: number, description: string, userId: string) => handleResponse(await fetch(`${API_BASE_URL}/task-updates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId, progress, description, userId }) }));

// Attachments
const getAttachments = async () => handleResponse(await fetch(`${API_BASE_URL}/attachments`));
const createAttachment = async (attachment: any) => handleResponse(await fetch(`${API_BASE_URL}/attachments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attachment) }));
const deleteAttachment = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/attachments/${id}`, { method: 'DELETE' }));

// Milestones
const getMilestones = async () => handleResponse(await fetch(`${API_BASE_URL}/milestones`));
const createMilestone = async (milestone: any) => handleResponse(await fetch(`${API_BASE_URL}/milestones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(milestone) }));
const updateMilestone = async (id: string, milestone: any) => handleResponse(await fetch(`${API_BASE_URL}/milestones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(milestone) }));
const deleteMilestone = async (id: string) => handleResponse(await fetch(`${API_BASE_URL}/milestones/${id}`, { method: 'DELETE' }));

// Activity Logs
const getActivityLogs = async () => handleResponse(await fetch(`${API_BASE_URL}/activity-logs`));
const createActivityLog = async (log: any) => handleResponse(await fetch(`${API_BASE_URL}/activity-logs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(log) }));

export const api = {
  getUsers, createUser, updateUser, deleteUser,
  getEvents, createEvent, updateEvent, deleteEvent,
  getDivisions, createDivision, updateDivision, deleteDivision,
  getTasks, createTask, updateTask, deleteTask,
  getMembers, createMember, updateMember, deleteMember,
  getTaskUpdates, createTaskUpdate,
  getAttachments, createAttachment, deleteAttachment,
  getMilestones, createMilestone, updateMilestone, deleteMilestone,
  getActivityLogs, createActivityLog
};
