import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import type { Priority, TaskCard } from '../../types/domain';
import { createId, nowIso } from '../../utils/id';

interface Props {
  task?: TaskCard;
  onClose: () => void;
}

export const TaskEditor = ({ task, onClose }: Props): JSX.Element => {
  const projects = useProjectStore((state) => state.projects);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [projectId, setProjectId] = useState<string>('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEstimatedPomodoros(task.estimatedPomodoros);
    setProjectId(task.projectId ?? '');
    setTags(task.tags.join(', '));
  }, [task]);

  const save = async (): Promise<void> => {
    const timestamp = nowIso();
    const next: TaskCard = {
      id: task?.id ?? createId('task'),
      title,
      description,
      status: task?.status ?? 'inbox',
      priority,
      projectId: projectId || undefined,
      estimatedPomodoros,
      completedPomodoros: task?.completedPomodoros ?? 0,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      dueDate: task?.dueDate,
      createdAt: task?.createdAt ?? timestamp,
      updatedAt: timestamp,
      archived: task?.archived ?? false
    };
    if (task) await updateTask(next);
    else await createTask(next);
    onClose();
  };

  return (
    <Panel className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{task ? 'Karte bearbeiten' : 'Neue Karte'}</h2>
        <button type="button" onClick={onClose} aria-label="Schließen"><X size={18} /></button>
      </div>
      <div className="grid gap-3">
        <input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titel" />
        <textarea className="min-h-24 rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Beschreibung" />
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
            <option value="urgent">Dringend</option>
          </select>
          <input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type="number" min={0} value={estimatedPomodoros} onChange={(event) => setEstimatedPomodoros(Number(event.target.value))} />
          <select className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
            <option value="">Ohne Projekt</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
        </div>
        <input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, kommagetrennt" />
        <Button onClick={() => void save()} disabled={!title.trim()}><span className="inline-flex items-center gap-2"><Save size={16} /> Speichern</span></Button>
      </div>
    </Panel>
  );
};
