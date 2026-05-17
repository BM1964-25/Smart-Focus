import { create } from 'zustand';
import { projectRepository } from '../repositories/projectRepository';
import { seedProjects } from '../services/seed';
import type { Project } from '../types/domain';
import { nowIso } from '../utils/id';

interface ProjectState {
  projects: Project[];
  load: () => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  async load() {
    let projects = await projectRepository.all();
    if (projects.length === 0) {
      await projectRepository.bulkPut(seedProjects);
      projects = seedProjects;
    }
    set({ projects });
  },
  async saveProject(project) {
    const updated = { ...project, updatedAt: nowIso() };
    await projectRepository.put(updated);
    const exists = get().projects.some((item) => item.id === project.id);
    set({ projects: exists ? get().projects.map((item) => (item.id === project.id ? updated : item)) : [...get().projects, updated] });
  }
}));
