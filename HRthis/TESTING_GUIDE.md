# Testing Guide für HRthis

## 🎯 Übersicht

Dieses Projekt nutzt ein umfassendes Test-Setup, um sicherzustellen, dass nur getesteter Code in Produktion geht.

## 🛠️ Test-Stack

- **Jest**: Test Runner
- **React Testing Library**: Component Testing
- **TypeScript**: Type Safety
- **ESLint**: Code Quality
- **Prettier**: Code Formatting
- **Husky**: Git Hooks
- **GitHub Actions**: CI/CD Pipeline

## 📋 Verfügbare Test-Befehle

```bash
# Tests ausführen (Watch Mode)
npm test

# Tests einmalig ausführen (CI Mode)
npm run test:ci

# Tests mit Coverage Report
npm test -- --coverage

# Linting
npm run lint
npm run lint:fix

# Type Checking
npm run type-check

# Code formatieren
npm run format
npm run format:check

# Alle Checks vor Commit
npm run pre-commit
```

## 🧪 Test-Struktur

### Unit Tests
Befinden sich neben den zu testenden Dateien in `__tests__` Ordnern:
```
src/
  state/
    auth.ts
    __tests__/
      auth.test.ts
  screens/
    AddEmployeeScreen.tsx
    __tests__/
      AddEmployeeScreen.test.tsx
```

### Test Utils
Helper-Funktionen in `src/test-utils/test-utils.tsx`:
- Custom render mit Providern
- Mock User/Admin Daten
- Navigation Mocks

## 📝 Test schreiben

### Component Test Beispiel:
```typescript
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should handle user interaction', async () => {
    render(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });
});
```

### Store Test Beispiel:
```typescript
import { useMyStore } from '../myStore';

describe('My Store', () => {
  beforeEach(() => {
    useMyStore.setState({ /* initial state */ });
  });

  it('should update state correctly', () => {
    const { myAction } = useMyStore.getState();
    
    myAction('test');
    
    expect(useMyStore.getState().myValue).toBe('test');
  });
});
```

## 🚦 CI/CD Pipeline

### GitHub Actions Workflow
Bei jedem Push/PR werden folgende Checks ausgeführt:

1. **Linting**: ESLint prüft Code-Qualität
2. **Type Check**: TypeScript Kompilierung
3. **Unit Tests**: Jest Tests mit Coverage
4. **Build**: Production Build erstellen
5. **Security Scan**: Dependency Vulnerabilities

### Pipeline Stages:
```yaml
- Test & Build (Node 18.x, 20.x)
- Security Audit
- Deploy (nur main branch)
```

## 🔒 Pre-Commit Hooks

Husky führt vor jedem Commit automatisch aus:
- ESLint (mit auto-fix)
- Prettier Formatierung
- TypeScript Type Check
- Tests

### Commit Message Format:
```
type(scope): subject

body (optional)

footer (optional)
```

Typen: feat, fix, docs, style, refactor, test, chore

## 📊 Coverage Requirements

Mindest-Coverage (konfiguriert in jest.config.js):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🚀 Best Practices

### 1. Test First
- Schreibe Tests bevor/während du Features entwickelst
- Jede neue Funktion braucht Tests

### 2. Aussagekräftige Tests
```typescript
// ❌ Schlecht
it('should work', () => {});

// ✅ Gut
it('should display error message when email is invalid', () => {});
```

### 3. Setup & Teardown
```typescript
beforeEach(() => {
  // Reset states
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup
});
```

### 4. Mock External Dependencies
```typescript
jest.mock('../../api/client', () => ({
  fetchData: jest.fn(),
}));
```

## 🐛 Debugging Tests

```bash
# Tests im Debug Mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Einzelnen Test ausführen
npm test -- MyComponent.test.tsx

# Test mit Pattern
npm test -- --testNamePattern="should create user"
```

## 📈 Coverage Report

Nach `npm test -- --coverage`:
- HTML Report: `coverage/lcov-report/index.html`
- Console Output zeigt Coverage-Prozente

## 🔄 Continuous Integration

### Lokale CI Simulation:
```bash
# Führe alle CI Checks lokal aus
npm run lint && npm run type-check && npm run test:ci && npm run build
```

### Branch Protection:
Main Branch erfordert:
- ✅ Alle CI Checks bestanden
- ✅ Code Review approved
- ✅ Up-to-date mit main

## 💡 Tipps

1. **VS Code Extensions**:
   - Jest Runner
   - ESLint
   - Prettier

2. **Test während Entwicklung**:
   - `npm test` läuft im Watch Mode
   - Automatisches Re-run bei Änderungen

3. **Debug Helper**:
   ```typescript
   screen.debug(); // Zeigt DOM
   console.log(mockFn.mock.calls); // Mock Calls
   ```

## 🆘 Troubleshooting

### "Cannot find module"
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Tests schlagen fehl
1. Check Console für Fehler
2. `screen.debug()` nutzen
3. Verify Mocks sind korrekt

### Type Errors
```bash
npm run type-check
# Fix errors
npm run lint:fix
```

---

**Remember**: Kein Code geht in Produktion ohne Tests! 🚀