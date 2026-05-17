import { aiSuggestionResponseSchema } from '../schemas/domain';
import type { AiSuggestionResponse, Project, TaskCard } from '../types/domain';

export type AiAction =
  | 'tasks_from_text'
  | 'prioritize_tasks'
  | 'estimate_pomodoros'
  | 'daily_plan'
  | 'weekly_review'
  | 'detect_time_wasters'
  | 'focus_recommendations'
  | 'improve_description'
  | 'split_task'
  | 'project_summary';

export interface AiRequestContext {
  action: AiAction;
  text?: string;
  tasks?: TaskCard[];
  projects?: Project[];
}

export const requestAiSuggestion = async (
  context: AiRequestContext
): Promise<AiSuggestionResponse> => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context)
  });
  if (!response.ok) {
    throw new Error(`KI-Anfrage fehlgeschlagen (${response.status})`);
  }
  const json = (await response.json()) as unknown;
  return aiSuggestionResponseSchema.parse(json);
};
