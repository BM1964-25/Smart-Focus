export const taskStatuses = ['inbox', 'today', 'focus', 'inProgress', 'waiting', 'done'] as const;
export const priorities = ['low', 'medium', 'high', 'urgent'] as const;
export const sessionTypes = ['focus', 'shortBreak', 'longBreak'] as const;
export const sessionStatuses = ['running', 'paused', 'completed', 'cancelled'] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type Priority = (typeof priorities)[number];
export type PomodoroSessionType = (typeof sessionTypes)[number];
export type PomodoroSessionStatus = (typeof sessionStatuses)[number];

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  projectId?: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  plannedDurationMinutes: number;
  type: PomodoroSessionType;
  status: PomodoroSessionStatus;
  interruptions: number;
  focusScore?: number;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  schemaVersion: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  aiModel: string;
}

export interface AppExport {
  schemaVersion: string;
  exportedAt: string;
  app: 'Pomodoro Kanban Time Manager';
  projects: Project[];
  tasks: TaskCard[];
  sessions: PomodoroSession[];
  tags: string[];
  settings: AppSettings;
}

export type ImportMode = 'append' | 'replace' | 'projectsAndTasks';

export interface AiTaskSuggestion {
  title: string;
  description?: string;
  estimatedPomodoros: number;
  priority: Priority;
  projectId?: string;
  tags: string[];
}

export interface AiSuggestionResponse {
  kind:
    | 'task_suggestions'
    | 'prioritization'
    | 'daily_plan'
    | 'weekly_review'
    | 'focus_recommendations'
    | 'project_summary';
  summary: string;
  tasks?: AiTaskSuggestion[];
  markdown?: string;
  warnings?: string[];
}
