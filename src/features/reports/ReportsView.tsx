import { BarChart3, Clock3, Download, FolderKanban, ListChecks } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { calculateDashboardStats, sessionsToCsv } from '../../services/reportingService';
import { useProjectStore } from '../../stores/projectStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useTaskStore } from '../../stores/taskStore';

const downloadText = (name: string, content: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

type ReportRange = 'today' | 'thisWeek' | 'lastWeek' | 'month' | 'custom' | 'all';

const startOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const getMonday = (date: Date): Date => {
  const next = startOfDay(date);
  next.setDate(next.getDate() - ((next.getDay() + 6) % 7));
  return next;
};

export const ReportsView = (): JSX.Element => {
  const sessions = useSessionStore((state) => state.sessions);
  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const [range, setRange] = useState<ReportRange>('thisWeek');
  const [customStart, setCustomStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [customEnd, setCustomEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const reportRange = useMemo(() => {
    const today = startOfDay(new Date());
    if (range === 'all') return undefined;
    if (range === 'today') return { start: today, end: endOfDay(today) };
    if (range === 'thisWeek') {
      const start = getMonday(today);
      return { start, end: endOfDay(new Date()) };
    }
    if (range === 'lastWeek') {
      const start = getMonday(today);
      start.setDate(start.getDate() - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end: endOfDay(end) };
    }
    if (range === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start, end: endOfDay(new Date()) };
    }
    return {
      start: startOfDay(new Date(`${customStart}T00:00:00`)),
      end: endOfDay(new Date(`${customEnd}T00:00:00`))
    };
  }, [customEnd, customStart, range]);
  const filteredSessions = useMemo(
    () =>
      reportRange
        ? sessions.filter((session) => {
            const start = new Date(session.startTime);
            return start >= reportRange.start && start <= reportRange.end;
          })
        : sessions,
    [reportRange, sessions]
  );
  const stats = calculateDashboardStats(tasks, filteredSessions, projects);
  const completedSessions = filteredSessions.filter((session) => session.status === 'completed');
  const focusMinutes = completedSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const interruptions = sessions.reduce((sum, session) => sum + session.interruptions, 0);
  const taskTitleById = new Map(tasks.map((task) => [task.id, task.title]));
  const projectNameById = new Map(projects.map((project) => [project.id, project.name]));
  const dominantProject = stats.focusByProject.slice().sort((a, b) => b.minutes - a.minutes)[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Button onClick={() => downloadText('pomodoro-sessions.csv', sessionsToCsv(filteredSessions), 'text/csv')}><Download size={16} className="mr-2 inline" /> CSV</Button>
      </div>
      <Panel>
        <div className="grid gap-3 md:grid-cols-[220px_1fr]">
          <label className="text-sm">
            Zeitraum
            <select
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={range}
              onChange={(event) => setRange(event.target.value as ReportRange)}
            >
              <option value="today">Heute</option>
              <option value="thisWeek">Diese Woche</option>
              <option value="lastWeek">Letzte Woche</option>
              <option value="month">Monat</option>
              <option value="custom">Eigener Zeitraum</option>
              <option value="all">Alle Daten</option>
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Von
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-800"
                disabled={range !== 'custom'}
                type="date"
                value={customStart}
                onChange={(event) => setCustomStart(event.target.value)}
              />
            </label>
            <label className="text-sm">
              Bis
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-800"
                disabled={range !== 'custom'}
                type="date"
                value={customEnd}
                onChange={(event) => setCustomEnd(event.target.value)}
              />
            </label>
          </div>
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-4">
        <Panel>
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-accent" />
            <h2 className="font-semibold">Was habe ich geschafft?</h2>
          </div>
          <p className="mt-2 text-2xl font-semibold">{completedSessions.length}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">abgeschlossene Fokus-Sessions insgesamt</p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-accent" />
            <h2 className="font-semibold">Wofür ging Zeit drauf?</h2>
          </div>
          <p className="mt-2 text-2xl font-semibold">{focusMinutes} min</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">gespeicherte Fokuszeit</p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <FolderKanban size={18} className="text-accent" />
            <h2 className="font-semibold">Welches Projekt dominiert?</h2>
          </div>
          <p className="mt-2 truncate text-2xl font-semibold">{dominantProject?.projectName ?? 'Noch keines'}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{dominantProject?.minutes ?? 0} min Fokuszeit</p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-accent" />
            <h2 className="font-semibold">Wo gab es Reibung?</h2>
          </div>
          <p className="mt-2 text-2xl font-semibold">{interruptions}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">erfasste Unterbrechungen</p>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-semibold">Fokuszeit nach Projekt</h2>
          <div className="space-y-2">
            {stats.focusByProject.map((project) => (
              <div key={project.projectId}>
                <div className="flex items-center justify-between text-sm">
                  <span>{project.projectName}</span>
                  <span className="text-slate-500">{project.minutes} min</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${focusMinutes > 0 ? Math.round((project.minutes / focusMinutes) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.focusByProject.length === 0 && <p className="text-sm text-slate-500">Noch keine Projektzeiten vorhanden.</p>}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold">Produktivitätsverlauf</h2>
          <div className="flex h-36 items-end gap-2">
            {stats.productivityTrend.map((day) => {
              const maxMinutes = Math.max(...stats.productivityTrend.map((item) => item.minutes), 1);
              return (
                <div className="flex flex-1 flex-col items-center gap-2" key={day.day}>
                  <div className="flex h-24 w-full items-end rounded bg-slate-100 px-1 dark:bg-slate-800">
                    <div
                      className="w-full rounded bg-accent"
                      style={{ height: `${Math.max(6, Math.round((day.minutes / maxMinutes) * 100))}%` }}
                      title={`${day.minutes} min`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(day.day).toLocaleDateString('de-DE', { weekday: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
      <Panel>
        <h2 className="mb-3 font-semibold">Session-Historie</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Start</th><th>Aufgabe</th><th>Projekt</th><th>Dauer</th><th>Status</th><th>Unterbrechungen</th></tr></thead>
            <tbody>
              {filteredSessions.slice().sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map((session) => (
                <tr key={session.id} className="border-t border-line dark:border-slate-800">
                  <td className="py-2">{new Date(session.startTime).toLocaleString()}</td>
                  <td>{taskTitleById.get(session.taskId) ?? session.taskId}</td>
                  <td>{session.projectId ? projectNameById.get(session.projectId) ?? 'Unbekannt' : 'Ohne Projekt'}</td>
                  <td>{session.durationMinutes} min</td>
                  <td>{session.status}</td>
                  <td>{session.interruptions}</td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr className="border-t border-line dark:border-slate-800">
                  <td className="py-4 text-slate-500" colSpan={6}>Noch keine Sessions vorhanden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
