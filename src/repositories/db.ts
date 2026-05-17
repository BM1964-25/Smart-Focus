import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppSettings, PomodoroSession, Project, TaskCard } from '../types/domain';

const DB_NAME = 'pomodoro-kanban-time-manager';
const DB_VERSION = 1;

interface TimeManagerDb extends DBSchema {
  tasks: {
    key: string;
    value: TaskCard;
    indexes: { 'by-status': string; 'by-project': string };
  };
  projects: {
    key: string;
    value: Project;
  };
  sessions: {
    key: string;
    value: PomodoroSession;
    indexes: { 'by-task': string; 'by-start': string };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  backups: {
    key: string;
    value: { id: string; createdAt: string; payload: unknown };
  };
}

let dbPromise: Promise<IDBPDatabase<TimeManagerDb>> | undefined;

export const getDb = (): Promise<IDBPDatabase<TimeManagerDb>> => {
  dbPromise ??= openDB<TimeManagerDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('by-status', 'status');
      taskStore.createIndex('by-project', 'projectId');
      db.createObjectStore('projects', { keyPath: 'id' });
      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-task', 'taskId');
      sessionStore.createIndex('by-start', 'startTime');
      db.createObjectStore('settings', { keyPath: 'schemaVersion' });
      db.createObjectStore('backups', { keyPath: 'id' });
    }
  });
  return dbPromise;
};

export const resetDbConnectionForTests = (): void => {
  dbPromise = undefined;
};
