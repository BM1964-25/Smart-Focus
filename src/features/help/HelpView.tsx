import { BookOpen, Brain, CalendarDays, Database, KanbanSquare, KeyRound, Timer, Upload } from 'lucide-react';
import { Panel } from '../../components/ui';

const sections = [
  {
    icon: KanbanSquare,
    title: '1. Aufgabenlogik',
    text: 'SMART Focus trennt Aufgaben nach Status: Inbox, Heute, Fokus, In Arbeit, Wartend und Erledigt. Die Fokus-Spalte darf genau eine aktive Karte enthalten. Dadurch ist immer klar, woran gerade gearbeitet wird.'
  },
  {
    icon: Timer,
    title: '2. Pomodoro',
    text: 'Ein Pomodoro kann nur gestartet werden, wenn eine Karte in Fokus liegt. Jede abgeschlossene Fokus-Session wird automatisch mit dieser Karte verknüpft und erhöht die erledigten Pomodoros der Aufgabe.'
  },
  {
    icon: CalendarDays,
    title: '3. Tagesplanung',
    text: 'Die Tagesplanung zeigt Aufgaben für Heute, überfällige Aufgaben und offene Aufgaben. Über die Schnellaktionen kannst du Aufgaben nach Heute oder direkt in Fokus verschieben.'
  },
  {
    icon: Upload,
    title: '4. Kalenderimport',
    text: 'ICS-Kalenderdateien werden zuerst nur als Planungskontext angezeigt. Es wird nichts automatisch gespeichert. Kalendertermine sind Zeitblöcke, aber nicht automatisch Aufgaben. Erst wenn du einzelne Termine oder ausgewählte Termine ausdrücklich übernimmst, werden daraus Kanban-Karten.'
  },
  {
    icon: Brain,
    title: '5. KI-Assistent',
    text: 'Der KI-Assistent kann Text in Karten umwandeln, Aufgaben priorisieren, Tagespläne vorschlagen und Rückblicke formulieren. Vorschläge werden immer zuerst als Vorschau angezeigt und nie automatisch gespeichert.'
  },
  {
    icon: Database,
    title: '6. Daten und Backup',
    text: 'Alle Arbeitsdaten liegen lokal im Browser in IndexedDB. JSON-Export erzeugt eine vollständige Datensicherung. Beim vollständigen JSON-Import wird vorher automatisch ein lokales Backup angelegt.'
  },
  {
    icon: KeyRound,
    title: '7. Lizenz und Sicherheit',
    text: 'Der Lizenzschlüssel wird unter Einstellungen eingegeben und lokal im Browser gespeichert. Der Anthropic API-Key gehört niemals ins Frontend, sondern nur in den Backend-Proxy über ANTHROPIC_API_KEY.'
  },
  {
    icon: KeyRound,
    title: '8. Anthropic API',
    text: 'Die KI-Funktionen nutzen die Anthropic Messages API über einen Backend-Proxy. Dafür wird ein Anthropic-Konto mit API-Key benötigt. Der Schlüssel wird serverseitig als ANTHROPIC_API_KEY hinterlegt und darf nicht in den Browser oder in GitHub Pages eingetragen werden.'
  }
];

