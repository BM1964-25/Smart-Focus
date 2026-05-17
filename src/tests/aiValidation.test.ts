import { describe, expect, it } from 'vitest';
import { aiSuggestionResponseSchema } from '../schemas/domain';

describe('AI response validation', () => {
  it('accepts structured task suggestions', () => {
    const parsed = aiSuggestionResponseSchema.parse({
      kind: 'task_suggestions',
      summary: 'Vier Karten vorgeschlagen.',
      tasks: [
        {
          title: 'Angebot Müller prüfen',
          estimatedPomodoros: 2,
          priority: 'high',
          tags: ['angebot']
        }
      ]
    });
    expect(parsed.tasks?.[0].priority).toBe('high');
  });
});
