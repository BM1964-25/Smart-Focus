import type { Priority, TaskCard } from '../types/domain';
import { createId, nowIso } from '../utils/id';

export interface CalendarEventPreview {
  id: string;
  title: string;
  description: string;
  location?: string;
  start?: string;
  end?: string;
  estimatedPomodoros: number;
  priority: Priority;
  tags: string[];
}

export interface CalendarImportPreview {
  valid: boolean;
  errors: string[];
  events: CalendarEventPreview[];
}

const unfoldIcsLines = (text: string): string[] =>
  text
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .split('\n')
    .reduce<string[]>((lines, line) => {
      if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
        lines[lines.length - 1] += line.slice(1);
        return lines;
      }
      lines.push(line);
      return lines;
    }, []);

const unescapeIcsText = (value: string): string =>
  value
    .replaceAll('\\n', '\n')
    .replaceAll('\\N', '\n')
    .replaceAll('\\,', ',')
    .replaceAll('\\;', ';')
    .replaceAll('\\\\', '\\')
    .trim();

const getPropertyName = (line: string): string => line.split(':', 1)[0].split(';', 1)[0].toUpperCase();

const getPropertyValue = (line: string): string => {
  const index = line.indexOf(':');
  return index >= 0 ? line.slice(index + 1) : '';
};

const parseIcsDate = (raw: string): string | undefined => {
  if (!raw) return undefined;
  const value = raw.trim();
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (dateOnly) {
    return new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T09:00:00`).toISOString();
  }
  const dateTime = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (!dateTime) return undefined;
  const [, year, month, day, hour, minute, second, utc] = dateTime;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${utc ? 'Z' : ''}`;
  return new Date(iso).toISOString();
};

const estimatePomodoros = (start?: string, end?: string): number => {
  if (!start || !end) return 1;
  const minutes = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000));
  return Math.max(1, Math.min(8, Math.ceil(minutes / 25)));
};

export const parseIcsCalendar = (text: string): CalendarImportPreview => {
  const lines = unfoldIcsLines(text);
  const events: CalendarEventPreview[] = [];
  const errors: string[] = [];
  let current: Record<string, string> | undefined;

  for (const line of lines) {
    const property = getPropertyName(line);
    if (property === 'BEGIN' && getPropertyValue(line).toUpperCase() === 'VEVENT') {
      current = {};
      continue;
    }
    if (property === 'END' && getPropertyValue(line).toUpperCase() === 'VEVENT') {
      if (current) {
        const title = unescapeIcsText(current.SUMMARY ?? '');
        if (!title) {
          errors.push('Ein Kalendertermin ohne Titel wurde übersprungen.');
        } else {
          const start = parseIcsDate(current.DTSTART ?? '');
          const end = parseIcsDate(current.DTEND ?? '');
          const location = unescapeIcsText(current.LOCATION ?? '');
          const description = [unescapeIcsText(current.DESCRIPTION ?? ''), location ? `Ort: ${location}` : '']
            .filter(Boolean)
            .join('\n');
          events.push({
            id: current.UID || createId('calendar'),
            title,
            description,
            location: location || undefined,
            start,
            end,
            estimatedPomodoros: estimatePomodoros(start, end),
            priority: 'medium',
            tags: ['kalender']
          });
        }
      }
      current = undefined;
      continue;
    }
    if (!current) continue;
    const propertyName = getPropertyName(line);
    if (['UID', 'SUMMARY', 'DESCRIPTION', 'LOCATION', 'DTSTART', 'DTEND'].includes(propertyName)) {
      current[propertyName] = getPropertyValue(line);
    }
  }

  if (!text.includes('BEGIN:VCALENDAR')) errors.push('Die Datei sieht nicht wie ein ICS-Kalender aus.');
  if (events.length === 0) errors.push('Keine importierbaren Kalendertermine gefunden.');

  return {
    valid: events.length > 0,
    errors,
    events
  };
};

export const calendarEventToTask = (event: CalendarEventPreview): TaskCard => {
  const timestamp = nowIso();
  return {
    id: createId('task'),
    title: event.title,
    description: event.description,
    status: 'inbox',
    priority: event.priority,
    estimatedPomodoros: event.estimatedPomodoros,
    completedPomodoros: 0,
    tags: event.tags,
    dueDate: event.start,
    createdAt: timestamp,
    updatedAt: timestamp,
    archived: false
  };
};
