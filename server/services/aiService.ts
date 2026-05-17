import Anthropic from '@anthropic-ai/sdk';
import { aiSuggestionResponseSchema, type AiRequest, type AiSuggestionResponse } from '../schemas/aiSchemas.js';
import { parseJsonObject, parseOrThrow } from './validationService.js';

const systemPrompt = `Du bist ein professioneller Zeitmanagement-Assistent fuer Selbststaendige, Wissensarbeiter und Business-Anwender.
Antworte ausschliesslich als valides JSON ohne Markdown-Zaun.
Nutze dieses Schema:
{
  "kind": "task_suggestions" | "prioritization" | "daily_plan" | "weekly_review" | "focus_recommendations" | "project_summary",
  "summary": "kurze Zusammenfassung",
  "tasks": [{"title":"", "description":"", "estimatedPomodoros":1, "priority":"low|medium|high|urgent", "projectId":"optional", "tags":[]}],
  "markdown": "optional",
  "warnings": []
}
Speichere nichts, triff keine Annahmen ueber sensible Daten und nutze nur den uebergebenen Kontext.`;

const buildUserPrompt = (request: AiRequest): string =>
  JSON.stringify(
    {
      task: request.action,
      instruction:
        request.action === 'tasks_from_text'
          ? 'Wandle den Freitext in konkrete Kanban-Karten um.'
          : 'Erzeuge einen pruefbaren Vorschlag fuer den angefragten Zeitmanagement-Workflow.',
      text: request.text,
      projects: request.projects,
      tasks: request.tasks
    },
    null,
    2
  );

export class AiService {
  private readonly client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async createSuggestion(request: AiRequest): Promise<AiSuggestionResponse> {
    const response = await this.client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest',
      max_tokens: 1600,
      temperature: 0.2,
      system: systemPrompt,
      messages: [{ role: 'user', content: buildUserPrompt(request) }]
    });
    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
    return parseOrThrow(aiSuggestionResponseSchema, parseJsonObject(text));
  }
}