export const HelpView = (): JSX.Element => (
  <div className="space-y-5">
    <div>
      <h1 className="text-2xl font-semibold">Hilfe</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Bedienungsanleitung und Arbeitslogik von SMART Focus.
      </p>
    </div>
    <Panel>
      <div className="flex items-start gap-3">
        <BookOpen className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">Grundprinzip</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Die App verbindet Kanban, Tagesplanung und Pomodoro. Aufgaben werden zuerst gesammelt,
            dann priorisiert und schließlich über eine einzelne Fokus-Karte abgearbeitet. Reporting
            zeigt nur tatsächlich abgeschlossene Fokuszeit, nicht bloße Kalendereinträge.
          </p>
        </div>
      </div>
    </Panel>
    <div className="grid gap-4 xl:grid-cols-2">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Panel key={section.title}>
            <div className="flex items-start gap-3">
              <Icon className="mt-1 text-accent" size={20} />
              <div>
                <h2 className="font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.text}</p>
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
    <Panel>
      <div className="flex items-start gap-3">
        <Upload className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">Kalenderimport und #aufgabe</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Beim Import einer ICS-Datei liest SMART Focus Termine aus Apple Kalender, Outlook oder
              Google Calendar. Diese Termine erscheinen zunächst nur in einer Vorschau. Sie werden
              nicht automatisch ins Kanban übernommen, damit Meetings, Arzttermine oder private
              Zeitblöcke nicht fälschlich als Aufgaben erscheinen.
            </p>
            <p>
              Die Besonderheit von <span className="font-mono">#aufgabe</span>: Wenn du im Kalender
              einen Termin bewusst als Aufgabe markieren willst, kannst du den Begriff{' '}
              <span className="font-mono">#aufgabe</span> im Titel oder in der Beschreibung verwenden.
              Solche Termine sind fachlich Aufgaben-Kandidaten. Sie sollten in der Vorschau geprüft
              und dann gezielt mit <span className="font-medium">Als Aufgabe</span> oder{' '}
              <span className="font-medium">Ausgewählte als Aufgaben übernehmen</span> in die Inbox
              übernommen werden.
            </p>
            <p>
              Beispiel: <span className="font-mono">#aufgabe Angebot Müller prüfen</span> ist eine
              echte Aufgabe. <span className="font-mono">Termin Bauherr 10:00</span> ist dagegen
              zunächst nur ein Kalenderblock und bleibt Kontext, bis du ihn ausdrücklich übernimmst.
            </p>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <div className="flex items-start gap-3">
        <Brain className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">Anthropic API und KI-Leistungen</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Für die KI-Funktionen wird ein Anthropic-Konto benötigt. Nach der Anmeldung bei Anthropic
              wird im Anthropic Console-Bereich ein API-Key erzeugt. Dieser Schlüssel gehört nicht in
              die App-Oberfläche und nicht in GitHub Pages, sondern ausschließlich in den Backend-Proxy
              als Umgebungsvariable <span className="font-mono">ANTHROPIC_API_KEY</span>.
            </p>
            <p>
              Die Browser-App sendet nur den ausgewählten Arbeitskontext an den lokalen oder gehosteten
              Backend-Endpunkt <span className="font-mono">/api/ai</span>. Der Backend-Proxy ruft danach
              serverseitig die Anthropic Messages API auf. Dadurch bleibt der API-Key vor dem Browser
              verborgen.
            </p>
            <p>Mit der API sind in SMART Focus diese Leistungen verbunden:</p>
            <ul className="grid gap-1 md:grid-cols-2">
              <li>Freitext in Kanban-Karten umwandeln</li>
              <li>Aufgaben priorisieren</li>
              <li>Pomodoro-Schätzungen vorschlagen</li>
              <li>Tagesplan aus offenen Karten erzeugen</li>
              <li>Wochenrückblick formulieren</li>
              <li>Zeitfresser aus Sessions erkennen</li>
              <li>Fokus-Empfehlungen geben</li>
              <li>Kartenbeschreibungen verbessern</li>
              <li>Aufgaben in kleinere Schritte zerlegen</li>
              <li>Projektzusammenfassungen erstellen</li>
            </ul>
            <p>
              Wichtig: KI-Vorschläge werden immer als Vorschau angezeigt. Es wird nichts automatisch
              gespeichert, bis du einen Vorschlag bewusst übernimmst.
            </p>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <h2 className="font-semibold">Empfohlener Ablauf</h2>
      <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2">
        <li>1. Aufgaben in der Inbox sammeln oder per KI vorschlagen lassen.</li>
        <li>2. Wichtige Aufgaben nach Heute ziehen.</li>
        <li>3. Genau eine Aufgabe in Fokus legen.</li>
        <li>4. Pomodoro starten und nach Abschluss speichern.</li>
        <li>5. Erledigte Karten abschließen oder archivieren.</li>
        <li>6. Reporting und Export regelmäßig zur Sicherung nutzen.</li>
      </ol>
    </Panel>
  </div>
);
