import {
  AlertTriangle,
  BookOpen,
  Brain,
  CalendarDays,
  Database,
  KanbanSquare,
  KeyRound,
  ShieldCheck,
  Timer,
  Upload
} from 'lucide-react';
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
    text: 'Der Lizenzschlüssel wird unter Einstellungen eingegeben und lokal im Browser gespeichert. Gib Lizenz- oder KI-Zugangsdaten nur in die dafür vorgesehenen Bereiche ein.'
  },
  {
    icon: KeyRound,
    title: '8. KI-Zugang',
    text: 'Für KI-Funktionen kann ein Anthropic-Zugang erforderlich sein. Die Einrichtung erfolgt je nach gekaufter Version oder Bereitstellung über den Anbieter beziehungsweise Administrator.'
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
    <Panel>
      <h2 className="font-semibold">Erste Schritte</h2>
      <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2">
        <li>1. Lege eine Aufgabe an oder sammle Aufgaben in der Inbox.</li>
        <li>2. Ziehe wichtige Aufgaben nach Heute.</li>
        <li>3. Ziehe genau eine Aufgabe in die Fokus-Spalte.</li>
        <li>4. Starte den Pomodoro-Timer.</li>
        <li>5. Schließe die Session ab, damit Fokuszeit und Pomodoros gezählt werden.</li>
        <li>6. Exportiere regelmäßig JSON als Datensicherung.</li>
      </ol>
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
        <KanbanSquare className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">Kanban-Board bedienen</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Das Kanban-Board ist die zentrale Aufgabenübersicht. Karten können per Drag-and-drop
              zwischen den Spalten verschoben werden. Ein Klick auf eine Karte öffnet die Bearbeitung.
              Das Papierkorb-Symbol auf einer Karte löscht sie nach Bestätigung.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <p><span className="font-medium text-ink dark:text-slate-100">Inbox:</span> neue, noch nicht eingeplante Aufgaben.</p>
              <p><span className="font-medium text-ink dark:text-slate-100">Heute:</span> Aufgaben, die heute bearbeitet werden sollen.</p>
              <p><span className="font-medium text-ink dark:text-slate-100">Fokus:</span> genau eine aktive Aufgabe für den nächsten Pomodoro.</p>
              <p><span className="font-medium text-ink dark:text-slate-100">In Arbeit:</span> begonnene Aufgaben, die noch nicht fertig sind.</p>
              <p><span className="font-medium text-ink dark:text-slate-100">Wartend:</span> Aufgaben, die von Rückmeldung, Termin oder Zuarbeit abhängen.</p>
              <p><span className="font-medium text-ink dark:text-slate-100">Erledigt:</span> abgeschlossene Aufgaben, die archiviert werden können.</p>
            </div>
            <p>
              Die Angaben auf einer Karte bedeuten: Priorität, erledigte/geplante Pomodoros, Projekt
              und Tags. Beispiel: <span className="font-mono">medium · 0/2 Pomo · kalender</span>.
            </p>
            <p>
              Über Suche, Sortierung und die Ansicht <span className="font-medium">Kompakt/Normal</span> kannst du große Boards schneller eingrenzen.
              Die Filter zeigen unter anderem Heute, Kalender, Aufgaben ohne Projekt, hohe Priorität und archivierte Karten.
            </p>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <div className="flex items-start gap-3">
        <Timer className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">Pomodoro abschließen</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Beim Abschließen einer Session kannst du eine Notiz erfassen, einen Fokus-Score vergeben
              und die Fokus-Aufgabe optional direkt als erledigt markieren.
            </p>
            <p>
              Diese Zusatzdaten verbessern die Session-Historie, Reports und spätere KI-Auswertungen.
              Ohne aktive Fokus-Karte kann kein Pomodoro gestartet werden.
            </p>
            <p>
              Der Timer bietet drei Modi: <span className="font-medium">Fokus</span>,{' '}
              <span className="font-medium">Kurzpause</span> und <span className="font-medium">Langpause</span>.
              Pausen laufen ohne Kanban-Karte; Fokus-Sessions werden dagegen immer mit der aktiven Fokus-Karte verknüpft.
            </p>
          </div>
        </div>
      </div>
    </Panel>
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
              Die Vorschau ist nach Datum gruppiert. Dubletten werden gekennzeichnet. Mit{' '}
              <span className="font-medium">Nur #aufgabe übernehmen</span> kannst du bewusst nur markierte
              Aufgaben-Kandidaten importieren.
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
      <h2 className="font-semibold">Aufgabe oder Kalendertermin?</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2">Eintrag</th>
              <th>Bedeutung</th>
              <th>Empfehlung</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr className="border-t border-line dark:border-slate-800">
              <td className="py-2 font-medium">Kalendertermin</td>
              <td>Zeitblock oder Kontext</td>
              <td>Nicht automatisch übernehmen</td>
            </tr>
            <tr className="border-t border-line dark:border-slate-800">
              <td className="py-2 font-medium">#aufgabe im Termin</td>
              <td>Aufgaben-Kandidat</td>
              <td>In der Vorschau prüfen und gezielt übernehmen</td>
            </tr>
            <tr className="border-t border-line dark:border-slate-800">
              <td className="py-2 font-medium">Kanban-Karte</td>
              <td>Konkrete Arbeitseinheit</td>
              <td>Nach Heute/Fokus verschieben und mit Pomodoro bearbeiten</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
    <Panel>
      <div className="flex items-start gap-3">
        <Brain className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="font-semibold">KI-Zugang und KI-Leistungen</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Die KI-Funktionen können je nach Version einen eingerichteten Anthropic-Zugang
              benötigen. Falls die KI nicht bereits freigeschaltet ist, erhältst du die Zugangsdaten
              oder Einrichtungshinweise vom Anbieter der Anwendung.
            </p>
            <p>
              Die App sendet bei einer KI-Anfrage nur den ausgewählten Arbeitskontext, zum Beispiel
              offene Aufgaben oder eine markierte Beschreibung. Vorschläge werden anschließend in der
              App als Vorschau angezeigt.
            </p>
            <p>Mit dem KI-Assistenten sind in SMART Focus diese Leistungen verbunden:</p>
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
            <p>
              In der Vorschau kannst du einzelne vorgeschlagene Karten übernehmen, alle Karten übernehmen,
              Textvorschläge kopieren oder die Vorschau verwerfen.
            </p>
          </div>
        </div>
      </div>
    </Panel>
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel>
        <div className="flex items-start gap-3">
          <Database className="mt-1 text-accent" size={20} />
          <div>
            <h2 className="font-semibold">Lokale Daten und Sicherung</h2>
            <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <p>
                Aufgaben, Projekte, Sessions, Einstellungen und Lizenzschlüssel werden lokal im Browser
                in IndexedDB gespeichert. Sie sind an diesen Browser und dieses Benutzerprofil gebunden.
              </p>
              <p>
                Wenn Browserdaten gelöscht werden, können lokale Daten verloren gehen. Nutze deshalb
                regelmäßig den JSON-Export als vollständige Sicherung.
              </p>
              <p>
                JSON ist die Datensicherung der App. ICS ist nur ein Kalenderimport und ersetzt keine
                vollständige Sicherung.
              </p>
              <p>
                Beim Export merkt sich SMART Focus im Browser den Zeitpunkt der letzten JSON-Sicherung.
                Das Löschen aller Aufgaben muss zusätzlich durch Eingabe von <span className="font-mono">LÖSCHEN</span> bestätigt werden.
              </p>
            </div>
          </div>
        </div>
      </Panel>
      <Panel>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 text-accent" size={20} />
          <div>
            <h2 className="font-semibold">Datenschutz und Grenzen</h2>
            <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <p>
                Ohne KI-Aufruf bleiben Arbeitsdaten lokal im Browser. Beim KI-Aufruf wird nur der
                ausgewählte Arbeitskontext an den KI-Dienst gesendet.
              </p>
              <p>
                Der Lizenzschlüssel wird aktuell lokal gespeichert. Eine Online-Aktivierung oder
                Serverprüfung ist noch nicht implementiert.
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
    <Panel>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 text-warn" size={22} />
        <div>
          <h2 className="font-semibold">Fehlerbehebung</h2>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2">
            <div>
              <p className="font-medium text-ink dark:text-slate-100">Die Seite wirkt leer</p>
              <p>Seite neu laden. Falls das nicht hilft, Browser-Tab schließen und SMART Focus erneut öffnen.</p>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-slate-100">KI antwortet nicht</p>
              <p>Internetverbindung prüfen und später erneut versuchen. Bereits vorhandene Aufgaben bleiben erhalten.</p>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-slate-100">Pomodoro startet nicht</p>
              <p>Eine Aufgabe in die Fokus-Spalte ziehen. Die Fokus-Spalte darf nur eine Karte enthalten.</p>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-slate-100">Kalenderdaten mehrfach importiert</p>
              <p>Import/Export öffnen und den Button „Alle Kalender-Einträge löschen“ verwenden.</p>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-slate-100">Aufgabe ist falsch einsortiert</p>
              <p>Die Karte per Drag-and-drop in die passende Spalte ziehen oder die Karte öffnen und bearbeiten.</p>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-slate-100">Daten fehlen nach Browserwechsel</p>
              <p>JSON-Sicherung importieren. Lokale Daten sind an den jeweiligen Browser gebunden.</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <h2 className="font-semibold">Empfohlener Ablauf</h2>
      <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2">
        <li>1. Aufgaben in der Inbox sammeln oder per KI vorschlagen lassen.</li>
        <li>2. Aufgaben im Kanban suchen, filtern und priorisieren.</li>
        <li>3. Wichtige Aufgaben nach Heute ziehen.</li>
        <li>4. Genau eine Aufgabe in Fokus legen.</li>
        <li>5. Pomodoro starten und mit Notiz/Fokus-Score abschließen.</li>
        <li>6. Reports nach Zeitraum auswerten und regelmäßig JSON sichern.</li>
      </ol>
    </Panel>
  </div>
);
