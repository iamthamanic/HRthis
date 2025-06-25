# Working States Documentation

## Zeit & Urlaub Module - Funktionierender Zustand

**Datum:** 2025-06-25  
**Status:** ✅ FUNKTIONIERT KORREKT

### Dateien im korrekten Zustand:
- `src/screens/TimeAndVacationScreen.tsx` - Hauptkomponente mit vollem Kalender
- `src/screens/TimeAndVacationScreen.backup.tsx` - Backup der funktionierenden Version
- `src/navigation/AppNavigator.tsx` - Route zeigt auf TimeAndVacationScreen (nicht Simple)

### Features die funktionieren:
1. **Kombinierte Zeit & Urlaub Ansicht** - Ein Tab für beide Bereiche
2. **Statusübersicht mit 3 Karten:**
   - Meine Daten (Beschäftigungsart, Wochenstunden, Urlaubstage)
   - Urlaubsübersicht (Verfügbar, Genommen, Gesamt)
   - Heute (Aktuelle Zeit, Ein-/Ausstempeln, heutige Arbeitszeit)
3. **Team-Kalender (Timebutler-ähnlich):**
   - Monat/Jahr Ansicht Toggle
   - Mein Kalender / Team Kalender Toggle
   - Zeigt Urlaub (grün), Krankheit (blau), Arbeitszeit (grau)
   - Legende unter dem Kalender
4. **Abwesenheitenverwaltung:**
   - "Meine Abwesenheiten" und "Abwesenheiten verwalten" (für Admins)
   - Chronologische Liste mit Status-Badges
   - Benachrichtigungs-Indikatoren
5. **"+ Neue Abwesenheit" Button** - Leitet zu /request-leave weiter

### Navigation Setup:
```typescript
// AppNavigator.tsx - Zeile 15
import { TimeAndVacationScreen } from '../screens/TimeAndVacationScreen';

// Route - Zeile 141  
<Route path="/time-vacation" element={<MainLayout><TimeAndVacationScreen /></MainLayout>} />

// Tab - Zeile 69
{ path: '/time-vacation', label: 'Zeit & Urlaub', icon: '⏰' }
```

### Backup-Befehle:
```bash
# Backup erstellen
cp src/screens/TimeAndVacationScreen.tsx src/screens/TimeAndVacationScreen.backup.tsx

# Wiederherstellen falls nötig
cp src/screens/TimeAndVacationScreen.backup.tsx src/screens/TimeAndVacationScreen.tsx
```

### Letzte kritische Fixes:
- Parameter `_userId` → `userId` in handleCellClick (Zeile 163)
- Parameter `_leaveRequestId` → `leaveRequestId` in handleLeaveRequestClick (Zeile 228)
- Auskommentiert: `removeAllUserNotifications` Debug-Button (Zeile 464)

---

## Andere Module die noch überprüft werden müssen:
- [ ] AvatarDisplay.tsx - Hat noch TypeScript Errors mit store methods
- [ ] AvatarMini.tsx - Hat noch TypeScript Errors mit store methods
- [ ] Benefits/Calendar Komponenten - Status unbekannt
- [ ] Admin Screens - Status unbekannt

**WICHTIG:** Vor Änderungen an anderen Modulen immer erst Backup erstellen!