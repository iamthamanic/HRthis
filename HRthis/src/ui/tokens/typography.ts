/**
 * Typography System
 * Basierend auf deine bestehenden Text-Größen
 */

export const fontSizes = {
  xs: '12px',      // 0.75rem - Caption Text
  sm: '14px',      // 0.875rem - Small Text
  base: '16px',    // 1rem - Body Text
  lg: '18px',      // 1.125rem - Large Body
  xl: '20px',      // 1.25rem - Small Heading
  '2xl': '24px',   // 1.5rem - Medium Heading
  '3xl': '30px',   // 1.875rem - Large Heading
  '4xl': '36px',   // 2.25rem - Extra Large Heading
} as const;

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeights = {
  tight: '1.25',    // Für Headlines
  normal: '1.5',    // Standard Line Height
  relaxed: '1.75',  // Für längere Texte
} as const;

export const letterSpacing = {
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
} as const;

// Semantic Typography System
export const typography = {
  // Headlines (wie in deinem Dashboard)
  heading: {
    h1: {
      fontSize: fontSizes['3xl'],      // 30px
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontSize: fontSizes['2xl'],      // 24px
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.normal,
    },
    h3: {
      fontSize: fontSizes.xl,          // 20px
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
    },
    h4: {
      fontSize: fontSizes.lg,          // 18px
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
    },
  },
  
  // Body Text
  body: {
    large: {
      fontSize: fontSizes.lg,          // 18px
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
    },
    normal: {
      fontSize: fontSizes.base,        // 16px
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
    },
    small: {
      fontSize: fontSizes.sm,          // 14px
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
    },
  },
  
  // UI Text
  ui: {
    caption: {
      fontSize: fontSizes.xs,          // 12px
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
    },
    label: {
      fontSize: fontSizes.sm,          // 14px
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
    },
    button: {
      fontSize: fontSizes.sm,          // 14px
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
    },
  },
  
  // Stats/Numbers (wie in deinen Dashboard-Karten)
  stat: {
    large: {
      fontSize: fontSizes['2xl'],      // 24px
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
    },
    medium: {
      fontSize: fontSizes.xl,          // 20px
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
    },
    small: {
      fontSize: fontSizes.lg,          // 18px
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
    },
  },
} as const;

export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
export type TypographyKey = keyof typeof typography;