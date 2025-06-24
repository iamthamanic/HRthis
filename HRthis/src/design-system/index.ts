/**
 * Design System - Central Export
 * Einheitlicher Import aller Design-System Komponenten
 */

// Design Tokens
export * from './tokens';

// Layout Components
export * from './components/layout/Container';
export * from './components/layout/Grid';
export * from './components/layout/Card';

// Re-export commonly used combinations
export {
  DashboardGrid as Dashboard,
  StatsGrid as Stats,
  TwoColumnGrid as TwoColumns,
} from './components/layout/Grid';

export {
  PageContainer as Page,
} from './components/layout/Container';

export {
  StatsCard as Stat,
  InfoCard as Info,
  AvatarCard as Avatar,
} from './components/layout/Card';