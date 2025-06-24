/**
 * Extended Tailwind Configuration
 * Integriert die Design-Tokens in Tailwind CSS
 * 
 * Ersetze deine bestehende tailwind.config.js mit diesem Setup
 */

const { colors, spacing, typography, radius, shadows, transitions } = require('./src/design-system/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Colors aus Design-Tokens
      colors: {
        // Base colors
        ...colors,
        
        // Semantic colors als Tailwind utilities
        'text-primary': colors.gray[900],
        'text-secondary': colors.gray[600],
        'text-tertiary': colors.gray[500],
        'bg-primary': colors.white,
        'bg-secondary': colors.gray[50],
        'border-light': colors.gray[200],
        'border-medium': colors.gray[300],
      },
      
      // Spacing aus Design-Tokens
      spacing: {
        ...spacing,
      },
      
      // Typography
      fontSize: {
        xs: [typography.caption.fontSize, { lineHeight: typography.caption.lineHeight }],
        sm: [typography.body.small.fontSize, { lineHeight: typography.body.small.lineHeight }],
        base: [typography.body.normal.fontSize, { lineHeight: typography.body.normal.lineHeight }],
        lg: [typography.body.large.fontSize, { lineHeight: typography.body.large.lineHeight }],
        xl: [typography.heading.h4.fontSize, { lineHeight: typography.heading.h4.lineHeight }],
        '2xl': [typography.heading.h3.fontSize, { lineHeight: typography.heading.h3.lineHeight }],
        '3xl': [typography.heading.h2.fontSize, { lineHeight: typography.heading.h2.lineHeight }],
        '4xl': [typography.heading.h1.fontSize, { lineHeight: typography.heading.h1.lineHeight }],
      },
      
      fontWeight: {
        normal: typography.body.normal.fontWeight,
        medium: typography.label.fontWeight,
        semibold: typography.heading.h4.fontWeight,
        bold: typography.heading.h1.fontWeight,
      },
      
      // Border radius
      borderRadius: {
        ...radius,
      },
      
      // Box shadows
      boxShadow: {
        ...shadows,
      },
      
      // Transitions
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
      
      // Grid system
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      
      // Container queries
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '1.5rem',
          xl: '1.5rem',
          '2xl': '1.5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Plugin für Component-spezifische Utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Card utilities
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.sm'),
          transition: theme('transitionProperty.all') + ' ' + theme('transitionDuration.normal'),
        },
        '.card-elevated': {
          boxShadow: theme('boxShadow.md'),
        },
        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
            transform: 'scale(1.02)',
          },
        },
        
        // Typography utilities
        '.text-heading-1': {
          fontSize: theme('fontSize.4xl')[0],
          lineHeight: theme('fontSize.4xl')[1].lineHeight,
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: '-0.025em',
        },
        '.text-heading-2': {
          fontSize: theme('fontSize.3xl')[0],
          lineHeight: theme('fontSize.3xl')[1].lineHeight,
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: '-0.025em',
        },
        '.text-heading-3': {
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: theme('fontSize.2xl')[1].lineHeight,
          fontWeight: theme('fontWeight.semibold'),
        },
        '.text-body': {
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('fontSize.base')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
        },
        '.text-caption': {
          fontSize: theme('fontSize.xs')[0],
          lineHeight: theme('fontSize.xs')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
        },
        
        // Layout utilities
        '.container-page': {
          maxWidth: theme('maxWidth.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          paddingTop: theme('spacing.6'),
          paddingBottom: theme('spacing.6'),
        },
        
        // Interactive utilities
        '.interactive': {
          transition: theme('transitionProperty.all') + ' ' + theme('transitionDuration.normal'),
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: theme('colors.blue.500'),
            ringOffsetWidth: '2px',
          },
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};