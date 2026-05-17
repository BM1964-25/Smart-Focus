import { describe, expect, it } from 'vitest';
import { useTaskStore } from '../stores/taskStore';
import type { TaskCard } from '../types/domain';

const makeTask = (id: string, tags: string[]): TaskCard => ({
  id,
  title: id,
  description: '',
  status: 'inbox',
  priority: 'medium',
  estimatedPomodoros: 1,
  completedPomodoros: 0,
  tags,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  archived: false
});

describe('task deletion', () => {
  it('deletes selected task ids and keeps the rest', async () => {
    useTaskStore.setState({
      tasks: [makeTask('calendar_1', ['kalender']), makeTask('manual_1', [])]
    });

    await useTaskStore.getState().deleteTasks(['calendar_1']);

    expect(useTaskStore.getState().tasks.map((task) => task.id)).toEqual(['manual_1']);
  });
});
