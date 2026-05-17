import { Trash2 } from 'lucide-react';
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
    ['Fokuszeit heute', `${stats.focusMinutesToday} min`],
    ['Fokuszeit diese Woche', `${stats.focusMinutesWeek} min`],
    ['Pomodoros heute', stats.pomodorosToday],
    ['Erledigte Karten heute', stats.completedTasksToday],
    ['Unterbrechungen heute', stats.interruptions]
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <Panel className="flex min-h-20 items-center justify-center text-center" key={label}>
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-xl font-semibold">{value}</span>
            </div>
          </Panel>
        ))}
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
            {stats.estimateVsActual.slice(0, 8).map((row) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-line py-2 text-sm dark:border-slate-800"
                key={row.taskId}
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
