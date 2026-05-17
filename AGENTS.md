# AGENTS.md

## Projektregeln
- React, TypeScript, Vite und TailwindCSS verwenden.
- TypeScript strict bleibt aktiv; keine `any`-Typen ohne kurze Begründung.
- Lokale Browser-Persistenz läuft über IndexedDB und Repository-Klassen.
- UI-Komponenten greifen nie direkt auf IndexedDB zu.
- JSON-Import/Export bleibt versioniert und mit Zod validiert.
- Der Anthropic API-Key darf nur im Express-Backend über `ANTHROPIC_API_KEY` gelesen werden.
- KI-Vorschläge werden immer als Vorschau angezeigt und nie automatisch gespeichert.
- SQLite ist nicht Browser-Hauptspeicher; Desktop-SQLite kann später hinter Repository-Interfaces ergänzt werden.

## Build-Befehle
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Test-Befehle
- `npm test`
- `npm run lint`

## Coding-Konventionen
- Kleine Komponenten, fachlich in `src/features/*`.
- Zod-Schemas in `src/schemas`, Domaintypen in `src/types`.
- Stores getrennt nach Fachgebiet in `src/stores`.
- Datenzugriff nur über `src/repositories`.
- Services enthalten Geschäftslogik wie Reporting, Import/Export und AI-Client.
- Backend bleibt in `server/` mit Route, Service, Schema und Middleware getrennt.

## Sicherheitsregeln
- Keine API-Keys, Tokens oder vollständigen Nutzdaten loggen.
- Backend-CORS restriktiv halten.
- KI-Kontext minimieren und validieren.
