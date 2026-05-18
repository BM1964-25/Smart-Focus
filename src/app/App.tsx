import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Dashboard } from '../features/dashboard/Dashboard';
import { HelpView } from '../features/help/HelpView';
import { ImportExportView } from '../features/importExport/ImportExportView';
import { KanbanBoard } from '../features/kanban/KanbanBoard';
import { DailyPlanner } from '../features/planner/DailyPlanner';
import { PomodoroView } from '../features/pomodoro/PomodoroView';
import { ReportsView } from '../features/reports/ReportsView';
import { SettingsView } from '../features/settings/SettingsView';
import { useInitialData } from '../hooks/useInitialData';
import { useSettingsStore } from '../stores/settingsStore';

export type ViewKey = 'dashboard' | 'kanban' | 'pomodoro' | 'planner' | 'reports' | 'importExport' | 'settings' | 'help';

export const App = (): JSX.Element => {
  useInitialData();
  const [view, setView] = useState<ViewKey>('dashboard');
  const theme = useSettingsStore((state) => state.settings.theme);
  const shellClass = useMemo(() => (theme === 'dark' ? 'dark' : ''), [theme]);

  return (
    <div className={shellClass}>
      <AppShell
        activeView={view}
        showAiAssistant={view !== 'importExport' && view !== 'settings' && view !== 'help' && view !== 'pomodoro'}
        onNavigate={setView}
      >
        <main>
          {view === 'dashboard' && <Dashboard />}
          {view === 'kanban' && <KanbanBoard />}
          {view === 'pomodoro' && <PomodoroView />}
          {view === 'planner' && <DailyPlanner />}
          {view === 'reports' && <ReportsView />}
          {view === 'importExport' && <ImportExportView />}
          {view === 'settings' && <SettingsView />}
          {view === 'help' && <HelpView />}
        </main>
      </AppShell>
    </div>
  );
};
