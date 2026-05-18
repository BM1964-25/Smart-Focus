import { Activity, CheckCircle2, Clock3, ListChecks } from 'lucide-react';
import { Panel } from '../../components/ui';
import { useProjectStore } from '../../stores/projectStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useTaskStore } from '../../stores/taskStore';
import { PomodoroTimer } from './PomodoroTimer';

const isToday = (dateIso: string): boolean => {
  const date = new Date(dateIso);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const PomodoroView = (): JSX.Element => {
  const sessions = useSessionStore((state) => state.sessions);
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const todaySessions = sessions
    .filter((session) => isToday(session.startTime))
    .slice()
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  const completedToday = todaySessions.filter((session) => session.status === 'completed');
  const focusMinutes = completedToday.reduce((sum, session) => sum + session.durationMinutes, 0);
  const interruptions = todaySessions.reduce((sum, session) => sum + session.interruptions, 0);

  const taskTitle = (taskId: string): string => tasks.find((task) => task.id === taskId)?.title ?? taskId;
  const projectName = (projectId?: string): string | undefined =>
    projectId ? projects.find((project) => project.id === projectId)?.name : undefined;

  return (
    <div className="mx-auto grid max-w-5xl gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <PomodoroTimer />
        <Panel>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-accent" />
            <h2 className="font-semibold">Heutige Sessions</h2>
          </div>
          <div className="space-y-2">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="grid gap-2 rounded-md border border-line p-3 text-sm dark:border-slate-800 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{taskTitle(session.taskId)}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {projectName(session.projectId) ? ` · ${projectName(session.projectId)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{session.durationMinutes || session.plannedDurationMinutes} min</span>
                  <span>{session.interruptions} Unterbr.</span>
                  <span className="font-medium">{session.status}</span>
                </div>
              </div>
            ))}
            {todaySessions.length === 0 && (
              <p className="rounded-md border border-dashed border-line p-4 text-sm text-slate-500 dark:border-slate-700">
                Heute wurden noch keine Pomodoro-Sessions erfasst.
              </p>
            )}
          </div>
        </Panel>
      </div>
      <aside className="space-y-4">
        <Panel>
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-accent" />
            <h2 className="font-semibold">Heute</h2>
          </div>
          <div className="mt-4 grid gap-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fokuszeit</p>
              <p className="text-2xl font-semibold">{focusMinutes} min</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Abgeschlossene Pomodoros</p>
              <p className="text-2xl font-semibold">{completedToday.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unterbrechungen</p>
              <p className="text-2xl font-semibold">{interruptions}</p>
            </div>
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h2 className="font-semibold">Arbeitslogik</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Ein Pomodoro startet nur mit genau einer Karte in der Fokus-Spalte. Nach Abschluss wird die Session gespeichert
            und der Karte als erledigter Pomodoro gutgeschrieben.
          </p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent" />
            <h2 className="font-semibold">Nächster Schritt</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Wenn keine Fokus-Karte ausgewählt ist, wechsle zum Kanban-Board und ziehe genau eine Aufgabe in die Fokus-Spalte.
          </p>
        </Panel>
      </aside>
    </div>
  );
};
