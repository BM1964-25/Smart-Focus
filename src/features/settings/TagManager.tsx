import { useMemo } from 'react';
import { Panel } from '../../components/ui';
import { useTaskStore } from '../../stores/taskStore';

export const TagManager = (): JSX.Element => {
  const tasks = useTaskStore((state) => state.tasks);
  const tags = useMemo(() => [...new Set(tasks.flatMap((task) => task.tags))].sort(), [tasks]);
  return (
    <Panel>
      <h2 className="mb-3 font-semibold">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">{tag}</span>)}
        {tags.length === 0 && <p className="text-sm text-slate-500">Noch keine Tags.</p>}
      </div>
    </Panel>
  );
};
