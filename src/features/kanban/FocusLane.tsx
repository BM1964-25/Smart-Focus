import { Target } from 'lucide-react';
import { Panel } from '../../components/ui';
import { selectFocusTask, useTaskStore } from '../../stores/taskStore';

export const FocusLane = (): JSX.Element => {
  const focusTask = useTaskStore((state) => selectFocusTask(state.tasks));
  return (
    <Panel className="mb-5">
      <div className="flex items-start gap-3">
        <Target className="mt-1 text-accent" size={20} />
        <div>
          <h2 className="text-sm font-semibold">Focus Lane</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {focusTask ? focusTask.title : 'Ziehe genau eine Karte in die Fokus-Spalte, um einen Pomodoro zu starten.'}
          </p>
        </div>
      </div>
    </Panel>
  );
};
