import { describe, expect, it } from 'vitest';
import { calendarEventToTask, parseIcsCalendar } from '../services/calendarImportService';

const sampleIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SMART Focus//Test//DE
BEGIN:VEVENT
UID:event-1
DTSTART:20260518T080000Z
DTEND:20260518T084500Z
SUMMARY:Termin mit Bauherr abstimmen
DESCRIPTION:Rückfragen und nächste Schritte klären
LOCATION:Online
END:VEVENT
BEGIN:VEVENT
UID:event-2
DTSTART;VALUE=DATE:20260519
SUMMARY:Rechnung vorbereiten
END:VEVENT
END:VCALENDAR`;

describe('calendar import', () => {
  it('parses ICS events into preview items', () => {
    const preview = parseIcsCalendar(sampleIcs);
    expect(preview.valid).toBe(true);
    expect(preview.events).toHaveLength(2);
    expect(preview.events[0].title).toBe('Termin mit Bauherr abstimmen');
    expect(preview.events[0].estimatedPomodoros).toBe(2);
    expect(preview.events[0].description).toContain('Ort: Online');
  });

  it('maps calendar events to inbox tasks', () => {
    const event = parseIcsCalendar(sampleIcs).events[0];
    const task = calendarEventToTask(event);
    expect(task.status).toBe('inbox');
    expect(task.dueDate).toBe(event.start);
    expect(task.tags).toContain('kalender');
  });
});
