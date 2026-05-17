import { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useSessionStore } from '../stores/sessionStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTaskStore } from '../stores/taskStore';

export const useInitialData = (): void => {
  const loadTasks = useTaskStore((state) => state.load);
  const loadProjects = useProjectStore((state) => state.load);
  const loadSessions = useSessionStore((state) => state.load);
  const loadSettings = useSettingsStore((state) => state.load);

  useEffect(() => {
    void Promise.all([loadTasks(), loadProjects(), loadSessions(), loadSettings()]);
  }, [loadProjects, loadSessions, loadSettings, loadTasks]);
};
