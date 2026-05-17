import { describe, expect, it } from 'vitest';
import { calculateDashboardStats } from '../services/reportingService';

describe('statistics calculation', () => {
  it('calculates real focus minutes and interruptions', () => {
    const now = new Date('2026-05-17T10:00:00.000Z');
    const stats = calculateDashboardStats(
      [],
      [
        {
          id: 's1',
          taskId: 't1',
          projectId: 'p1',
          startTime: now.toISOString(),
          endTime: now.toISOString(),
          durationMinutes: 25,
          plannedDurationMinutes: 25,
          type: 'focus',
          status: 'completed',
          interruptions: 2,
          notes: ''
        }
      ],
      [{ id: 'p1', name: 'Projekt', client: '', color: '#2563eb', archived: false, createdAt: now.toISOString(), updatedAt: now.toISOString() }],
      now
    );
    expect(stats.focusMinutesToday).toBe(25);
    expect(stats.interruptions).toBe(2);
    expect(stats.focusByProject[0].projectName).toBe('Projekt');
  });
});
