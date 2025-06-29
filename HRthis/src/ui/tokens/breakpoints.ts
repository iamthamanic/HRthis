/**
 * Responsive Breakpoint System
 * Mobile-First Approach für deine App
 */

// Shared constants to avoid duplication
const WIDTH_640 = '640px';
const WIDTH_768 = '768px';
const WIDTH_1024 = '1024px';
const WIDTH_1280 = '1280px';
const WIDTH_1536 = '1536px';

export const breakpoints = {
  // Mobile First Breakpoints
  sm: WIDTH_640,      // Small tablets, large phones
  md: WIDTH_768,      // Tablets
  lg: WIDTH_1024,     // Laptops, small desktops
  xl: WIDTH_1280,     // Large desktops
  '2xl': WIDTH_1536,  // Extra large screens
} as const;

// Container Max-Widths für verschiedene Breakpoints
export const containerMaxWidth = {
  sm: WIDTH_640,
  md: WIDTH_768, 
  lg: WIDTH_1024,
  xl: WIDTH_1280,     // Wie deine max-w-7xl
  '2xl': WIDTH_1536,
} as const;

// Grid System Configuration
export const gridSystem = {
  // Standard 12-Column Grid
  columns: 12,
  
  // Grid Gaps für verschiedene Breakpoints
  gap: {
    mobile: '16px',    // 4 (enger auf Mobile)
    tablet: '24px',    // 6 (Standard)
    desktop: '24px',   // 6 (gleich wie Tablet)
  },
  
  // Container Padding für verschiedene Breakpoints
  containerPadding: {
    mobile: '16px',    // 4 (weniger Padding auf Mobile)
    tablet: '24px',    // 6 (Standard, wie in deiner App)
    desktop: '24px',   // 6 (gleich)
  },
} as const;

// Responsive Utilities
export const responsivePatterns = {
  // Häufige Grid-Layouts
  layouts: {
    // Dashboard Layout (9-3 Split)
    dashboard: {
      mobile: 'grid-cols-1',           // 1 Spalte auf Mobile
      tablet: 'md:grid-cols-1',        // 1 Spalte auf Tablet
      desktop: 'lg:grid-cols-12',      // 12 Spalten auf Desktop
    },
    
    // Stats Grid (1-2-3 Pattern)
    stats: {
      mobile: 'grid-cols-1',           // 1 Spalte auf Mobile
      tablet: 'md:grid-cols-2',        // 2 Spalten auf Tablet  
      desktop: 'lg:grid-cols-3',       // 3 Spalten auf Desktop
    },
    
    // Two Column Layout
    twoColumn: {
      mobile: 'grid-cols-1',           // 1 Spalte auf Mobile
      tablet: 'md:grid-cols-2',        // 2 Spalten ab Tablet
      desktop: 'lg:grid-cols-2',       // 2 Spalten auf Desktop
    },
    
    // Four Column Layout (für Listen, Cards)
    fourColumn: {
      mobile: 'grid-cols-1',           // 1 Spalte auf Mobile
      tablet: 'md:grid-cols-2',        // 2 Spalten auf Tablet
      desktop: 'lg:grid-cols-4',       // 4 Spalten auf Desktop
    },
  },
  
  // Spacing Adjustments
  spacing: {
    // Container Padding responsive
    containerPadding: 'px-4 md:px-6',
    
    // Section Spacing responsive  
    sectionSpacing: 'space-y-6 md:space-y-8 lg:space-y-12',
    
    // Grid Gaps responsive
    gridGap: 'gap-4 md:gap-6',
  },
  
  // Typography responsive
  typography: {
    // Headlines responsive
    h1: 'text-2xl md:text-3xl lg:text-4xl',
    h2: 'text-xl md:text-2xl lg:text-3xl', 
    h3: 'text-lg md:text-xl lg:text-2xl',
    
    // Body text responsive
    body: 'text-sm md:text-base',
    caption: 'text-xs md:text-sm',
  },
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type ResponsiveLayoutKey = keyof typeof responsivePatterns.layouts;