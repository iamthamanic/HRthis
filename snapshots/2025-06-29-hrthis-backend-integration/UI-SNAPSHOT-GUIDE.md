# 📸 UI Snapshot Guide

## Screenshots erstellen (für UI-Dokumentation)

### 1. Login Screen
- **URL:** http://localhost:1996/hr/app
- **Screenshot Name:** `01-login-screen.png`
- **Features zeigen:**
  - Glasmorphismus Design
  - Login-Form (Email/Mitarbeiternummer + Passwort)
  - "HRthis Login" Header
  - "Powered by Browo AI" Footer

### 2. Employee List Screen
- **URL:** Nach Login → Employee List
- **Screenshot Name:** `02-employee-list.png`
- **Features zeigen:**
  - Header mit "HRthis - Mitarbeiterverwaltung"
  - Suchfeld und Filter (Abteilung, Status)
  - Tabelle mit Mitarbeitern
  - Onboarding-Status Spalte
  - Action-Buttons (Bearbeiten, Email, Löschen)
  - "Neuer Mitarbeiter" Button

### 3. Employee Form (Create)
- **URL:** Nach "Neuer Mitarbeiter" klicken
- **Screenshot Name:** `03-employee-form-create.png`
- **Features zeigen:**
  - 4-Spalten Layout
  - Grunddaten (Name, Email, etc.)
  - Beschäftigung (Position, Abteilung)
  - **NEU:** Kleidungsgrößen (Oberteil, Hose, Schuhe)
  - **NEU:** Notfallkontakt
  - **NEU:** Onboarding Email Optionen

### 4. Employee Form (Edit)
- **URL:** Nach Mitarbeiter bearbeiten klicken
- **Screenshot Name:** `04-employee-form-edit.png`
- **Features zeigen:**
  - Alle gefüllten Felder
  - "Sonstige" Beschäftigungsart mit Custom-Feld
  - Onboarding Status

### 5. Backend API Docs
- **URL:** http://localhost:8002/docs
- **Screenshot Name:** `05-api-docs.png`
- **Features zeigen:**
  - Swagger UI
  - Auth Endpoints
  - Employee Endpoints
  - Schemas

## Screenshots speichern unter:
```
/Users/halteverbotsocialmacpro/Desktop/ars vivai/HRthis/snapshots/2025-06-29-hrthis-backend-integration/
├── 01-login-screen.png
├── 02-employee-list.png
├── 03-employee-form-create.png
├── 04-employee-form-edit.png
└── 05-api-docs.png
```

## UI Features zu dokumentieren:

### ✅ Login Screen
- Glasmorphismus-Design mit Gradient Background
- Zentrale Card mit Shadow
- Input-Felder mit Icons (UserOutlined, LockOutlined)
- Primary Button mit Loading State
- Error Alerts mit Ant Design

### ✅ Employee List
- Responsive Tabelle mit Pagination
- Live-Suche mit Debouncing
- Multi-Filter (Abteilung, Status, Typ)
- Status-Tags (Active=green, Probation=orange)
- Onboarding-Status mit Icons (✅ oder 📧)
- Action-Buttons mit Tooltips

### ✅ Employee Form
- 4-Spalten Responsive Layout
- Card-basierte Gruppierung
- Smart Form Validation
- Custom Employment Type Toggle
- Clothing Sizes (3 separate Inputs)
- Emergency Contact (Name, Phone, Relation)
- Onboarding Email Switch + Preset Dropdown

### ✅ Modern Design Patterns
- Ant Design 5.x Components
- TypeScript Strict Mode
- Responsive Grid System
- Consistent Color Scheme
- Loading States überall
- Error Handling mit User-friendly Messages

---

**Nach Screenshots:** Alle Bilder in den snapshots Ordner speichern!