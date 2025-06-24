/**
 * Visual Effects System
 * Shadows, Border Radius, Transitions
 */

// Border Radius (wie in deiner App)
export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',        // Wie deine Cards
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',    // Für Circles, Badges
} as const;

// Box Shadows (subtil, wie in deiner App)
export const boxShadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',                    // Sehr subtil
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',                   // Standard Shadow (wie deine Cards)
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',                  // Elevated Cards
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',                // Hover States
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',                // Modals
} as const;

// Transitions (smooth, wie in deiner App)
export const transitions = {
  fast: '150ms ease-in-out',     // Schnelle Interactions
  normal: '200ms ease-in-out',   // Standard (wie deine Hover)
  slow: '300ms ease-in-out',     // Langsame Transitions
  
  // Spezifische Properties
  colors: 'color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out',
  transform: 'transform 200ms ease-in-out',
  opacity: 'opacity 200ms ease-in-out',
  all: 'all 200ms ease-in-out',
} as const;

// Opacity Values
export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type BoxShadowKey = keyof typeof boxShadow;
export type TransitionKey = keyof typeof transitions;
export type OpacityKey = keyof typeof opacity;
export type ZIndexKey = keyof typeof zIndex;