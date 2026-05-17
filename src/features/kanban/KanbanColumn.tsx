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
}

export const KanbanColumn = ({ id, title, tasks, projects, onEdit, onDelete }: Props): JSX.Element => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section ref={setNodeRef} className={`min-h-[320px] rounded-md border border-line bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 ${isOver ? 'ring-2 ring-accent' : ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold">{title}</h2>
        <span className="rounded bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-900">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            project={projects.find((project) => project.id === task.projectId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      {tasks.length === 0 && <p className="rounded-md border border-dashed border-line p-3 text-center text-xs text-slate-500 dark:border-slate-700">Leer</p>}
    </section>
  );
};
