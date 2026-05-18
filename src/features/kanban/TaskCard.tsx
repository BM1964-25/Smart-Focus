import { useDraggable } from '@dnd-kit/core';
import { CalendarDays, GripVertical, Trash2 } from 'lucide-react';
import type { Project, TaskCard as TaskCardType } from '../../types/domain';

interface Props {
  task: TaskCardType;
  project?: Project;
  onEdit: (task: TaskCardType) => void;
  onDelete: (task: TaskCardType) => void;
  density?: 'compact' | 'normal';
}

const priorityStyles = {
  low: 'border-slate-300 text-slate-500',
  medium: 'border-blue-300 text-blue-700 dark:text-blue-300',
  high: 'border-amber-300 text-amber-700 dark:text-amber-300',
  urgent: 'border-red-300 text-red-700 dark:text-red-300'
};

export const TaskCard = ({ task, project, onEdit, onDelete, density = 'compact' }: Props): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const visibleTags = task.tags.slice(0, 1);
  const dueLabel = task.dueDate ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(new Date(task.dueDate)) : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-line bg-white shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 ${
        density === 'normal' ? 'px-3 py-2.5' : 'px-2 py-1.5'
      } ${isDragging ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-1">
        <button className="mt-0.5 shrink-0 text-slate-400" type="button" aria-label="Karte ziehen" {...attributes} {...listeners}>
          <GripVertical size={14} />
        </button>
        <button className="min-w-0 flex-1 text-left" type="button" onClick={() => onEdit(task)}>
          <h3 className="line-clamp-2 text-[12px] font-semibold leading-4">{task.title}</h3>
          {task.description && (
            <p className={`${density === 'normal' ? 'line-clamp-2' : 'line-clamp-1'} text-[11px] leading-4 text-slate-500 dark:text-slate-400`}>
              {task.description}
            </p>
          )}
        </button>
        <button
          aria-label={`Karte ${task.title} löschen`}
          className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
          onClick={() => onDelete(task)}
          title="Karte löschen"
          type="button"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="mt-1 flex min-w-0 items-center gap-1 text-[10px] leading-4 text-slate-500">
        <span className={`shrink-0 rounded border px-1 py-0 ${priorityStyles[task.priority]}`}>{task.priority}</span>
        <span className="shrink-0">{task.completedPomodoros}/{task.estimatedPomodoros}</span>
        {dueLabel && (
          <span className="inline-flex shrink-0 items-center gap-0.5">
            <CalendarDays size={10} />
            {dueLabel}
          </span>
        )}
        {project && <span className="truncate rounded px-1 py-0 text-white" style={{ backgroundColor: project.color }}>{project.name}</span>}
        {visibleTags.map((tag) => (
          <span key={tag} className="truncate rounded bg-slate-100 px-1 py-0 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {tag}
          </span>
        ))}
        {task.tags.length > 1 && <span className="shrink-0 text-slate-400">+{task.tags.length - 1}</span>}
      </div>
    </article>
  );
};
