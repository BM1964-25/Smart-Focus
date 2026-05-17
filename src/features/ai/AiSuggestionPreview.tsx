import { Check } from 'lucide-react';
import { Button, Panel } from '../../components/ui';
import { useAiStore } from '../../stores/aiStore';
import { useTaskStore } from '../../stores/taskStore';
import type { TaskCard } from '../../types/domain';
import { createId, nowIso } from '../../utils/id';

export const AiSuggestionPreview = (): JSX.Element | null => {
  const suggestion = useAiStore((state) => state.suggestion);
  const clear = useAiStore((state) => state.clear);
  const createTask = useTaskStore((state) => state.createTask);
  if (!suggestion) return null;

  const acceptTasks = async (): Promise<void> => {
    const now = nowIso();
    for (const item of suggestion.tasks ?? []) {
      const task: TaskCard = {
        id: createId('task'),
        title: item.title,
        description: item.description ?? '',
        status: 'inbox',
        priority: item.priority,
        projectId: item.projectId,
        estimatedPomodoros: item.estimatedPomodoros,
        completedPomodoros: 0,
        tags: item.tags,
        createdAt: now,
        updatedAt: now,
        archived: false
      };
      await createTask(task);
    }
    clear();
  };

  return (
    <Panel>
      <h2 className="font-semibold">KI-Vorschau</h2>
      <p className="mt-2 text-sm text-slate-500">{suggestion.summary}</p>
      {suggestion.markdown && <pre className="mt-3 whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm dark:bg-slate-950">{suggestion.markdown}</pre>}
      {suggestion.tasks && (
        <div className="mt-3 space-y-2">
          {suggestion.tasks.map((task) => (
            <div className="rounded-md border border-line p-2 text-sm dark:border-slate-700" key={task.title}>
              <strong>{task.title}</strong>
              <p className="text-slate-500">{task.estimatedPomodoros} Pomodoro · {task.priority}</p>
            </div>
          ))}
          <Button onClick={() => void acceptTasks()}><Check size={16} className="mr-2 inline" /> Vorschläge übernehmen</Button>
        </div>
      )}
    </Panel>
  );
};
