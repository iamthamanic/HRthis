/**
 * Spacing Design Tokens
 * Konsistente Abstände für das gesamte UI-System
 */

export const spacing = {
  // Base spacing scale (0.25rem = 4px base unit)
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
} as const;

// Semantic spacing tokens
export const semanticSpacing = {
  // Container spacing
  containerPadding: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[6],  // 24px
  },
  
  // Grid gaps
  gridGap: {
    tight: spacing[3],    // 12px
    normal: spacing[6],   // 24px
    loose: spacing[8],    // 32px
  },
  
  // Component spacing
  componentSpacing: {
    xs: spacing[2],       // 8px
    sm: spacing[3],       // 12px
    md: spacing[4],       // 16px
    lg: spacing[6],       // 24px
    xl: spacing[8],       // 32px
  },
  
  // Card padding
  cardPadding: {
    sm: spacing[4],       // 16px
    md: spacing[6],       // 24px
    lg: spacing[8],       // 32px
  },
  
  // Page sections
  sectionSpacing: {
    sm: spacing[8],       // 32px
    md: spacing[12],      // 48px
    lg: spacing[16],      // 64px
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type SemanticSpacingKey = keyof typeof semanticSpacing;