# SMART Focus

Deep Work & Productivity System.

SMART Focus ist eine browserbasierte Einzelplatz-Web-App fuer professionelles Zeitmanagement. Die App verbindet Kanban, Pomodoro, Tagesplanung, Reporting, Kalenderimport, JSON-Datensicherung und KI-Unterstuetzung ueber einen sicheren Anthropic-Backend-Proxy.

## Start

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://127.0.0.1:5173`  
Backend-Proxy: `http://127.0.0.1:8787`

## Befehle

```bash
npm run dev       # Vite + Express-Proxy
npm run dev:client
npm run dev:server
npm run build     # TypeScript + Produktionsbuild
npm run preview
npm run lint
npm run test
npm run format
```

## Funktionsumfang

- Dashboard mit Fokuszeit, Pomodoros, erledigten Karten, Unterbrechungen und Trend.
- Kanban-Board mit Inbox, Heute, Fokus, In Arbeit, Wartend und Erledigt.
- Fokus-Spalte mit maximal einer aktiven Karte.
- Kanban-Suche, Filter, Sortierung und Kompakt/Normal-Ansicht.
- Pomodoro-Timer mit analogem Fortschrittsring und digitaler Restzeit.
- Fokus-, Kurzpause- und Langpause-Modus.
- Wiederherstellung laufender oder pausierter Pomodoro-Sessions nach Reload.
- Abschlussdialog mit Session-Notiz, Fokus-Score und optionalem Erledigt-Markieren.
- Tagesplanung mit Heute, Ueberfaellig und offenen Aufgaben.
- Reports mit Zeitraumfilter und CSV-Export.
- ICS-Kalenderimport mit Zeitraumwahl, Datum-Gruppierung, Dublettenhinweis und `#aufgabe`-Uebernahme.
- Vollstaendiger versionierter JSON-Export und validierter JSON-Import.
- Lokale Datensicherungshinweise und Schutzabfrage beim Loeschen aller Aufgaben.
- KI-Assistent mit kontextabhaengigen Vorschlaegen und manueller Vorschau-Uebernahme.
- Einstellungen fuer Timer, Theme, Benachrichtigungen, Ton, Lizenz, KI-Status, Projekte und Tags.

## Datenhaltung

SMART Focus speichert lokale Arbeitsdaten im Browser per IndexedDB. UI-Komponenten greifen nicht direkt auf IndexedDB zu, sondern verwenden Repository-Klassen unter `src/repositories`.

Die Browser-App nutzt SQLite nicht als Hauptspeicher. Fuer eine spaetere Tauri- oder Electron-Version kann eine SQLite-Implementierung hinter den Repository-Grenzen ergaenzt werden.

## Import und Export

Der JSON-Export ist versioniert und dient als vollstaendige Datensicherung:

```json
{
  "schemaVersion": "1.0.0",
  "exportedAt": "2026-05-17T10:00:00.000Z",
  "app": "Pomodoro Kanban Time Manager",
  "projects": [],
  "tasks": [],
  "sessions": [],
  "tags": [],
  "settings": {}
}
```

Beim vollstaendigen Import wird vorher automatisch ein lokales Backup erzeugt. Der Import validiert Pflichtfelder, Schema-Version und Dubletten.

## Kalenderimport

ICS-Dateien werden zuerst als Vorschau gelesen. Kalendertermine sind Planungskontext und werden erst nach bewusster Uebernahme zu Kanban-Karten.

Besonderheit: Termine mit `#aufgabe` im Titel oder in der Beschreibung werden als Aufgaben-Kandidaten markiert und koennen gezielt uebernommen werden.

## Anthropic KI

Der Anthropic API-Key darf nie im Frontend landen. KI-Aufrufe laufen ueber den Express-Proxy:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
AI_PROXY_PORT=8787
CLIENT_ORIGIN=http://127.0.0.1:5173
```

Das Frontend sendet nur den konkreten Arbeitskontext an `/api/ai`. Der Backend-Service validiert Requests und Antworten mit Zod und ruft serverseitig die Anthropic Messages API auf.

## Architektur

- `src/app`: App-Komposition und View-Routing.
- `src/components`: Shell, Sidebar und generische UI-Bausteine.
- `src/features`: Fachmodule fuer Kanban, Pomodoro, Dashboard, Reports, Import/Export, KI, Settings und Hilfe.
- `src/stores`: Zustand-Stores nach Domaene.
- `src/repositories`: IndexedDB-Repositories.
- `src/services`: Reporting, Import/Export, Kalenderimport, AI-Client und Seed-Daten.
- `src/schemas`: Zod-Schemas.
- `src/types`: Domaentypen.
- `server`: Express-Proxy mit Routes, Services, Schemas und Middleware.

## GitHub Pages

GitHub Pages kann das statische Frontend bereitstellen. Echte KI-Aufrufe benoetigen trotzdem einen separaten Node-faehigen Backend-Proxy, weil der Anthropic API-Key niemals im Browser ausgeliefert werden darf.

## Bekannte Einschraenkungen

- Lizenzstatus ist lokal modelliert; eine echte Online-Aktivierung ist noch nicht implementiert.
- Ton-Einstellung ist vorbereitet, aber noch nicht mit einem Audio-Signal verdrahtet.
- Kanban sortiert Karten sichtbar, speichert aber keine manuelle Reihenfolge innerhalb einer Spalte.
- Mobile Nutzung ist moeglich, aber das Bedienkonzept bleibt desktop-first.
