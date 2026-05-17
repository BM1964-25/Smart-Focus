import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import type { TaskCard, TaskStatus } from '../../types/domain';
import { FocusLane } from './FocusLane';
import { KanbanColumn } from './KanbanColumn';
import { TaskEditor } from './TaskEditor';

const columns: Array<{ id: TaskStatus; title: string }> = [
  { id: 'inbox', title: 'Inbox' },
  { id: 'today', title: 'Heute' },
  { id: 'focus', title: 'Fokus' },
  { id: 'inProgress', title: 'In Arbeit' },
  { id: 'waiting', title: 'Wartend' },
  { id: 'done', title: 'Erledigt' }
];

export const KanbanBoard = (): JSX.Element => {
  const tasks = useTaskStore((state) => state.tasks);
  const error = useTaskStore((state) => state.error);
  const moveTask = useTaskStore((state) => state.moveTask);
  const archiveDone = useTaskStore((state) => state.archiveDone);
  const deleteTasks = useTaskStore((state) => state.deleteTasks);
  const projects = useProjectStore((state) => state.projects);
  const [editing, setEditing] = useState<TaskCard | undefined>();
  const [creating, setCreating] = useState(false);

  const handleDragEnd = (event: DragEndEvent): void => {
    const overId = event.over?.id;
    if (!overId) return;
    void moveTask(String(event.active.id), overId as TaskStatus);
  };

  const deleteTask = async (task: TaskCard): Promise<void> => {
    const confirmed = window.confirm(
      `Karte "${task.title}" löschen? Bestehende Pomodoro-Sessions bleiben im Verlauf erhalten.`
    );
    if (!confirmed) return;
    await deleteTasks([task.id]);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Kanban-Board</h1>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => void archiveDone()}>Erledigte archivieren</Button>
          <Button onClick={() => setCreating(true)}><span className="inline-flex items-center gap-2"><Plus size={16} /> Karte</span></Button>
        </div>
      </div>
      <FocusLane />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-3 xl:grid-cols-3 2xl:grid-cols-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id && !task.archived)}
              projects={projects}
              onEdit={setEditing}
              onDelete={(task) => void deleteTask(task)}
            />
          ))}
        </div>
      </DndContext>
      {(editing || creating) && <TaskEditor task={editing} onClose={() => { setEditing(undefined); setCreating(false); }} />}
    </div>
  );
};
