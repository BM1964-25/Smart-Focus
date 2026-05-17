import { Plus } from 'lucide-react';
import { Button, Panel } from '../../components/ui';
import { useProjectStore } from '../../stores/projectStore';
import type { Project } from '../../types/domain';
import { createId, nowIso } from '../../utils/id';

export const ProjectManager = (): JSX.Element => {
  const projects = useProjectStore((state) => state.projects);
  const saveProject = useProjectStore((state) => state.saveProject);
  const addProject = (): void => {
    const now = nowIso();
    const project: Project = { id: createId('project'), name: 'Neues Projekt', client: '', color: '#2563eb', archived: false, createdAt: now, updatedAt: now };
    void saveProject(project);
  };
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Projekte</h2>
        <Button variant="secondary" onClick={addProject}><Plus size={16} /></Button>
      </div>
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between rounded-md border border-line p-2 text-sm dark:border-slate-700">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded" style={{ backgroundColor: project.color }} />{project.name}</span>
            <span className="text-slate-500">{project.client || 'Intern'}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
};
