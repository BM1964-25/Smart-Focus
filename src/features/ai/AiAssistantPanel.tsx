import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { useAiStore } from '../../stores/aiStore';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import { AiSuggestionPreview } from './AiSuggestionPreview';

export const AiAssistantPanel = (): JSX.Element => {
  const [text, setText] = useState('Angebot Müller prüfen, Rückfrage Statik beantworten, Rechnung vorbereiten, Termin mit Bauherr abstimmen');
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const { loading, error, requestSuggestion } = useAiStore();
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Panel>
        <div className="mb-3 flex items-center gap-2"><Sparkles size={18} className="text-accent" /><h2 className="font-semibold">KI-Assistent</h2></div>
        <textarea className="min-h-24 w-full rounded-md border border-line p-3 text-sm dark:border-slate-700 dark:bg-slate-950" value={text} onChange={(event) => setText(event.target.value)} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button disabled={loading} onClick={() => void requestSuggestion({ action: 'tasks_from_text', text, projects })}>Karten erzeugen</Button>
          <Button variant="secondary" disabled={loading} onClick={() => void requestSuggestion({ action: 'prioritize_tasks', tasks, projects })}>Priorisieren</Button>
          <Button variant="secondary" disabled={loading} onClick={() => void requestSuggestion({ action: 'focus_recommendations', tasks, projects })}>Fokus empfehlen</Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Panel>
      <AiSuggestionPreview />
    </div>
  );
};
