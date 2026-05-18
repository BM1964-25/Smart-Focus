# AGENTS.md

## Projekt

SMART Focus ist eine React/TypeScript/Vite/TailwindCSS-App fuer lokales Zeitmanagement mit Kanban, Pomodoro, Reporting, JSON-Import/Export, ICS-Kalenderimport und Anthropic-KI ueber Express-Proxy.

## Projektregeln

- React, TypeScript, Vite und TailwindCSS verwenden.
- TypeScript strict bleibt aktiv.
- Keine `any`-Typen ohne kurze technische Begruendung.
- Browser-Persistenz laeuft ueber IndexedDB und Repository-Klassen.
- UI-Komponenten greifen nie direkt auf IndexedDB zu.
- JSON-Import/Export bleibt versioniert und mit Zod validiert.
- ICS-Termine sind zuerst Planungskontext und werden erst nach Nutzeraktion zu Aufgaben.
- Der Anthropic API-Key darf nur im Express-Backend ueber `ANTHROPIC_API_KEY` gelesen werden.
- KI-Vorschlaege werden immer als Vorschau angezeigt und nie automatisch gespeichert.
- Frontend sendet nur notwendigen Arbeitskontext an `/api/ai`.
- SQLite ist nicht Browser-Hauptspeicher; Desktop-SQLite kann spaeter hinter Repository-Interfaces ergaenzt werden.

## Build-Befehle

- `npm install`
- `npm run dev`
- `npm run dev:client`
- `npm run dev:server`
- `npm run build`
- `npm run preview`

## Test-Befehle

- `npm run lint`
- `npm run test`

## Coding-Konventionen

- Kleine Komponenten, fachlich in `src/features/*`.
- Wiederverwendbare UI-Bausteine in `src/components`.
- Zod-Schemas in `src/schemas`, Domaentypen in `src/types`.
- Stores getrennt nach Fachgebiet in `src/stores`.
- Datenzugriff nur ueber `src/repositories`.
- Services enthalten Geschaeftslogik wie Reporting, Kalenderimport, Import/Export und AI-Client.
- Backend bleibt in `server/` mit Route, Service, Schema und Middleware getrennt.
- Keine API-Keys, Tokens oder vollstaendigen Nutzdaten loggen.
- Backend-CORS restriktiv halten.
- Externe KI-Antworten vor Speicherung validieren.

## UI-Regeln

- App wirkt ruhig, professionell und SaaS-artig, nicht spielerisch.
- Kanban bleibt visuell ein Board mit Karten, ergaenzt durch digitale Suche, Filter und Sortierung.
- Pomodoro nutzt Hybrid-Timer: analoger Fortschrittsring plus digitale Restzeit.
- Fokus-Spalte darf maximal eine Karte enthalten.
- Pomodoro-Fokus kann nur mit Fokus-Karte starten.
- KI-Panel bleibt eingeklappt, bis der Nutzer es oeffnet.
- Gefaehrliche Aktionen brauchen klare Bestaetigung.

## Release-Hinweise

- Vor Push/Release ausfuehren: `npm run lint`, `npm run build`, `npm run test`.
- GitHub Pages hostet nur das Frontend.
- KI-Funktionen benoetigen einen separaten Node-Backend-Proxy mit `ANTHROPIC_API_KEY`.
- Lizenzstatus ist lokal vorbereitet; echte Online-Aktivierung ist noch nicht implementiert.
