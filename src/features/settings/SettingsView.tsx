import { Bell, Bot, Database, KeyRound, Save, Timer, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { useSettingsStore } from '../../stores/settingsStore';
import { ProjectManager } from './ProjectManager';
import { TagManager } from './TagManager';

export const SettingsView = (): JSX.Element => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [aiConfigured, setAiConfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAiStatus = async (): Promise<void> => {
      try {
        const response = await fetch('/api/health');
        const payload = (await response.json()) as { aiConfigured?: boolean };
        if (!cancelled) setAiConfigured(Boolean(payload.aiConfigured));
      } catch {
        if (!cancelled) setAiConfigured(false);
      }
    };
    void checkAiStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  const licenseStatus = settings.licenseKey ? 'Aktiviert' : 'Nicht aktiviert';
  const aiStatus = aiConfigured ? 'KI verfügbar' : 'KI nicht eingerichtet';

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Einstellungen</h1>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-accent" />
            <h2 className="font-semibold">Lizenzstatus</h2>
          </div>
          <p className="mt-3 text-2xl font-semibold">{licenseStatus}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {settings.licenseKey ? 'Ein Lizenzschlüssel ist lokal hinterlegt.' : 'Es ist noch kein Lizenzschlüssel hinterlegt.'}
          </p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-accent" />
            <h2 className="font-semibold">KI-Status</h2>
          </div>
          <p className="mt-3 text-2xl font-semibold">{aiStatus}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {aiConfigured ? 'KI-Funktionen können Vorschläge erzeugen.' : 'KI-Funktionen werden vom Anbieter oder Administrator freigeschaltet.'}
          </p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-accent" />
            <h2 className="font-semibold">Datensicherung</h2>
          </div>
          <p className="mt-3 text-2xl font-semibold">Lokal</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Daten liegen im Browser. Nutze regelmäßig den JSON-Export als Sicherung.
          </p>
        </Panel>
      </div>
      <Panel>
        <div className="mb-3 flex items-center gap-2">
          <Timer size={18} className="text-accent" />
          <h2 className="font-semibold">Pomodoro und Darstellung</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm">
            Fokus-Minuten
            <input
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              type="number"
              value={settings.focusMinutes}
              onChange={(event) => void updateSettings({ focusMinutes: Number(event.target.value) })}
            />
          </label>
          <label className="text-sm">
            Kurzpause
            <input
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              type="number"
              value={settings.shortBreakMinutes}
              onChange={(event) => void updateSettings({ shortBreakMinutes: Number(event.target.value) })}
            />
          </label>
          <label className="text-sm">
            Langpause
            <input
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              type="number"
              value={settings.longBreakMinutes}
              onChange={(event) => void updateSettings({ longBreakMinutes: Number(event.target.value) })}
            />
          </label>
          <label className="text-sm">
            Theme
            <select
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={settings.theme}
              onChange={(event) =>
                void updateSettings({ theme: event.target.value as 'light' | 'dark' | 'system' })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(event) => void updateSettings({ notificationsEnabled: event.target.checked })}
            />{' '}
            <Bell size={15} /> Browser-Benachrichtigungen
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(event) => void updateSettings({ soundEnabled: event.target.checked })}
            />{' '}
            <Volume2 size={15} /> Ton
          </label>
        </div>
      </Panel>
      <Panel>
        <div className="mb-3 flex items-center gap-2">
          <KeyRound size={18} className="text-accent" />
          <h2 className="font-semibold">Lizenz</h2>
        </div>
        <label className="text-sm">
          Lizenzschlüssel
          <input
            className="mt-1 w-full rounded-md border border-line px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="SMART-FOCUS-..."
            type="password"
            value={settings.licenseKey}
            onChange={(event) => void updateSettings({ licenseKey: event.target.value.trim() })}
          />
        </label>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Der Lizenzschlüssel wird lokal im Browser gespeichert. Eine Online-Prüfung ist in dieser Version
          noch nicht aktiviert.
        </p>
        <Button className="mt-3" variant="secondary" onClick={() => void updateSettings({ licenseKey: settings.licenseKey })}>
          <Save size={16} className="mr-2 inline" /> Speichern
        </Button>
      </Panel>
      <Panel>
        <div className="mb-3 flex items-center gap-2">
          <Bot size={18} className="text-accent" />
          <h2 className="font-semibold">KI-Funktionen</h2>
        </div>
        <div className="grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2">
          <p>Die KI kann Kanban-Karten aus Freitext erstellen und Aufgaben priorisieren.</p>
          <p>In der Tagesplanung schlägt sie Reihenfolge und Fokusaufgaben vor.</p>
          <p>In Reports formuliert sie Rückblicke, erkennt Zeitfresser und fasst Projekte zusammen.</p>
          <p>Vorschläge werden immer als Vorschau angezeigt und erst nach Bestätigung übernommen.</p>
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2">
        <ProjectManager />
        <TagManager />
      </div>
    </div>
  );
};
