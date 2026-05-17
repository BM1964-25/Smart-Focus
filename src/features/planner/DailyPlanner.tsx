import { CalendarCheck, CircleDot, Target } from 'lucide-react';
import { useMemo } from 'react';
import { Button, Panel } from '../../components/ui';
import { useAiStore } from '../../stores/aiStore';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import type { TaskCard } from '../../types/domain';

const isToday = (dateIso?: string): boolean => {
  if (!dateIso) return false;
  const date = new Date(dateIso);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isOverdue = (dateIso?: string): boolean => {
  if (!dateIso) return false;
  const date = new Date(dateIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const sortByDueDate = (a: TaskCard, b: TaskCard): number =>
  new Date(a.dueDate ?? a.createdAt).getTime() - new Date(b.dueDate ?? b.createdAt).getTime();

const PlannerCard = ({
  task,
  onMoveToday,
  onMoveFocus
}: {
  task: TaskCard;
  onMoveToday: (task: TaskCard) => void;
  onMoveFocus: (task: TaskCard) => void;
}): JSX.Element => (
  <div className="rounded-md border border-line bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium">{task.title}</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {task.estimatedPomodoros} Pomo · {task.priority}
          {task.dueDate ? ` · ${new Date(task.dueDate).toLocaleString()}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          aria-label={`${task.title} nach Heute verschieben`}
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onMoveToday(task)}
          title="Nach Heute"
          type="button"
        >
          <CircleDot size={16} />
        </button>
        <button
          aria-label={`${task.title} in Fokus verschieben`}
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onMoveFocus(task)}
          title="In Fokus"
          type="button"
        >
          <Target size={16} />
        </button>
      </div>
    </div>
  </div>
);

export const DailyPlanner = (): JSX.Element => {
  const allTasks = useTaskStore((state) => state.tasks);
  const tasks = useMemo(
    () => allTasks.filter((task) => !task.archived && task.status !== 'done'),
    [allTasks]
  );
  const moveTask = useTaskStore((state) => state.moveTask);
  const projects = useProjectStore((state) => state.projects);
  const requestSuggestion = useAiStore((state) => state.requestSuggestion);

  const todayTasks = tasks
    .filter((task) => task.status === 'today' || task.status === 'focus' || isToday(task.dueDate))
    .sort(sortByDueDate);
  const overdueTasks = tasks.filter((task) => isOverdue(task.dueDate)).sort(sortByDueDate);
  const openTasks = tasks
    .filter((task) => !todayTasks.some((todayTask) => todayTask.id === task.id))
    .slice()
    .sort(sortByDueDate);

  const plannerCard = (task: TaskCard): JSX.Element => (
    <PlannerCard
      key={task.id}
      task={task}
      onMoveFocus={(item) => void moveTask(item.id, 'focus')}
      onMoveToday={(item) => void moveTask(item.id, 'today')}
    />
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tagesplanung</h1>
        <Button onClick={() => void requestSuggestion({ action: 'daily_plan', tasks, projects })}>
          <CalendarCheck size={16} className="mr-2 inline" /> KI-Plan
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Panel>
          <h2 className="mb-3 font-semibold">Heute</h2>
          <div className="space-y-2">
            {todayTasks.map(plannerCard)}
            {todayTasks.length === 0 && (
              <p className="rounded-md border border-dashed border-line p-4 text-sm text-slate-500 dark:border-slate-700">
                Noch keine Aufgaben für heute. Nutze die offenen Aufgaben rechts oder den KI-Plan.
              </p>
            )}
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel>
            <h2 className="mb-3 font-semibold">Überfällig</h2>
            <div className="space-y-2">
              {overdueTasks.map(plannerCard)}
              {overdueTasks.length === 0 && <p className="text-sm text-slate-500">Keine überfälligen Aufgaben.</p>}
            </div>
          </Panel>
          <Panel>
            <h2 className="mb-3 font-semibold">Offene Aufgaben</h2>
            <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
              {openTasks.map(plannerCard)}
              {openTasks.length === 0 && <p className="text-sm text-slate-500">Keine weiteren offenen Aufgaben.</p>}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
