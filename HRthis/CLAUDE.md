# Claude Code Projektgedächtnis für HRthis

## Aktueller Projekt-Status (Stand: 2025-06-29 - 20:10 Uhr)

### ✅ **NEUER SAVEPOINT: HRthis → Browo AI Backend Integration KOMPLETT**
- **Commit:** `9cf039c0 - feat: Savepoint + README Update + UI Snapshot for HRthis Backend Integration`
- **Branch:** `main`
- **Status:** 🎉 **100% VOLLSTÄNDIG IMPLEMENTIERT** 🎉

### 🚀 Was HEUTE implementiert wurde:

#### Backend (FastAPI + SQLite) - 100% ✅
- **Komplettes Employee Management System**
- **JWT Authentication & Authorization**
- **Neue HR Features:**
  - Kleidungsgrößen (Oberteil, Hose, Schuhe)
  - Onboarding Email System mit Presets
  - "Sonstige" Beschäftigungsart mit Custom-Feld
  - Notfallkontakte mit Beziehung
  - Erweiterte Employee-Felder

#### Frontend (React + Ant Design) - 100% ✅
- **Komplette HR-App mit modernem UI**
- **Login System mit Backend-Integration**
- **Employee List mit Filtern & Suche**
- **Employee Form mit allen neuen Feldern**
- **Onboarding Email Management**

### 🔧 Server URLs (AKTIV):
- **Frontend:** http://localhost:1996/hr/app
- **Backend API:** http://localhost:8002
- **API Docs:** http://localhost:8002/docs

### 🏗️ Neue Projektstruktur:
```
HRthis/
├── HRthis/                           # Original App (unverändert)
├── browo-hrthis-backend/             # ✅ NEUES Backend (FastAPI)
│   ├── app/api/auth.py               # JWT Auth + Login/Register
│   ├── app/api/employees.py          # Employee CRUD + Onboarding  
│   ├── app/models/employee.py        # SQLAlchemy Models (alle neuen Felder)
│   └── README.md                     # Vollständige Dokumentation
├── HRthis/refactor/fe-starter-pack-master/ # ✅ NEUES Frontend (React)
│   ├── src/features/hr/HRApp.tsx     # Main App Component
│   ├── src/features/hr/screens/      # Login, List, Form Screens
│   ├── src/features/hr/services/     # API Client
│   └── src/features/hr/types/        # TypeScript Definitions
└── snapshots/2025-06-29-*/           # ✅ UI Screenshots & Dokumentation
```

### 🎨 Neue Features (Implementiert):

#### 1. Kleidungsgrößen System ✅
```typescript
interface ClothingSizes {
  top?: string;      // XS, S, M, L, XL, XXL, XXXL
  pants?: string;    // z.B. "32", "W32/L34"
  shoes?: string;    // z.B. "42", "9.5"
}
```

#### 2. Onboarding Email System ✅
- **Presets:** Fahrer, Sachbearbeiter, Manager, Praktikant
- **Automatischer Versand** beim Mitarbeiter erstellen
- **Tracking:** Versandstatus und Zeitstempel

#### 3. Erweiterte Beschäftigungsarten ✅
- Standard: Vollzeit, Teilzeit, Minijob, Praktikant
- **NEU:** "Sonstige" mit Custom-Text-Feld

#### 4. Notfallkontakte ✅
```typescript
interface EmergencyContact {
  name: string;
  phone: string;
  relation: string; // Ehepartner, Elternteil, Kind, etc.
}
```

### 📊 API Endpoints (Alle implementiert):

#### Authentication
- `POST /api/auth/login` - Login mit Email/Mitarbeiternummer
- `POST /api/auth/register` - Neuen Mitarbeiter registrieren
- `GET /api/auth/me` - Aktuelle User-Info
- `POST /api/auth/refresh` - Token erneuern

#### Employee Management
- `GET /api/employees/` - Liste mit Filtern
- `POST /api/employees/` - Neuen Mitarbeiter erstellen
- `PATCH /api/employees/{id}` - Mitarbeiter aktualisieren
- `DELETE /api/employees/{id}` - Mitarbeiter löschen

#### Onboarding
- `POST /api/employees/{id}/send-onboarding-email` - Email senden
- `GET /api/employees/{id}/onboarding-status` - Status abfragen

### 📸 UI Snapshots erstellt:
- ✅ Login Screen Screenshot
- ✅ API Documentation Screenshot
- ✅ Vollständige UI-Dokumentation

### 🛠️ Quick Restart Commands:

#### Backend starten:
```bash
cd /Users/halteverbotsocialmacpro/Desktop/ars\ vivai/HRthis/browo-hrthis-backend
./venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

#### Frontend starten:
```bash
cd /Users/halteverbotsocialmacpro/Desktop/ars\ vivai/HRthis/HRthis/refactor/fe-starter-pack-master
npm run dev
```

### 🔮 Nächste Schritte (Woche 2-4 Plan):

#### Woche 2: Email & File Management
- [ ] Brevo Email Service Integration
- [ ] File Upload System (Dokumente)
- [ ] OCR für Dokumentenerkennung

#### Woche 3: Learning Management
- [ ] Lernmodule System
- [ ] Video Upload & Transkription
- [ ] Test System mit Fortschritt

#### Woche 4: Dashboard & Analytics
- [ ] KPI Dashboard
- [ ] Personalplanung Tools
- [ ] Reporting System

### 🐛 Gelöste Probleme:
- ✅ JWT Import Error → PyJWT installiert
- ✅ Circular Dependencies in auth.py → Refactored
- ✅ Port Conflicts → Backend auf 8002, Frontend auf 1996
- ✅ Navigation "Anträge" entfernt

### 💾 Savepoint Details:
- **Git Commit:** 133 files changed, 26228 insertions
- **Snapshots:** UI Screenshots gespeichert
- **README:** Vollständig aktualisiert
- **Dokumentation:** Komplett

---

### 🎉 **MEILENSTEIN ERREICHT:** 
**HRthis → Browo AI Integration zu 100% fertig!**
*Backend ✅ | Frontend ✅ | Integration ✅ | Dokumentation ✅*

**Alles läuft und ist einsatzbereit!** 🚀

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