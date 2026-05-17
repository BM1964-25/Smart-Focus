import type { AppSettings } from '../types/domain';
import { getDb } from './db';

export const defaultSettings: AppSettings = {
  schemaVersion: '1.0.0',
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
  notificationsEnabled: false,
  soundEnabled: false,
  theme: 'system',
  aiModel: 'claude-3-5-sonnet-latest'
};

export const settingsRepository = {
  async get(): Promise<AppSettings> {
    const db = await getDb();
    return (await db.get('settings', '1.0.0')) ?? defaultSettings;
  },
  async put(settings: AppSettings): Promise<void> {
    const db = await getDb();
    await db.put('settings', settings);
  }
};
