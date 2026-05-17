import { z } from 'zod';
import { priorities, sessionStatuses, sessionTypes, taskStatuses } from '../types/domain';

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  status: z.enum(taskStatuses),
  priority: z.enum(priorities),
  projectId: z.string().optional(),
  estimatedPomodoros: z.number().int().min(0),
  completedPomodoros: z.number().int().min(0),
  tags: z.array(z.string()),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archived: z.boolean()
});

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  client: z.string().default(''),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  archived: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const pomodoroSessionSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  projectId: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().min(0),
  plannedDurationMinutes: z.number().positive(),
  type: z.enum(sessionTypes),
  status: z.enum(sessionStatuses),
  interruptions: z.number().int().min(0),
  focusScore: z.number().min(1).max(5).optional(),
  notes: z.string()
});

export const settingsSchema = z.object({
  schemaVersion: z.string(),
  focusMinutes: z.number().int().min(1).max(180),
  shortBreakMinutes: z.number().int().min(1).max(60),
  longBreakMinutes: z.number().int().min(1).max(120),
  longBreakEvery: z.number().int().min(2).max(12),
  notificationsEnabled: z.boolean(),
  soundEnabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  aiModel: z.string().min(1)
});

export const appExportSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  exportedAt: z.string().datetime(),
  app: z.literal('Pomodoro Kanban Time Manager'),
  projects: z.array(projectSchema),
  tasks: z.array(taskSchema),
  sessions: z.array(pomodoroSessionSchema),
  tags: z.array(z.string()),
  settings: settingsSchema
});

export const aiTaskSuggestionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  estimatedPomodoros: z.number().int().min(1).max(24),
  priority: z.enum(priorities),
  projectId: z.string().optional(),
  tags: z.array(z.string())
});

export const aiSuggestionResponseSchema = z.object({
  kind: z.enum([
    'task_suggestions',
    'prioritization',
    'daily_plan',
    'weekly_review',
    'focus_recommendations',
    'project_summary'
  ]),
  summary: z.string(),
  tasks: z.array(aiTaskSuggestionSchema).optional(),
  markdown: z.string().optional(),
  warnings: z.array(z.string()).optional()
});

export type AppExportInput = z.infer<typeof appExportSchema>;
