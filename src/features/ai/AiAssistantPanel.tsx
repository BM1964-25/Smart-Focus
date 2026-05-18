import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ViewKey } from '../../app/App';
import { Button, Panel } from '../../components/ui';
import { useAiStore } from '../../stores/aiStore';
import { useProjectStore } from '../../stores/projectStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useTaskStore } from '../../stores/taskStore';
import type { AiAction } from '../../services/aiClient';
import { AiSuggestionPreview } from './AiSuggestionPreview';

interface Props {
  view: ViewKey;
}

type AiPanelView = Extract<ViewKey, 'dashboard' | 'kanban' | 'planner' | 'reports'>;

interface AiActionButton {
  label: string;
  action: AiAction;
  variant?: 'primary' | 'secondary';
}

const panelContent: Record<AiPanelView, { lead: string; note: string; placeholder: string; buttons: AiActionButton[] }> = {
  dashboard: {
    lead: 'Die KI wertet deine offenen Aufgaben und bisherigen Fokusdaten aus. Sie kann Tagesprioritäten, Fokus-Empfehlungen und einen kurzen Arbeitsrückblick vorbereiten.',
    note: 'Gut für den schnellen Überblick: Was ist heute wichtig, was bremst, was sollte als Nächstes in Fokus?',
    placeholder: 'Optionaler Kontext für die KI, zum Beispiel: Heute nur 3 Stunden Zeit, Kundentermine am Nachmittag.',
    buttons: [
      { label: 'Fokus empfehlen', action: 'focus_recommendations' },
      { label: 'Tagesplan', action: 'daily_plan', variant: 'secondary' },
      { label: 'Wochenrückblick', action: 'weekly_review', variant: 'secondary' }
    ]
  },
  kanban: {
    lead: 'Die KI unterstützt das Kanban-Board beim Strukturieren deiner Arbeit. Sie kann Freitext in Karten umwandeln, bestehende Aufgaben priorisieren und Fokus-Empfehlungen geben.',
    note: 'Gut für unsortierte Gedanken, importierte Aufgabenlisten und große Karten, die klarer formuliert werden sollen.',
    placeholder: 'Beispiel: Angebot Müller prüfen, Rückfrage Statik beantworten, Rechnung vorbereiten, Termin mit Bauherr abstimmen',
    buttons: [
      { label: 'Karten erzeugen', action: 'tasks_from_text' },
      { label: 'Priorisieren', action: 'prioritize_tasks', variant: 'secondary' },
      { label: 'Fokus empfehlen', action: 'focus_recommendations', variant: 'secondary' }
    ]
  },
  planner: {
    lead: 'Die KI hilft bei der Tagesplanung. Sie kann offene Karten in eine sinnvolle Reihenfolge bringen, realistische Fokusblöcke vorschlagen und passende Aufgaben für Heute/Fokus empfehlen.',
    note: 'Gut, wenn viele Aufgaben offen sind und du eine klare Reihenfolge für den Arbeitstag brauchst.',
    placeholder: 'Optionaler Kontext für heute, zum Beispiel: Vormittag Deep Work, Nachmittag Termine.',
    buttons: [
      { label: 'Tagesplan erzeugen', action: 'daily_plan' },
      { label: 'Fokus empfehlen', action: 'focus_recommendations', variant: 'secondary' },
      { label: 'Priorisieren', action: 'prioritize_tasks', variant: 'secondary' }
    ]
  },
  reports: {
    lead: 'Die KI unterstützt die Auswertung deiner Arbeit. Sie kann aus abgeschlossenen Sessions einen Wochenrückblick formulieren, Zeitfresser erkennen und Projektfortschritt zusammenfassen.',
    note: 'Gut für Reflexion, Kundenkommunikation, eigene Produktivitätsmuster und bessere Planung der nächsten Woche.',
    placeholder: 'Optionaler Kontext für den Report, zum Beispiel: Diese Woche lag der Schwerpunkt auf Kundenprojekt A.',
    buttons: [
      { label: 'Wochenrückblick', action: 'weekly_review' },
      { label: 'Zeitfresser erkennen', action: 'detect_time_wasters', variant: 'secondary' },
      { label: 'Projektzusammenfassung', action: 'project_summary', variant: 'secondary' }
    ]
  }
};

const getPanelView = (view: ViewKey): AiPanelView => {
  if (view === 'planner' || view === 'reports' || view === 'dashboard') return view;
  return 'kanban';
};

export const AiAssistantPanel = ({ view }: Props): JSX.Element => {
  const panelView = getPanelView(view);
  const content = panelContent[panelView];
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('Angebot Müller prüfen, Rückfrage Statik beantworten, Rechnung vorbereiten, Termin mit Bauherr abstimmen');
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const sessions = useSessionStore((state) => state.sessions);
  const { loading, error, requestSuggestion } = useAiStore();

  const runAction = (action: AiAction): void => {
    void requestSuggestion({
      action,
      text: text.trim() || undefined,
      tasks,
      projects,
      sessions
    });
  };

  if (!expanded) {
    return (
      <Panel className="py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles size={18} className="shrink-0 text-accent" />
            <div className="min-w-0">
              <h2 className="font-semibold leading-5">KI-Assistent</h2>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{content.note}</p>
            </div>
          </div>
          <Button className="px-2.5 py-1.5 text-xs" variant="secondary" onClick={() => setExpanded(true)}>
            <ChevronDown size={14} className="mr-1.5 inline" /> Öffnen
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="font-semibold">KI-Assistent</h2>
          </div>
          <Button className="px-2.5 py-1.5 text-xs" variant="secondary" onClick={() => setExpanded(false)}>
            <ChevronUp size={14} className="mr-1.5 inline" /> Einklappen
          </Button>
        </div>
        <div className="mb-3 rounded-md border border-line bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <p>{content.lead}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{content.note}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Vorschläge werden immer zuerst als Vorschau angezeigt. Es wird nichts automatisch gespeichert.
          </p>
        </div>
        <textarea
          className="min-h-24 w-full rounded-md border border-line p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          placeholder={content.placeholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {content.buttons.map((button) => (
            <Button key={button.action} variant={button.variant} disabled={loading} onClick={() => runAction(button.action)}>
              {button.label}
            </Button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Panel>
      <AiSuggestionPreview />
    </div>
  );
};
