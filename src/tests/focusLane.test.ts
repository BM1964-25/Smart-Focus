import { describe, expect, it } from 'vitest';
import { useTaskStore } from '../stores/taskStore';
import type { TaskCard } from '../types/domain';

const task = (id: string, status: TaskCard['status']): TaskCard => ({
  id,
  title: id,
  description: '',
  status,
  priority: 'medium',
  estimatedPomodoros: 1,
  completedPomodoros: 0,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  archived: false
});

describe('Focus Lane limit', () => {
  it('allows only one active focus card', async () => {
    useTaskStore.setState({ tasks: [task('a', 'focus'), task('b', 'inbox')] });
    const moved = await useTaskStore.getState().moveTask('b', 'focus');
    expect(moved).toBe(false);
    expect(useTaskStore.getState().tasks.filter((item) => item.status === 'focus')).toHaveLength(1);
  });
});
