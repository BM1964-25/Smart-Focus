import { describe, expect, it } from 'vitest';
import { useSessionStore } from '../stores/sessionStore';

describe('Pomodoro session linking', () => {
  it('links a session to the active task and project', async () => {
    const session = await useSessionStore.getState().startFocusSession('task_1', 'project_1', 25);
    expect(session.taskId).toBe('task_1');
    expect(session.projectId).toBe('project_1');
    expect(session.plannedDurationMinutes).toBe(25);
  });
});
