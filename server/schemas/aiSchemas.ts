import { z } from 'zod';

const prioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const aiRequestSchema = z.object({
  action: z.enum([
    'tasks_from_text',
    'prioritize_tasks',
    'estimate_pomodoros',
    'daily_plan',
    'weekly_review',
    'detect_time_wasters',
    'focus_recommendations',
    'improve_description',
    'split_task',
    'project_summary'
  ]),
  text: z.string().max(8000).optional(),
  tasks: z.array(z.unknown()).max(80).optional(),
  projects: z.array(z.unknown()).max(40).optional(),
  sessions: z.array(z.unknown()).max(200).optional()
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
  tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        estimatedPomodoros: z.number().int().min(1).max(24),
        priority: prioritySchema,
        projectId: z.string().optional(),
        tags: z.array(z.string())
      })
    )
    .optional(),
  markdown: z.string().optional(),
  warnings: z.array(z.string()).optional()
});

export type AiRequest = z.infer<typeof aiRequestSchema>;
export type AiSuggestionResponse = z.infer<typeof aiSuggestionResponseSchema>;
