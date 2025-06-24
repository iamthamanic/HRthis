# JSDoc und Human-Readable Documentation Templates

## JSDoc Templates

### React Component Template
```javascript
/**
 * [ComponentName] Component
 * 
 * [Beschreibung was die Komponente macht und wofür sie verwendet wird]
 * 
 * @component
 * @example
 * return (
 *   <ComponentName 
 *     prop1="value1"
 *     prop2={value2}
 *   />
 * )
 * 
 * @param {Object} props - Component properties
 * @param {string} props.prop1 - [Beschreibung von prop1]
 * @param {number} props.prop2 - [Beschreibung von prop2]
 * @param {Function} [props.onAction] - Optional callback function
 * @returns {JSX.Element} Rendered component
 */
```

### Function Template
```javascript
/**
 * [FunctionName] Function
 * 
 * [Beschreibung was die Funktion macht und wann sie verwendet wird]
 * 
 * @param {string} param1 - [Beschreibung von param1]
 * @param {Object} param2 - [Beschreibung von param2]
 * @param {string} param2.property - [Beschreibung einer Eigenschaft]
 * @param {boolean} [optionalParam] - Optional parameter [default: false]
 * @returns {Promise<Object>} [Beschreibung des Rückgabewerts]
 * 
 * @throws {Error} Thrown when [Bedingung für Fehler]
 * 
 * @example
 * const result = await functionName('example', { property: 'value' });
 * console.log(result);
 */
```

### Zustand Store Template
```javascript
/**
 * [StoreName] Store
 * 
 * Zustand store for managing [Bereich] state and operations.
 * This store handles [spezifische Verantwortlichkeiten].
 * 
 * @store
 * @example
 * const { data, loading, actions } = useStoreNameStore();
 * 
 * @interface StoreNameStore
 * @property {Object} state - Current state data
 * @property {boolean} loading - Loading indicator
 * @property {Object} actions - Available state actions
 * @property {Function} actions.fetchData - Fetches data from API
 * @property {Function} actions.updateItem - Updates a specific item
 */
```

### Utility Function Template
```javascript
/**
 * [UtilityName] Utility
 * 
 * [Beschreibung der Utility-Funktion und ihres Zwecks]
 * 
 * @utility
 * @param {any} input - [Beschreibung des Inputs]
 * @returns {any} [Beschreibung des Outputs]
 * 
 * @example
 * const result = utilityFunction(inputValue);
 */
```

## Human-Readable Explanation Templates

### Component Explanation Template
```markdown
## Was macht die [ComponentName] Komponente?

Diese Komponente ist verantwortlich für [Hauptfunktion in einfachen Worten].

### Schritt-für-Schritt Erklärung:

1. **Initialisierung**: Beim ersten Laden passiert [was genau]
2. **Benutzerinteraktion**: Wenn der Nutzer [Aktion], dann [Reaktion]
3. **Datenverarbeitung**: Die Komponente [verarbeitet/zeigt/speichert] [was]
4. **Ergebnis**: Am Ende wird [Endergebnis] gezeigt/erreicht

### Analogie:
Stell dir vor, diese Komponente ist wie [Alltagsvergleich]. Genau wie [Vergleich], macht sie [Funktion].

### Für neue Teammitglieder:
- **Wo findest du sie**: `src/components/[ComponentName].tsx`
- **Wird verwendet in**: [Liste der Screens/Komponenten]
- **Wichtige Props**: 
  - `prop1`: [Was es macht]
  - `prop2`: [Was es macht]
- **Abhängigkeiten**: [Welche Stores/APIs werden verwendet]

### Häufige Änderungen:
- Um das Aussehen zu ändern: [Wo in der Komponente]
- Um neue Funktionen hinzuzufügen: [Welche Methoden erweitern]
- Um Daten zu ändern: [Welche Props/Stores anpassen]
```

### Function Explanation Template
```markdown
## Was macht die [FunctionName] Funktion?

Diese Funktion [Hauptzweck in einem Satz].

### Was passiert hier?

1. **Eingabe**: Die Funktion erhält [Parameter erklären]
2. **Verarbeitung**: Dann wird [Schritt-für-Schritt Logik erklären]
3. **Ausgabe**: Am Ende gibt sie [Rückgabe erklären] zurück

### Wann wird sie verwendet?
[Konkrete Anwendungsfälle nennen]

### Beispiel aus dem echten Leben:
Das ist wie wenn du [Alltagsvergleich]. Du gibst [Input-Analogie] rein und bekommst [Output-Analogie] heraus.

### Für Entwickler:
- **Import**: `import { functionName } from './path'`
- **Verwendung**: [Code-Beispiel]
- **Fehlerbehandlung**: [Was kann schiefgehen]
```

### Store Explanation Template
```markdown
## Was macht der [StoreName] Store?

Dieser Store ist der "Datenspeicher" für [Bereich]. Er funktioniert wie eine zentrale Ablage für alle Informationen zu [Thema].

### Was wird hier gespeichert?
- **[Datentyp 1]**: Für [Zweck]
- **[Datentyp 2]**: Für [Zweck]
- **Loading States**: Zeigt an, ob gerade Daten geladen werden

### Welche Aktionen gibt es?
1. **[Aktion 1]**: [Was passiert in einfachen Worten]
2. **[Aktion 2]**: [Was passiert in einfachen Worten]
3. **[Aktion 3]**: [Was passiert in einfachen Worten]

### Analogie:
Stell dir vor, dieser Store ist wie [Alltagsvergleich - z.B. ein Aktenschrank, eine Bibliothek, etc.]. Genau wie dort, kannst du [Analogie fortführen].

### Für Entwickler:
- **Zugriff**: `const { data, actions } = useStoreNameStore()`
- **Wichtige Aktionen**: [Liste mit Beispielen]
- **Persistiert**: Ja/Nein, in LocalStorage
- **Abhängigkeiten**: [Andere Stores oder APIs]

### Debugging:
- **State ansehen**: [Wie man den State inspiziert]
- **Häufige Probleme**: [Typische Issues und Lösungen]
```

## Best Practices

### Wann JSDoc verwenden:
- ✅ Alle exportierten Funktionen und Komponenten
- ✅ Komplexe interne Funktionen
- ✅ Zustand Stores und ihre Aktionen
- ✅ Utility Funktionen
- ✅ Type Definitionen

### Wann Human-Readable Explanations verwenden:
- ✅ Komplexe Business-Logik
- ✅ Neue Features für Onboarding
- ✅ Häufig geänderte Komponenten
- ✅ Stores mit komplexen Workflows
- ✅ Algorithmen oder Berechnungen

### Qualitätskriterien:
1. **JSDoc**: Vollständig, korrekte Typen, hilfreiche Beispiele
2. **Human Explanations**: Verständlich für Nicht-Entwickler, mit Analogien, praktische Beispiele
3. **Aktualität**: Dokumentation wird bei Code-Änderungen mitgeführt
4. **Konsistenz**: Einheitlicher Stil und Struktur