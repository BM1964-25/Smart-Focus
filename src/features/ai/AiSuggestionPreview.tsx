import { Check, Clipboard, Trash2 } from 'lucide-react';
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

  const createSuggestedTask = async (item: NonNullable<typeof suggestion.tasks>[number]): Promise<void> => {
    const now = nowIso();
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
  };

  const acceptTasks = async (): Promise<void> => {
    for (const item of suggestion.tasks ?? []) {
      await createSuggestedTask(item);
    }
    clear();
  };

  const copyMarkdown = async (): Promise<void> => {
    await navigator.clipboard.writeText(suggestion.markdown ?? suggestion.summary);
  };

  return (
    <Panel>
      <h2 className="font-semibold">KI-Vorschau</h2>
      <p className="mt-2 text-sm text-slate-500">{suggestion.summary}</p>
      {suggestion.markdown && <pre className="mt-3 whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm dark:bg-slate-950">{suggestion.markdown}</pre>}
      {suggestion.tasks && (
        <div className="mt-3 space-y-2">
          {suggestion.tasks.map((task, index) => (
            <div className="rounded-md border border-line p-2 text-sm dark:border-slate-700" key={`${task.title}-${index}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>{task.title}</strong>
                  <p className="text-slate-500">{task.estimatedPomodoros} Pomodoro · {task.priority}</p>
                </div>
                <Button className="px-2 py-1 text-xs" variant="secondary" onClick={() => void createSuggestedTask(task)}>
                  Einzeln übernehmen
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestion.tasks && <Button onClick={() => void acceptTasks()}><Check size={16} className="mr-2 inline" /> Alle Karten übernehmen</Button>}
        {suggestion.markdown && <Button variant="secondary" onClick={() => void copyMarkdown()}><Clipboard size={16} className="mr-2 inline" /> Text kopieren</Button>}
        <Button variant="secondary" onClick={clear}><Trash2 size={16} className="mr-2 inline" /> Vorschau verwerfen</Button>
      </div>
    </Panel>
  );
};
