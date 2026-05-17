import { create } from 'zustand';
import { taskRepository } from '../repositories/taskRepository';
import { seedTasks } from '../services/seed';
import type { TaskCard, TaskStatus } from '../types/domain';
import { nowIso } from '../utils/id';

interface TaskState {
  tasks: TaskCard[];
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  createTask: (task: TaskCard) => Promise<void>;
  createTasks: (tasks: TaskCard[]) => Promise<void>;
  updateTask: (task: TaskCard) => Promise<void>;
  deleteTasks: (taskIds: string[]) => Promise<void>;
  moveTask: (taskId: string, status: TaskStatus) => Promise<boolean>;
  archiveDone: () => Promise<void>;
  incrementCompletedPomodoros: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  async load() {
    set({ loading: true, error: undefined });
    try {
      let tasks = await taskRepository.all();
      if (tasks.length === 0) {
        await taskRepository.bulkPut(seedTasks);
        tasks = seedTasks;
      }
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Aufgaben konnten nicht geladen werden', loading: false });
    }
  },
  async createTask(task) {
    await taskRepository.put(task);
    set({ tasks: [...get().tasks, task] });
  },
  async createTasks(tasks) {
    await taskRepository.bulkPut(tasks);
    set({ tasks: [...get().tasks, ...tasks] });
  },
  async updateTask(task) {
    const updated = { ...task, updatedAt: nowIso() };
    await taskRepository.put(updated);
    set({ tasks: get().tasks.map((item) => (item.id === updated.id ? updated : item)) });
  },
  async deleteTasks(taskIds) {
    await Promise.all(taskIds.map((taskId) => taskRepository.delete(taskId)));
    set({ tasks: get().tasks.filter((task) => !taskIds.includes(task.id)) });
  },
  async moveTask(taskId, status) {
    const tasks = get().tasks;
    if (status === 'focus' && tasks.some((task) => task.status === 'focus' && task.id !== taskId && !task.archived)) {
      set({ error: 'Die Fokus-Spalte darf maximal eine Karte enthalten.' });
      return false;
    }
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return false;
    const updated = { ...task, status, updatedAt: nowIso() };
    await taskRepository.put(updated);
    set({ tasks: tasks.map((item) => (item.id === taskId ? updated : item)), error: undefined });
    return true;
  },
  async archiveDone() {
    const updates = get()
      .tasks.filter((task) => task.status === 'done' && !task.archived)
      .map((task) => ({ ...task, archived: true, updatedAt: nowIso() }));
    await taskRepository.bulkPut(updates);
    set({
      tasks: get().tasks.map((task) => updates.find((update) => update.id === task.id) ?? task)
    });
  },
  async incrementCompletedPomodoros(taskId) {
    const task = get().tasks.find((item) => item.id === taskId);
    if (!task) return;
    await get().updateTask({ ...task, completedPomodoros: task.completedPomodoros + 1 });
  }
}));

export const selectFocusTask = (tasks: TaskCard[]): TaskCard | undefined =>
  tasks.find((task) => task.status === 'focus' && !task.archived);
