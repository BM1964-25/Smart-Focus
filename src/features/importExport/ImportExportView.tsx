import { CalendarPlus, Download, Info, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import {
  calendarEventToTask,
  parseIcsCalendar,
  type CalendarImportPreview
} from '../../services/calendarImportService';
import {
  createExport,
  importData,
  parseJsonImport,
  validateImport,
  type ImportPreview
} from '../../services/exportImportService';
import { useTaskStore } from '../../stores/taskStore';
import type { ImportMode } from '../../types/domain';

type CalendarRangePreset = 'all' | 'today' | 'next7' | 'thisWeek' | 'nextWeek' | 'custom';

const isTaskCandidate = (event: { title: string; description: string }): boolean =>
  event.title.toLowerCase().includes('#aufgabe') || event.description.toLowerCase().includes('#aufgabe');

const calendarKey = (event: { title: string; start?: string }): string => `${event.title}__${event.start ?? ''}`;

const dateGroupLabel = (dateIso?: string): string =>
  dateIso ? new Date(dateIso).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Ohne Datum';

const downloadJson = (payload: unknown): void => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `time-manager-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const ImportExportView = (): JSX.Element => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<ImportPreview>();
  const [mode, setMode] = useState<ImportMode>('append');
  const [message, setMessage] = useState('');
  const [calendarPreview, setCalendarPreview] = useState<CalendarImportPreview>();
  const [selectedCalendarEventIds, setSelectedCalendarEventIds] = useState<string[]>([]);
  const [calendarRangePreset, setCalendarRangePreset] = useState<CalendarRangePreset>('next7');
  const [calendarRangeStart, setCalendarRangeStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [calendarRangeEnd, setCalendarRangeEnd] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
  });
  const [lastBackupAt, setLastBackupAt] = useState(() => localStorage.getItem('smart-focus:last-json-export') ?? '');
  const createTasks = useTaskStore((state) => state.createTasks);
  const deleteTasks = useTaskStore((state) => state.deleteTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const calendarImportedTasks = useMemo(
    () => tasks.filter((task) => task.tags.includes('kalender')),
    [tasks]
  );

  const calendarRange = useMemo(() => {
    const startOfDay = (date: Date): Date => {
      const next = new Date(date);
      next.setHours(0, 0, 0, 0);
      return next;
    };
    const endOfDay = (date: Date): Date => {
      const next = new Date(date);
      next.setHours(23, 59, 59, 999);
      return next;
    };
    const today = startOfDay(new Date());
    const rangeEnd = new Date(today);

    if (calendarRangePreset === 'all') return undefined;
    if (calendarRangePreset === 'today') return { start: today, end: endOfDay(today) };
    if (calendarRangePreset === 'next7') {
      rangeEnd.setDate(today.getDate() + 7);
      return { start: today, end: endOfDay(rangeEnd) };
    }
    if (calendarRangePreset === 'thisWeek') {
      const start = new Date(today);
      const mondayOffset = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - mondayOffset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end: endOfDay(end) };
    }
    if (calendarRangePreset === 'nextWeek') {
      const start = new Date(today);
      const mondayOffset = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - mondayOffset + 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end: endOfDay(end) };
    }

    return {
      start: startOfDay(new Date(`${calendarRangeStart}T00:00:00`)),
      end: endOfDay(new Date(`${calendarRangeEnd}T00:00:00`))
    };
  }, [calendarRangeEnd, calendarRangePreset, calendarRangeStart]);

  const visibleCalendarEvents = useMemo(() => {
    const events = calendarPreview?.events ?? [];
    if (!calendarRange) return events;
    return events.filter((event) => {
      if (!event.start) return false;
      const eventStart = new Date(event.start);
      return eventStart >= calendarRange.start && eventStart <= calendarRange.end;
    });
  }, [calendarPreview?.events, calendarRange]);

  const existingCalendarKeys = useMemo(
    () =>
      new Set(
        tasks
          .filter((task) => task.tags.includes('kalender'))
          .map((task) => `${task.title}__${task.dueDate ?? ''}`)
      ),
    [tasks]
  );

  const groupedCalendarEvents = useMemo(() => {
    const groups = new Map<string, typeof visibleCalendarEvents>();
    for (const event of visibleCalendarEvents) {
      const label = dateGroupLabel(event.start);
      groups.set(label, [...(groups.get(label) ?? []), event]);
    }
    return [...groups.entries()];
  }, [visibleCalendarEvents]);

  const previewImport = async (): Promise<void> => {
    try {
      setPreview(await validateImport(parseJsonImport(text)));
      setMessage('');
    } catch (error) {
      setPreview({
        valid: false,
        errors: [error instanceof Error ? error.message : 'JSON konnte nicht gelesen werden'],
        duplicateIds: [],
        counts: { projects: 0, tasks: 0, sessions: 0 }
      });
    }
  };

  const applyImport = async (): Promise<void> => {
    if (!preview?.data) return;
    await importData(preview.data, mode);
    setMessage('Import abgeschlossen. Bei vollständigem Überschreiben wurde vorher ein lokales Backup erzeugt.');
  };

  const previewCalendarFile = async (file?: File): Promise<void> => {
    if (!file) return;
    const parsed = parseIcsCalendar(await file.text());
    setCalendarPreview(parsed);
    setSelectedCalendarEventIds([]);
    setMessage('');
  };

  const toggleCalendarEvent = (eventId: string): void => {
    setSelectedCalendarEventIds((current) =>
      current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId]
    );
  };

  const importSelectedCalendarEvents = async (): Promise<void> => {
    const selectedEvents = visibleCalendarEvents.filter((event) =>
      selectedCalendarEventIds.includes(event.id)
    );
    const newEvents = selectedEvents.filter(
      (event) => !existingCalendarKeys.has(calendarKey(event))
    );
    await createTasks(newEvents.map(calendarEventToTask));
    const skipped = selectedEvents.length - newEvents.length;
    setMessage(
      `${newEvents.length} ausgewählte Kalendertermine wurden als Aufgaben in die Inbox übernommen.${skipped > 0 ? ` ${skipped} bereits vorhandene Termine wurden übersprungen.` : ''}`
    );
  };

  const importTaskCandidateEvents = async (): Promise<void> => {
    const candidates = visibleCalendarEvents.filter(isTaskCandidate);
    const newEvents = candidates.filter((event) => !existingCalendarKeys.has(calendarKey(event)));
    await createTasks(newEvents.map(calendarEventToTask));
    const skipped = candidates.length - newEvents.length;
    setMessage(
      `${newEvents.length} #aufgabe-Termine wurden als Aufgaben übernommen.${skipped > 0 ? ` ${skipped} Dubletten wurden übersprungen.` : ''}`
    );
  };

  const importSingleCalendarEvent = async (eventId: string): Promise<void> => {
    const event = visibleCalendarEvents.find((item) => item.id === eventId);
    if (!event) return;
    const alreadyExists = tasks.some(
      (task) =>
        task.tags.includes('kalender') &&
        calendarKey({ title: task.title, start: task.dueDate }) === calendarKey(event)
    );
    if (alreadyExists) {
      setMessage('Dieser Kalendertermin ist bereits als Aufgabe vorhanden.');
      return;
    }
    await createTasks([calendarEventToTask(event)]);
    setSelectedCalendarEventIds((current) => current.filter((id) => id !== eventId));
    setMessage(`"${event.title}" wurde als Aufgabe in die Inbox übernommen.`);
  };

  const deleteCalendarEntries = async (): Promise<void> => {
    if (calendarImportedTasks.length === 0) {
      setMessage('Es gibt aktuell keine Kalender-Einträge zum Löschen.');
      return;
    }
    const confirmed = window.confirm(
      `${calendarImportedTasks.length} Kalender-Einträge aus der Aufgabenliste löschen? Andere Aufgaben bleiben erhalten.`
    );
    if (!confirmed) return;
    await deleteTasks(calendarImportedTasks.map((task) => task.id));
    setMessage(`${calendarImportedTasks.length} Kalender-Einträge wurden gelöscht.`);
  };

  const deleteAllTasks = async (): Promise<void> => {
    if (tasks.length === 0) {
      setMessage('Es gibt aktuell keine Aufgaben zum Löschen.');
      return;
    }
    const confirmation = window.prompt(
      `${tasks.length} Aufgaben löschen? Bestehende Pomodoro-Sessions bleiben im Verlauf erhalten.\n\nBitte LÖSCHEN eingeben, um fortzufahren.`
    );
    if (confirmation !== 'LÖSCHEN') {
      setMessage('Löschen abgebrochen. Es wurden keine Aufgaben entfernt.');
      return;
    }
    await deleteTasks(tasks.map((task) => task.id));
    setMessage(`${tasks.length} Aufgaben wurden gelöscht.`);
  };

  const exportBackup = async (): Promise<void> => {
    const payload = await createExport();
    downloadJson(payload);
    const timestamp = new Date().toISOString();
    localStorage.setItem('smart-focus:last-json-export', timestamp);
    setLastBackupAt(timestamp);
    setMessage('JSON-Datensicherung wurde erstellt.');
  };

  const backupAgeDays = lastBackupAt
    ? Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 86_400_000)
    : undefined;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Import und Export</h1>
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Lokale Datensicherung</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lastBackupAt
                ? `Letzter JSON-Export: ${new Date(lastBackupAt).toLocaleString()}${backupAgeDays !== undefined && backupAgeDays > 6 ? ' - Sicherung empfohlen.' : ''}`
                : 'Noch keine JSON-Sicherung in diesem Browser erfasst.'}
            </p>
          </div>
        <Button onClick={() => void exportBackup()}>
          <Download size={16} className="mr-2 inline" /> Vollständige Datensicherung exportieren
        </Button>
        </div>
      </Panel>
      <Panel>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Kalender aus ICS-Datei importieren</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Termine lokal als Planungskontext prüfen. Es wird nichts automatisch als Aufgabe gespeichert.
            </p>
          </div>
          <CalendarPlus className="text-accent" size={20} />
        </div>
        <div className="mb-3 flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100">
          <Info className="mt-0.5 shrink-0" size={16} />
          <p>
            Kalendertermine sind zunächst nur <span className="font-medium">Planungskontext</span>. Sie werden erst zu
            Kanban-Aufgaben, wenn du sie bewusst auswählst und übernimmst. Termine mit{' '}
            <span className="font-mono">#aufgabe</span> sind Aufgaben-Kandidaten und sollten bevorzugt geprüft werden.
          </p>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button
            disabled={calendarImportedTasks.length === 0}
            variant="secondary"
            onClick={() => void deleteCalendarEntries()}
          >
            <Trash2 size={16} className="mr-2 inline" /> Alle Kalender-Einträge löschen
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {calendarImportedTasks.length} importierte Kalender-Einträge vorhanden
          </span>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button disabled={tasks.length === 0} variant="danger" onClick={() => void deleteAllTasks()}>
            <Trash2 size={16} className="mr-2 inline" /> Alle Aufgaben löschen
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Entfernt auch alte importierte Überschriften aus Dashboard und Tagesplanung.
          </span>
        </div>
        <div className="mb-3 grid gap-3 rounded-md border border-line bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950 lg:grid-cols-[220px_1fr]">
          <label className="text-sm">
            Zeitraum
            <select
              className="mt-1 w-full rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={calendarRangePreset}
              onChange={(event) => setCalendarRangePreset(event.target.value as CalendarRangePreset)}
            >
              <option value="all">Alle Termine</option>
              <option value="today">Heute</option>
              <option value="next7">Nächste 7 Tage</option>
              <option value="thisWeek">Diese Woche</option>
              <option value="nextWeek">Nächste Woche</option>
              <option value="custom">Eigener Bereich</option>
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Von
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:disabled:bg-slate-800"
                disabled={calendarRangePreset !== 'custom'}
                type="date"
                value={calendarRangeStart}
                onChange={(event) => setCalendarRangeStart(event.target.value)}
              />
            </label>
            <label className="text-sm">
              Bis
              <input
                className="mt-1 w-full rounded-md border border-line px-3 py-2 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:disabled:bg-slate-800"
                disabled={calendarRangePreset !== 'custom'}
                type="date"
                value={calendarRangeEnd}
                onChange={(event) => setCalendarRangeEnd(event.target.value)}
              />
            </label>
          </div>
        </div>
        <input
          accept=".ics,text/calendar"
          className="block w-full rounded-md border border-line px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950 dark:file:bg-slate-100 dark:file:text-slate-950"
          type="file"
          onChange={(event) => void previewCalendarFile(event.target.files?.[0])}
        />
        {calendarPreview && (
          <div className="mt-4 rounded-md bg-slate-50 p-3 dark:bg-slate-950">
            {calendarPreview.errors.map((error) => (
              <p
                className={calendarPreview.valid ? 'text-sm text-warn' : 'text-sm text-red-600'}
                key={error}
              >
                {error}
              </p>
            ))}
            {calendarPreview.valid && (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {calendarPreview.events.length} Termine erkannt, {visibleCalendarEvents.length} im Zeitraum,{' '}
                    {visibleCalendarEvents.filter((event) => selectedCalendarEventIds.includes(event.id)).length}{' '}
                    ausgewählt.
                  </p>
                  <Button
                    disabled={
                      visibleCalendarEvents.filter((event) => selectedCalendarEventIds.includes(event.id))
                        .length === 0
                    }
                    onClick={() => void importSelectedCalendarEvents()}
                  >
                    Ausgewählte als Aufgaben übernehmen
                  </Button>
                  <Button
                    disabled={visibleCalendarEvents.filter(isTaskCandidate).length === 0}
                    variant="secondary"
                    onClick={() => void importTaskCandidateEvents()}
                  >
                    Nur #aufgabe übernehmen
                  </Button>
                </div>
                <div className="max-h-80 space-y-2 overflow-auto pr-1">
                  {groupedCalendarEvents.map(([date, events]) => (
                    <div className="space-y-2" key={date}>
                      <h3 className="sticky top-0 z-10 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        {date}
                      </h3>
                      {events.map((event) => {
                        const duplicate = existingCalendarKeys.has(calendarKey(event));
                        return (
                          <div
                            className="flex gap-3 rounded-md border border-line bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            key={event.id}
                          >
                            <input
                              checked={selectedCalendarEventIds.includes(event.id)}
                              className="mt-1"
                              type="checkbox"
                              onChange={() => toggleCalendarEvent(event.id)}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{event.title}</span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                  Kalender-Kontext
                                </span>
                                {isTaskCandidate(event) && (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    #aufgabe
                                  </span>
                                )}
                                {duplicate && (
                                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                    Dublette
                                  </span>
                                )}
                              </span>
                              <span className="mt-1 block text-slate-500 dark:text-slate-400">
                                {event.start ? new Date(event.start).toLocaleString() : 'Ohne Datum'} ·{' '}
                                {event.estimatedPomodoros} Pomodoro
                              </span>
                              {event.description && (
                                <span className="mt-1 line-clamp-2 block text-slate-500 dark:text-slate-400">
                                  {event.description}
                                </span>
                              )}
                            </span>
                            <Button
                              className="self-start"
                              disabled={duplicate}
                              variant="secondary"
                              onClick={() => void importSingleCalendarEvent(event.id)}
                            >
                              Als Kanban-Aufgabe
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {visibleCalendarEvents.length === 0 && (
                    <p className="rounded-md border border-dashed border-line p-4 text-center text-sm text-slate-500 dark:border-slate-700">
                      Keine Termine im gewählten Zeitraum.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Panel>
      <Panel>
        <h2 className="mb-3 font-semibold">JSON-Import mit Vorschau</h2>
        <textarea
          className="min-h-56 w-full rounded-md border border-line p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-950"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="JSON-Export hier einfügen"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            value={mode}
            onChange={(event) => setMode(event.target.value as ImportMode)}
          >
            <option value="append">Daten ergänzen</option>
            <option value="replace">Vollständig überschreiben</option>
            <option value="projectsAndTasks">Nur Projekte und Aufgaben</option>
          </select>
          <Button variant="secondary" onClick={() => void previewImport()}>
            <Upload size={16} className="mr-2 inline" /> Vorschau prüfen
          </Button>
          <Button onClick={() => void applyImport()} disabled={!preview?.valid}>
            Import übernehmen
          </Button>
        </div>
        {preview && (
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
            {preview.valid ? (
              <p>
                {preview.counts.projects} Projekte, {preview.counts.tasks} Aufgaben,{' '}
                {preview.counts.sessions} Sessions. Dubletten: {preview.duplicateIds.length}
              </p>
            ) : (
              preview.errors.map((error) => (
                <p className="text-red-600" key={error}>
                  {error}
                </p>
              ))
            )}
          </div>
        )}
        {message && <p className="mt-3 text-sm text-success">{message}</p>}
      </Panel>
    </div>
  );
};
