import { Button, Panel } from '../../components/ui';
import { useSettingsStore } from '../../stores/settingsStore';
import { ProjectManager } from './ProjectManager';
import { TagManager } from './TagManager';

export const SettingsView = (): JSX.Element => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Einstellungen</h1>
      <Panel>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm">Fokus-Minuten<input className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type="number" value={settings.focusMinutes} onChange={(event) => void updateSettings({ focusMinutes: Number(event.target.value) })} /></label>
          <label className="text-sm">Kurzpause<input className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type="number" value={settings.shortBreakMinutes} onChange={(event) => void updateSettings({ shortBreakMinutes: Number(event.target.value) })} /></label>
          <label className="text-sm">Langpause<input className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type="number" value={settings.longBreakMinutes} onChange={(event) => void updateSettings({ longBreakMinutes: Number(event.target.value) })} /></label>
          <label className="text-sm">Theme<select className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={settings.theme} onChange={(event) => void updateSettings({ theme: event.target.value as 'light' | 'dark' | 'system' })}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.notificationsEnabled} onChange={(event) => void updateSettings({ notificationsEnabled: event.target.checked })} /> Browser-Benachrichtigungen</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.soundEnabled} onChange={(event) => void updateSettings({ soundEnabled: event.target.checked })} /> Ton</label>
          <Button variant="secondary" onClick={() => void updateSettings({ aiModel: settings.aiModel })}>Speichern</Button>
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2"><ProjectManager /><TagManager /></div>
    </div>
  );
};
