import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ImportExportView } from '../features/importExport/ImportExportView';
import { KanbanBoard } from '../features/kanban/KanbanBoard';
import { DailyPlanner } from '../features/planner/DailyPlanner';
import { PomodoroTimer } from '../features/pomodoro/PomodoroTimer';
import { ReportsView } from '../features/reports/ReportsView';
import { SettingsView } from '../features/settings/SettingsView';
import { useInitialData } from '../hooks/useInitialData';
import { useSettingsStore } from '../stores/settingsStore';

export type ViewKey = 'dashboard' | 'kanban' | 'planner' | 'reports' | 'importExport' | 'settings';

export const App = (): JSX.Element => {
  useInitialData();
  const [view, setView] = useState<ViewKey>('dashboard');
  const theme = useSettingsStore((state) => state.settings.theme);
  const shellClass = useMemo(() => (theme === 'dark' ? 'dark' : ''), [theme]);
  const showPomodoroTimer = view === 'dashboard' || view === 'kanban' || view === 'planner';

  return (
    <div className={shellClass}>
      <AppShell activeView={view} showAiAssistant={view !== 'importExport' && view !== 'settings'} onNavigate={setView}>
        <div className={showPomodoroTimer ? 'grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]' : ''}>
          <main>
            {view === 'dashboard' && <Dashboard />}
            {view === 'kanban' && <KanbanBoard />}
            {view === 'planner' && <DailyPlanner />}
            {view === 'reports' && <ReportsView />}
            {view === 'importExport' && <ImportExportView />}
            {view === 'settings' && <SettingsView />}
          </main>
          {showPomodoroTimer && (
            <aside className="space-y-5">
              <PomodoroTimer />
            </aside>
          )}
        </div>
      </AppShell>
    </div>
  );
};
