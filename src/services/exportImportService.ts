import { z } from 'zod';
import { appExportSchema } from '../schemas/domain';
import { getDb } from '../repositories/db';
import { projectRepository } from '../repositories/projectRepository';
import { sessionRepository } from '../repositories/sessionRepository';
import { settingsRepository } from '../repositories/settingsRepository';
import { taskRepository } from '../repositories/taskRepository';
import type { AppExport, ImportMode } from '../types/domain';
import { createId, nowIso } from '../utils/id';

export interface ImportPreview {
  valid: boolean;
  errors: string[];
  duplicateIds: string[];
  counts: {
    projects: number;
    tasks: number;
    sessions: number;
  };
  data?: AppExport;
}

export const createExport = async (): Promise<AppExport> => {
  const [projects, tasks, sessions, settings] = await Promise.all([
    projectRepository.all(),
    taskRepository.all(),
    sessionRepository.all(),
    settingsRepository.get()
  ]);
  return {
    schemaVersion: '1.0.0',
    exportedAt: nowIso(),
    app: 'Pomodoro Kanban Time Manager',
    projects,
    tasks,
    sessions,
    tags: [...new Set(tasks.flatMap((task) => task.tags))].sort(),
    settings
  };
};

export const createLocalBackup = async (): Promise<void> => {
  const db = await getDb();
  await db.put('backups', {
    id: createId('backup'),
    createdAt: nowIso(),
    payload: await createExport()
  });
};

export const validateImport = async (input: unknown): Promise<ImportPreview> => {
  const parsed = appExportSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      duplicateIds: [],
      counts: { projects: 0, tasks: 0, sessions: 0 }
    };
  }

  const current = await createExport();
  const currentIds = new Set([
    ...current.projects.map((project) => project.id),
    ...current.tasks.map((task) => task.id),
    ...current.sessions.map((session) => session.id)
  ]);
  const incomingIds = [
    ...parsed.data.projects.map((project) => project.id),
    ...parsed.data.tasks.map((task) => task.id),
    ...parsed.data.sessions.map((session) => session.id)
  ];
  const duplicateIds = incomingIds.filter((id) => currentIds.has(id));

  return {
    valid: true,
    errors: [],
    duplicateIds,
    counts: {
      projects: parsed.data.projects.length,
      tasks: parsed.data.tasks.length,
      sessions: parsed.data.sessions.length
    },
    data: parsed.data
  };
};

export const importData = async (data: AppExport, mode: ImportMode): Promise<void> => {
  const parsed = appExportSchema.parse(data);
  if (mode === 'replace') {
    await createLocalBackup();
    await Promise.all([projectRepository.clear(), taskRepository.clear(), sessionRepository.clear()]);
  }

  await projectRepository.bulkPut(parsed.projects);
  await taskRepository.bulkPut(parsed.tasks);
  if (mode !== 'projectsAndTasks') {
    await sessionRepository.bulkPut(parsed.sessions);
    await settingsRepository.put(parsed.settings);
  }
};

export const parseJsonImport = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new z.ZodError([{ code: 'custom', path: [], message: error.message }]);
    }
    throw error;
  }
};
