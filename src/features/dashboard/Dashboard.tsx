import { CheckCircle2, Clock3, Hourglass, TimerReset, Trash2, Zap } from 'lucide-react';
import { Panel } from '../../components/ui';
import { calculateDashboardStats } from '../../services/reportingService';
import { useProjectStore } from '../../stores/projectStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useTaskStore } from '../../stores/taskStore';

export const Dashboard = (): JSX.Element => {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTasks = useTaskStore((state) => state.deleteTasks);
  const sessions = useSessionStore((state) => state.sessions);
  const projects = useProjectStore((state) => state.projects);
  const stats = calculateDashboardStats(tasks, sessions, projects);

  const deleteTask = async (taskId: string, taskTitle: string): Promise<void> => {
    const confirmed = window.confirm(`Aufgabe "${taskTitle}" löschen?`);
    if (!confirmed) return;
    await deleteTasks([taskId]);
  };

  const cards = [
    { icon: Zap, label: 'Fokuszeit heute', value: `${stats.focusMinutesToday} min` },
    { icon: Clock3, label: 'Fokuszeit diese Woche', value: `${stats.focusMinutesWeek} min` },
    { icon: TimerReset, label: 'Pomodoros heute', value: stats.pomodorosToday },
    { icon: CheckCircle2, label: 'Erledigte Karten heute', value: stats.completedTasksToday },
    { icon: Hourglass, label: 'Unterbrechungen heute', value: stats.interruptions }
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
          <Panel className="flex min-h-28 items-center justify-center px-3 py-3" key={card.label}>
            <div className="flex flex-col items-center text-center">
              <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={2} aria-hidden />
              <p className="mt-2 whitespace-nowrap text-xs font-medium leading-4 text-slate-500">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-semibold leading-7">{card.value}</p>
            </div>
          </Panel>
          );
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-semibold">Fokuszeit nach Projekt</h2>
          <div className="space-y-2">
            {stats.focusByProject.map((row) => (
              <div key={row.projectId}>
                <div className="flex justify-between text-sm"><span>{row.projectName}</span><span>{row.minutes} min</span></div>
                <div className="mt-1 h-2 rounded bg-slate-100 dark:bg-slate-800"><div className="h-full rounded bg-accent" style={{ width: `${Math.min(100, row.minutes * 2)}%` }} /></div>
              </div>
            ))}
            {stats.focusByProject.length === 0 && <p className="text-sm text-slate-500">Noch keine abgeschlossenen Sessions.</p>}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold">Geschätzte versus erledigte Pomodoros</h2>
          <div className="space-y-2">
            {stats.estimateVsActual.slice(0, 8).map((row, index) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-line py-2 text-sm dark:border-slate-800"
                key={`${row.taskId}-${index}`}
              >
                <span className="min-w-0 flex-1 truncate">{row.taskTitle}</span>
                <span className="shrink-0">{row.estimated} / {row.actual} Pomo</span>
                <button
                  aria-label={`Aufgabe ${row.taskTitle} löschen`}
                  className="shrink-0 rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  onClick={() => void deleteTask(row.taskId, row.taskTitle)}
                  title="Aufgabe löschen"
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel>
        <h2 className="mb-3 font-semibold">Produktivitätsverlauf</h2>
        <div className="grid grid-cols-7 items-end gap-2">
          {stats.productivityTrend.map((day) => (
            <div key={day.day} className="text-center text-xs text-slate-500">
              <div className="mx-auto mb-2 w-full rounded bg-accent" style={{ height: `${Math.max(8, day.minutes)}px` }} />
              {day.day.slice(5)}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};
