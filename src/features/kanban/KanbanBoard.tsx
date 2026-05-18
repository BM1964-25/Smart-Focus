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

type KanbanFilter = 'all' | 'today' | 'calendar' | 'noProject' | 'highPriority' | 'archived';
type KanbanSort = 'updated' | 'priority' | 'dueDate' | 'title';
type KanbanDensity = 'compact' | 'normal';

const filters: Array<{ id: KanbanFilter; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'today', label: 'Heute' },
  { id: 'calendar', label: 'Kalender' },
  { id: 'noProject', label: 'Ohne Projekt' },
  { id: 'highPriority', label: 'Hohe Priorität' },
  { id: 'archived', label: 'Archiviert' }
];

const isToday = (dateIso?: string): boolean => {
  if (!dateIso) return false;
  const date = new Date(dateIso);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const matchesFilter = (task: TaskCard, filter: KanbanFilter): boolean => {
  if (filter === 'archived') return task.archived;
  if (task.archived) return false;
  if (filter === 'all') return true;
  if (filter === 'today') return task.status === 'today' || task.status === 'focus' || isToday(task.dueDate);
  if (filter === 'calendar') return task.tags.some((tag) => tag.toLowerCase() === 'kalender');
  if (filter === 'noProject') return !task.projectId;
  return task.priority === 'high' || task.priority === 'urgent';
};

const priorityRank = { urgent: 4, high: 3, medium: 2, low: 1 };

const matchesSearch = (task: TaskCard, query: string): boolean => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [task.title, task.description, task.priority, task.tags.join(' ')].some((value) =>
    value.toLowerCase().includes(needle)
  );
};

const sortTasks = (tasks: TaskCard[], sort: KanbanSort): TaskCard[] =>
  tasks.slice().sort((a, b) => {
    if (sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
    if (sort === 'dueDate') return new Date(a.dueDate ?? '9999-12-31').getTime() - new Date(b.dueDate ?? '9999-12-31').getTime();
    if (sort === 'title') return a.title.localeCompare(b.title);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

export const KanbanBoard = (): JSX.Element => {
  const tasks = useTaskStore((state) => state.tasks);
  const error = useTaskStore((state) => state.error);
  const moveTask = useTaskStore((state) => state.moveTask);
  const archiveDone = useTaskStore((state) => state.archiveDone);
  const deleteTasks = useTaskStore((state) => state.deleteTasks);
  const projects = useProjectStore((state) => state.projects);
  const [filter, setFilter] = useState<KanbanFilter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<KanbanSort>('updated');
  const [density, setDensity] = useState<KanbanDensity>('compact');
  const [editing, setEditing] = useState<TaskCard | undefined>();
  const [creating, setCreating] = useState(false);
  const visibleTasks = sortTasks(
    tasks.filter((task) => matchesFilter(task, filter) && matchesSearch(task, search)),
    sort
  );

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
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight">Kanban</h1>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button className="px-2.5 py-1.5 text-xs" variant="secondary" onClick={() => void archiveDone()}>Erledigte archivieren</Button>
          <Button className="px-2.5 py-1.5 text-xs" onClick={() => setCreating(true)}><span className="inline-flex items-center gap-1.5"><Plus size={14} /> Karte</span></Button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {filters.map((item) => {
          const active = item.id === filter;
          const count = tasks.filter((task) => matchesFilter(task, item.id)).length;
          return (
            <button
              key={item.id}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
                  : 'border-line bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              onClick={() => setFilter(item.id)}
              type="button"
            >
              {item.label} <span className={active ? 'text-white/70 dark:text-slate-600' : 'text-slate-400'}>{count}</span>
            </button>
          );
        })}
      </div>
      <div className="mb-3 grid gap-2 rounded-md border border-line bg-white p-2 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[minmax(220px,1fr)_180px_160px]">
        <input
          className="rounded-md border border-line px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          placeholder="Karten suchen..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="rounded-md border border-line px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          value={sort}
          onChange={(event) => setSort(event.target.value as KanbanSort)}
        >
          <option value="updated">Zuletzt geändert</option>
          <option value="priority">Priorität</option>
          <option value="dueDate">Fälligkeit</option>
          <option value="title">Titel</option>
        </select>
        <div className="grid grid-cols-2 rounded-md border border-line p-0.5 dark:border-slate-700">
          {(['compact', 'normal'] as const).map((item) => (
            <button
              className={`rounded px-2 py-1 text-xs font-medium ${density === item ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'text-slate-500'}`}
              key={item}
              onClick={() => setDensity(item)}
              type="button"
            >
              {item === 'compact' ? 'Kompakt' : 'Normal'}
            </button>
          ))}
        </div>
      </div>
      <FocusLane />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="-mx-2 overflow-x-auto px-2 pb-3">
          <div className="flex min-w-max gap-2.5">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={visibleTasks.filter((task) => task.status === column.id)}
                projects={projects}
                onEdit={setEditing}
                onDelete={(task) => void deleteTask(task)}
                density={density}
              />
            ))}
          </div>
        </div>
      </DndContext>
      {(editing || creating) && <TaskEditor task={editing} onClose={() => { setEditing(undefined); setCreating(false); }} />}
    </div>
  );
};
