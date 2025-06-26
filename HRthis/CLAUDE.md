# Claude Code Projektgedächtnis für HRthis

## Aktueller Projekt-Status (Stand: 2025-06-26)

### ✅ **Letzter Savepoint: TypeScript Best Practices & Admin Navigation Fix**
- **Commit:** `0b781cbf - feat: implement TypeScript best practices and fix admin navigation`
- **Branch:** `main`
- **Development Server:** http://localhost:3001 (Port 3001 wegen Konflikt auf 3000)

### Implementierte Verbesserungen:
1. **TypeScript Strict Mode** - tsconfig.json mit strengen Optionen erweitert
2. **Zod Runtime-Validierung** - Validation.ts mit Schemas für User, Team, LeaveRequest erstellt
3. **Admin Navigation Fix** - Route jetzt in MainLayout eingebettet, Header bleibt sichtbar
4. **TypeScript-Fehler behoben** - Calendar-Types exportiert, Parameter-Namen korrigiert
5. **Dependencies** - lucide-react, eslint-plugin-sonarjs, jspdf installiert

### Admin-System Zugangsdaten:
- **Email:** `anna.admin@hrthis.de`
- **Passwort:** `password`
- **Rolle:** ADMIN (kann alle Admin-Bereiche nutzen)

### Bekannte Probleme:
- ESLint-Warnungen (nicht kritisch): Funktionen zu lang, ungenutzte Imports
- TypeScript-Warnungen in Calendar-Komponenten (funktioniert aber)

### Nächste mögliche Schritte:
- Calendar-Filter-Types verfeinern
- Verbleibende TypeScript-Warnungen beheben
- Admin-Funktionalitäten testen und erweitern

## Raggadon Integration für Claude Code

Dieses Dokument definiert, wie Claude Code mit Raggadon interagieren soll.

## Befehle

Wenn der User einen der folgenden Befehle eingibt, führe die entsprechende Aktion aus:

### `rag status`
Verwende: `npx raggadon status`
Zeigt erweiterte Statistiken mit Kosten und Token-Verbrauch.

### `rag save "information"`
WICHTIG: Du musst IMMER den Content als Parameter übergeben!
Verwende: `npx raggadon save "information"`
Speichere wichtige Informationen mit dem angegebenen Text.
Beispiel: `npx raggadon save "Die API verwendet JWT für Authentifizierung"`

### `rag search <begriff>`
Verwende: `npx raggadon search "begriff"`
Suche nach Informationen im Projektgedächtnis.

### `rag summary`
Zeige eine Zusammenfassung der gespeicherten Informationen für das aktuelle Projekt.

## Automatische Integration

### Was automatisch gespeichert werden soll:

1. **Code-Definitionen**
   - Funktionen, Klassen, Interfaces
   - API Endpoints
   - Wichtige Variablen/Konstanten

2. **Architektur-Entscheidungen**
   - Technologie-Stack
   - Design Patterns
   - Dependencies

3. **Konfigurationen**
   - Environment Variables
   - API Keys (nur Namen, nicht Werte!)
   - Datenbank-Schemas

4. **Wichtige Hinweise**
   - TODO, FIXME, IMPORTANT Kommentare
   - Bugs und deren Lösungen
   - Performance-Optimierungen

### Proaktives Verhalten:

1. **Bei neuen Projekten**: 
   - Frage ob Raggadon aktiviert werden soll
   - Speichere initiale Projekt-Struktur

2. **Während der Entwicklung**:
   - Speichere neue Funktionen/Klassen automatisch
   - Aktualisiere bei wichtigen Änderungen
   - Informiere User über gespeicherte Items

3. **Bei Fragen**:
   - Suche IMMER zuerst in Raggadon
   - Zeige gefundene relevante Infos
   - Nutze Kontext für bessere Antworten

### WICHTIGE HINWEISE FÜR CLAUDE:

1. **Bei `rag save` Befehlen**: 
   - NIEMALS ohne Content aufrufen!
   - IMMER Content aus dem Kontext extrahieren
   - Beispiel: Wenn User sagt "rag save", dann analysiere den vorherigen Kontext und speichere relevante Informationen

2. **Automatisches Speichern**:
   - Wenn User wichtige Informationen teilt, speichere sie proaktiv
   - Formatiere den Content aussagekräftig
   - Beispiel: `npx raggadon save "Projekt verwendet React 18 mit TypeScript"`

## Integration auf neuem Rechner

Wenn User fragt wie Raggadon auf neuem Rechner eingerichtet wird:
1. Verweise auf SETUP_NEW_MACHINE.md
2. Biete an, die Schritte durchzugehen
3. Prüfe ob alle Dependencies vorhanden sind