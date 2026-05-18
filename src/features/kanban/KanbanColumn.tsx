import { useDroppable } from '@dnd-kit/core';
import type { Project, TaskCard as TaskCardType, TaskStatus } from '../../types/domain';
import { TaskCard } from './TaskCard';

interface Props {
  id: TaskStatus;
  title: string;
  tasks: TaskCardType[];
  projects: Project[];
  onEdit: (task: TaskCardType) => void;
  onDelete: (task: TaskCardType) => void;
  density?: 'compact' | 'normal';
}

export const KanbanColumn = ({ id, title, tasks, projects, onEdit, onDelete, density = 'compact' }: Props): JSX.Element => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isFocus = id === 'focus';
  const subtitle: Partial<Record<TaskStatus, string>> = {
    inbox: 'Sammeln',
    today: 'Geplant',
    focus: '1 aktive Karte',
    inProgress: 'Laufend',
    waiting: 'Blockiert',
    done: 'Abschluss'
  };

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[430px] ${density === 'normal' ? 'w-[280px]' : 'w-[238px]'} shrink-0 rounded-md border p-2 transition ${
        isFocus
          ? 'border-accent/50 bg-accent/5 dark:border-accent/60 dark:bg-slate-900'
          : 'border-line bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
      } ${isOver ? 'ring-2 ring-accent' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2 border-b border-line/70 pb-2 dark:border-slate-800">
        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold leading-4">{title}</h2>
          <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-400">{subtitle[id]}</p>
        </div>
        <span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[11px] font-medium leading-4 text-slate-500 dark:bg-slate-900">{tasks.length}</span>
      </div>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            project={projects.find((project) => project.id === task.projectId)}
            onEdit={onEdit}
            onDelete={onDelete}
            density={density}
          />
        ))}
      </div>
      {tasks.length === 0 && <p className="rounded-md border border-dashed border-line p-3 text-center text-xs text-slate-500 dark:border-slate-700">Leer</p>}
    </section>
  );
};
