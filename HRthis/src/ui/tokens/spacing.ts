/**
 * Spacing System - 4px Base Unit
 * Konsistente Abstände für das gesamte UI-System
 */

// Base spacing scale (4px increments)
export const spacing = {
  0: '0px',
  1: '4px',     // 0.25rem
  2: '8px',     // 0.5rem  
  3: '12px',    // 0.75rem
  4: '16px',    // 1rem
  5: '20px',    // 1.25rem
  6: '24px',    // 1.5rem
  8: '32px',    // 2rem
  10: '40px',   // 2.5rem
  12: '48px',   // 3rem
  16: '64px',   // 4rem
  20: '80px',   // 5rem
  24: '96px',   // 6rem
} as const;

// Semantic spacing tokens für häufige Use Cases
export const spacingTokens = {
  // Container & Layout
  container: {
    padding: spacing[6],      // 24px - Standard Container Padding
    maxWidth: '1280px',       // 7xl equivalent
  },
  
  // Grid System
  grid: {
    gap: {
      xs: spacing[2],         // 8px - Enge Abstände
      sm: spacing[3],         // 12px - Kleine Abstände  
      md: spacing[6],         // 24px - Standard Grid Gap
      lg: spacing[8],         // 32px - Große Abstände
      xl: spacing[12],        // 48px - Extra große Abstände
    },
  },
  
  // Card System
  card: {
    padding: {
      sm: spacing[4],         // 16px - Kleine Cards
      md: spacing[6],         // 24px - Standard Cards
      lg: spacing[8],         // 32px - Große Cards
    },
    margin: spacing[6],       // 24px - Standard Card Abstand
  },
  
  // Component Spacing
  component: {
    xs: spacing[1],           // 4px - Sehr kleine Abstände
    sm: spacing[2],           // 8px - Kleine Abstände
    md: spacing[4],           // 16px - Standard Abstände
    lg: spacing[6],           // 24px - Große Abstände
    xl: spacing[8],           // 32px - Extra große Abstände
  },
  
  // Section Spacing
  section: {
    sm: spacing[8],           // 32px - Kleine Sections
    md: spacing[12],          // 48px - Standard Sections
    lg: spacing[16],          // 64px - Große Sections
    xl: spacing[20],          // 80px - Extra große Sections
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingTokenKey = keyof typeof spacingTokens;