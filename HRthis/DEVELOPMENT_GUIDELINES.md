# Development Guidelines

## TypeScript Best Practices

### 1. Always Check Type Exports
Before using types from other files:
```typescript
// ❌ Bad - Assuming types exist
import { User, SomeType } from '../types';

// ✅ Good - First verify types are exported
// Check types/index.ts for available exports
```

### 2. Type Definitions
Always export reusable types:
```typescript
// types/index.ts
export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'SUPERADMIN';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'MINI_JOB';
```

### 3. Pre-commit Checks
Before committing code:
1. Run `npm run build` to check for TypeScript errors
2. Fix all ESLint warnings
3. Ensure no unused imports/variables

### 4. Component Imports
Always verify component exists before importing:
```typescript
// First check if file exists
// Then import it
import { ComponentName } from './ComponentName';
```

## ESLint Configuration
- Configured to catch unused variables
- Warns about console.log statements
- Enforces React hooks rules

## Prettier Configuration
- Single quotes
- Semicolons required
- 100 character line width
- Trailing commas in ES5

## How to Avoid TypeScript Errors

### Before Creating New Code:
1. **Check existing types**: Look in `src/types/index.ts`
2. **Verify imports**: Ensure all imports exist
3. **Use strict mode**: TypeScript will catch more errors

### Common Patterns:
```typescript
// Define types for function parameters
const handleSubmit = async (data: FormData): Promise<void> => {
  // implementation
};

// Use optional chaining for possibly undefined values
const userName = user?.name ?? 'Guest';

// Type guard functions
const isAdmin = (user: User): boolean => {
  return user.role === 'ADMIN' || user.role === 'SUPERADMIN';
};
```

## Running Type Checks
```bash
# Check TypeScript compilation
npm run build

# Run ESLint
npx eslint src --ext .ts,.tsx

# Format with Prettier
npx prettier --write "src/**/*.{ts,tsx}"
```