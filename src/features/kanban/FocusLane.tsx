import { Target } from 'lucide-react';
import { Panel } from '../../components/ui';
import { selectFocusTask, useTaskStore } from '../../stores/taskStore';

export const FocusLane = (): JSX.Element => {
  const focusTask = useTaskStore((state) => selectFocusTask(state.tasks));
  return (
    <Panel className="mb-3 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Target className="shrink-0 text-accent" size={18} />
        <div className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Focus Lane</h2>
          <p className="truncate text-sm text-slate-700 dark:text-slate-200">
            {focusTask ? focusTask.title : 'Ziehe genau eine Karte in die Fokus-Spalte, um einen Pomodoro zu starten.'}
          </p>
        </div>
      </div>
    </Panel>
  );
};
