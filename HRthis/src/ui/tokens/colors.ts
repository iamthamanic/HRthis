/**
 * Color System
 * Basierend auf deine bestehende UI - Grau-dominiert mit blauen Akzenten
 */

// Base Color Palette
export const colors = {
  // Graustufen (Hauptfarben deiner App)
  gray: {
    50: '#f9fafb',   // Sehr heller Hintergrund
    100: '#f3f4f6',  // Heller Hintergrund (wie bg-gray-50)
    200: '#e5e7eb',  // Border, Divider
    300: '#d1d5db',  // Subtile Border
    400: '#9ca3af',  // Disabled Text
    500: '#6b7280',  // Secondary Text
    600: '#4b5563',  // Primary Text (dunkel)
    700: '#374151',  // Dark Text
    800: '#1f2937',  // Sehr dunkler Text
    900: '#111827',  // Schwarz-ähnlich
  },
  
  // Blau (Primary Color - wie in deinen Buttons)
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',   // Standard Blau
    600: '#2563eb',   // Dein Button-Blau
    700: '#1d4ed8',   // Hover-Zustand
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Status Farben
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',   // Success
    600: '#16a34a',
    700: '#15803d',
  },
  
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    400: '#fb923c',   // Warning
    500: '#f97316',
    600: '#ea580c',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',   // Error
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  // Gamification Farben (basierend auf deiner Avatar-UI)
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    400: '#22d3ee',   // Skills Level
    500: '#06b6d4',
    600: '#0891b2',
  },
  
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',   // Engagement Background
    400: '#fbbf24',
    500: '#f59e0b',   // Coins/Engagement
    600: '#d97706',
  },
  
  // Base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Semantic Color System (Use Cases)
export const semanticColors = {
  // Text Colors
  text: {
    primary: colors.gray[900],     // Haupttext
    secondary: colors.gray[600],   // Secondary Text
    tertiary: colors.gray[500],    // Subtle Text
    disabled: colors.gray[400],    // Disabled Text
    inverse: colors.white,         // Text auf dunklem Hintergrund
  },
  
  // Background Colors
  background: {
    primary: colors.white,         // Haupthintergrund
    secondary: colors.gray[50],    // Page Background (wie bei dir)
    tertiary: colors.gray[100],    // Subtle Background
    disabled: colors.gray[50],     // Disabled Background
  },
  
  // Border Colors
  border: {
    light: colors.gray[200],       // Standard Border
    medium: colors.gray[300],      // Emphasized Border
    dark: colors.gray[400],        // Strong Border
  },
  
  // Interactive States
  interactive: {
    primary: colors.blue[600],     // Primary Buttons (wie deine)
    primaryHover: colors.blue[700], // Primary Hover
    secondary: colors.gray[200],   // Secondary Buttons
    secondaryHover: colors.gray[300], // Secondary Hover
  },
  
  // Status Colors
  status: {
    success: colors.green[500],
    successBg: colors.green[50],
    warning: colors.orange[500],
    warningBg: colors.orange[50],
    error: colors.red[500],
    errorBg: colors.red[50],
    info: colors.blue[500],
    infoBg: colors.blue[50],
  },
  
  // Gamification (für deine Avatar-Komponenten)
  gamification: {
    level: colors.cyan[500],       // Skills Level
    levelBg: colors.cyan[100],
    engagement: colors.yellow[500], // Engagement/Coins
    engagementBg: colors.yellow[100],
    achievement: colors.orange[500], // Achievements
  },
  
  // Card/Surface Colors
  surface: {
    primary: colors.white,         // Card Background
    elevated: colors.white,        // Elevated Cards (mit Shadow)
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal Overlay
  },
} as const;

export type ColorKey = keyof typeof colors;
export type SemanticColorKey = keyof typeof semanticColors;