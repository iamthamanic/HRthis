# 🎓 HRdiese Learning Module

Ein vollständig gamifiziertes Schulungsmodul für HRdiese mit Videoinhalten, interaktiven Tests, Avatar-System und Belohnungen.

## 🌟 Features

### 📹 Videoinhalte & Transkription
- **Video-Player** mit YouTube-Unterstützung und eigenem Player
- **Automatische Transkription** mit Untertiteln und suchbaren Segmenten
- **Fortschritts-Tracking** mit automatischer Speicherung
- **Kategorisierung** (Pflicht, Compliance, Skills, Onboarding, Bonus)

### 🎮 Gamification-System
- **Levelsystem** von Newcomer bis Legend (Level 1-10)
- **XP-System** mit konfigurierbaren Belohnungen
- **BrowoCoins** als Währung für den Shop
- **Avatar-System** mit anpassbaren Accessoires
- **Badge-System** für besondere Leistungen

### 📝 Interaktive Tests
- **Multiple Choice** Fragen
- **Drag & Drop** Sortieraufgaben
- **Bildauswahl** Tests
- **Mehrfachauswahl** für komplexe Fragen
- **Automatische Bewertung** mit Erklärungen
- **Zeitbasierte Tracking** für Antwortzeiten

### 🏪 Belohnungssystem
- **Shop** mit Boosts, Avatar-Items und Lootboxen
- **Lootbox-Animationen** mit verschiedenen Seltenheitsgraden
- **Events** mit zeitbegrenzten Herausforderungen
- **Inventar-System** für erworbene Items

### 👑 Avatar & Personalisierung
- **Anpassbare Avatare** mit verschiedenen Accessoires
- **Level-basierte Freischaltungen**
- **Badge-Display** auf dem Avatar
- **Farbauswahl** für Personalisierung

### 📊 Admin-Interface
- **Schulungsverwaltung** mit CRUD-Operationen
- **Test-Editor** für interaktive Fragen
- **Level-Konfiguration** und Belohnungseinstellungen
- **Analytics Dashboard** mit Lernstatistiken

## 🏗️ Technische Struktur

### Dateien-Übersicht

```
src/
├── types/
│   └── learning.ts           # TypeScript-Definitionen
├── state/
│   └── learning.ts           # Zustand-Management (Zustand)
├── screens/
│   ├── LearningDashboard.tsx # Hauptübersicht
│   ├── VideoLearningScreen.tsx # Video-Player + Quiz
│   ├── LearningAdmin.tsx     # Admin-Interface
│   └── LearningShop.tsx      # Shop & Events
├── components/
│   ├── VideoPlayer.tsx       # Video-Player mit Transkription
│   ├── Quiz.tsx              # Interaktives Quiz-System
│   ├── LootboxAnimation.tsx  # Belohnungs-Animationen
│   └── AvatarCustomization.tsx # Avatar-Editor
└── navigation/
    └── AppNavigator.tsx      # Route-Konfiguration
```

### Hauptkomponenten

#### 🎯 LearningDashboard
- Übersicht aller Schulungen
- Fortschritts-Anzeige
- Level und Coin-Status
- Kategorie-Filter

#### 📺 VideoLearningScreen
- Vollbildvideo-Player
- Integriertes Quiz nach Video
- Belohnungs-Animationen
- Fortschritts-Tracking

#### 🛠️ LearningAdmin
- Schulung erstellen/bearbeiten
- Test-Konfiguration
- Level-Management
- Statistiken und Analytics

#### 🛒 LearningShop
- Item-Shop mit BrowoCoins
- Zeitbegrenzte Events
- Inventar-Verwaltung
- Lootbox-System

## 📊 Datenstrukturen

### Video Content
```typescript
interface VideoContent {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  category: TrainingCategory;
  transcription?: Transcription;
}
```

### Level System
```typescript
interface UserLevel {
  level: number;
  title: string;
  xp: number;
  nextLevelXp: number;
}
```

### Test Questions
```typescript
interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'image-selection' | 'sorting';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}
```

### Avatar System
```typescript
interface Avatar {
  id: string;
  userId: string;
  baseModel: string;
  accessories: AvatarAccessory[];
  badges: Badge[];
  level: number;
  title: string;
}
```

## 🎨 Design-Prinzipien

### Skandinavisches Design
- **Minimalistische UI** mit viel Weißraum
- **Sanfte Farben** mit blauen und lila Akzenten
- **Humorvolle Illustrationen** und Emojis
- **Klare Typografie** mit guter Lesbarkeit

### Gamification
- **Sofortiges Feedback** bei allen Aktionen
- **Visuelle Belohnungen** mit Animationen
- **Fortschritts-Indikatoren** überall sichtbar
- **Soziale Elemente** wie Ranglisten (vorbereitet)

### Benutzerfreundlichkeit
- **Responsive Design** für alle Geräte
- **Intuitive Navigation** zwischen den Funktionen
- **Konsistente Interaktionen** in der gesamten App
- **Barrierefreie Gestaltung** mit guten Kontrasten

## 🚀 Nächste Schritte

### Backend-Integration
- REST API für Schulungen und Fortschritte
- Benutzer-Authentifizierung
- Datenpersistierung
- File-Upload für Videos

### Erweiterte Features
- **Team-Ranglisten** und Vergleiche
- **Push-Notifications** für Erinnerungen
- **PDF-Zertifikate** zum Download
- **Video-Upload** mit automatischer Transkription
- **Erweiterte Analytics** für HR-Teams

### Mobile App
- React Native Version
- Offline-Modus für Downloads
- Native Video-Player
- Push-Notifications

## 🔧 Verwendung

### Navigation
```
/learning           # Hauptübersicht
/learning/video/:id # Video-Player
/learning/admin     # Admin-Interface (nur für Admins)
/shop              # Belohnungsshop
```

### Mock-Daten
Das System verwendet derzeit Mock-Daten für:
- Video-Inhalte mit YouTube-Links
- Test-Fragen mit verschiedenen Typen
- Level-Konfiguration (1-10)
- Shop-Items und Events
- Avatar-Accessoires

### API-Integration
Die Zustand-Management-Hooks sind bereits für echte API-Calls vorbereitet:
```typescript
// Beispiel für zukünftige API-Integration
const loadVideos = async () => {
  const response = await fetch('/api/videos');
  const videos = await response.json();
  // ...
};
```

## 🎉 Highlights

- **Vollständig funktionsfähig** mit Mock-Daten
- **Skalierbare Architektur** für Erweiterungen
- **Moderne Tech-Stack** (React, TypeScript, Tailwind)
- **Responsive Design** für alle Bildschirmgrößen
- **Gamification-Features** die Spaß machen
- **Admin-Interface** für einfache Verwaltung

Das Modul ist sofort einsatzbereit und kann mit echten Daten und Backend-API erweitert werden!