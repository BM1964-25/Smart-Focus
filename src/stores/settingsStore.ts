import { create } from 'zustand';
import { defaultSettings, settingsRepository } from '../repositories/settingsRepository';
import type { AppSettings } from '../types/domain';

interface SettingsState {
  settings: AppSettings;
  load: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  async load() {
    set({ settings: await settingsRepository.get() });
  },
  async updateSettings(partial) {
    const next = { ...get().settings, ...partial };
    await settingsRepository.put(next);
    set({ settings: next });
  }
}));
