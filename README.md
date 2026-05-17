# Pomodoro Kanban Time Manager

Browserbasierte Einzelplatz-Web-App für professionelles Zeitmanagement mit Pomodoro, Kanban, Reporting, JSON-Import/Export und Anthropic-KI über einen sicheren Backend-Proxy.

## Start

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://127.0.0.1:5173`  
Backend-Proxy: `http://127.0.0.1:8787`

## GitHub Pages

Die statische Frontend-App wird per GitHub Actions aus `main` nach GitHub Pages deployed.
Der Pages-Link ist nach erfolgreichem Workflow unter den Repository-Einstellungen oder in der
Actions-Deployment-Ausgabe sichtbar.

Hinweis: GitHub Pages hostet nur das Frontend. Der Anthropic-Proxy unter `server/` muss für echte
KI-Aufrufe separat auf einem Node-fähigen Backend laufen.

## Anthropic API-Key

Der Key wird ausschließlich vom Backend gelesen:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Das Frontend ruft nur `/api/ai` auf. Der Key landet nicht im Browser-Bundle.

## Befehle

```bash
npm run dev       # Vite + Express-Proxy
npm run build     # TypeScript + Produktionsbuild
npm test          # Vitest
npm run lint      # ESLint
npm run format    # Prettier
```

## Architektur

- `src/features`: Kanban, Pomodoro, Dashboard, Reports, Import/Export, KI, Settings.
- `src/stores`: Zustand-Stores nach Domänen getrennt.
- `src/repositories`: IndexedDB-Zugriff via `idb`.
- `src/services`: Geschäftslogik, Reporting, Import/Export und AI-Client.
- `server`: Express-Backend mit Anthropic Messages API.

Die Persistenz ist über Repository-Klassen gekapselt. Für eine spätere Tauri- oder Electron-Version kann eine SQLite-Implementierung hinter derselben Schnittstelle ergänzt werden.

## Import/Export

Der Export ist versioniert:

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

Beim vollständigen Überschreiben wird vorher automatisch ein lokales Backup in IndexedDB angelegt.

## Bekannte Einschränkungen

- Drag-and-drop verschiebt Karten zwischen Spalten, sortiert innerhalb der Spalte aber noch nicht fein.
- Ton ist als Einstellung vorbereitet, aber noch nicht mit einem Audio-Signal verdrahtet.
- Die Desktop-SQLite-Schicht ist vorbereitet durch Repository-Grenzen, aber noch nicht implementiert.
