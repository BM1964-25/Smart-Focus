import { describe, expect, it } from 'vitest';
import { createExport, importData, validateImport } from '../services/exportImportService';
import { seedProjects, seedTasks } from '../services/seed';
import type { AppExport } from '../types/domain';

describe('JSON export and import', () => {
  it('creates a versioned full export', async () => {
    const exported = await createExport();
    expect(exported.schemaVersion).toBe('1.0.0');
    expect(exported.app).toBe('Pomodoro Kanban Time Manager');
    expect(exported.projects).toEqual([]);
  });

  it('validates and imports project and task data', async () => {
    const payload: AppExport = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'Pomodoro Kanban Time Manager',
      projects: seedProjects,
      tasks: seedTasks,
      sessions: [],
      tags: [],
      settings: {
        schemaVersion: '1.0.0',
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakEvery: 4,
        notificationsEnabled: false,
        soundEnabled: false,
        theme: 'system',
        aiModel: 'claude-3-5-sonnet-latest'
      }
    };
    const preview = await validateImport(payload);
    expect(preview.valid).toBe(true);
    await importData(payload, 'projectsAndTasks');
    const exported = await createExport();
    expect(exported.tasks).toHaveLength(seedTasks.length);
  });

  it('rejects invalid schema versions', async () => {
    const preview = await validateImport({ schemaVersion: '0.0.1' });
    expect(preview.valid).toBe(false);
  });
});
