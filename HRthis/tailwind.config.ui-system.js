/**
 * Tailwind Configuration für UI System
 * Erweiterte Konfiguration mit Design Tokens
 * 
 * Ersetze deine bestehende tailwind.config.js mit dieser Datei
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Color System - Basierend auf deiner App
      colors: {
        // Erweiterte Graustufen (deine Hauptfarben)
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        
        // Primary Blue (deine Button-Farbe)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Gamification Colors
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        
        // Semantic Color Aliases
        'text-primary': '#111827',        // gray-900
        'text-secondary': '#4b5563',      // gray-600  
        'text-tertiary': '#6b7280',       // gray-500
        'bg-primary': '#ffffff',          // white
        'bg-secondary': '#f9fafb',        // gray-50
        'border-light': '#e5e7eb',        // gray-200
        'border-medium': '#d1d5db',       // gray-300
        'interactive-primary': '#2563eb', // blue-600
        'interactive-hover': '#1d4ed8',   // blue-700
      },
      
      // Spacing System - 4px Base Unit
      spacing: {
        // Zusätzliche Spacing-Werte
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        '26': '6.5rem',    // 104px
        '30': '7.5rem',    // 120px
        '34': '8.5rem',    // 136px
        '38': '9.5rem',    // 152px
      },
      
      // Typography System
      fontSize: {
        // Erweiterte Font Sizes
        '2xs': ['10px', { lineHeight: '1.25' }],
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.75' }],
        xl: ['20px', { lineHeight: '1.75' }],
        '2xl': ['24px', { lineHeight: '1.25' }],
        '3xl': ['30px', { lineHeight: '1.25' }],
        '4xl': ['36px', { lineHeight: '1.25' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
      },
      
      // Font Weights
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      // Border Radius - Wie in deiner App
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',       // Standard für Cards
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
      
      // Box Shadows - Subtil wie in deiner App
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',       // Standard
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',    // Elevated
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',  // Hover
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',  // Modal
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        none: 'none',
      },
      
      // Animation & Transitions
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
        'ease-out': 'ease-out',
        'ease-in': 'ease-in',
      },
      
      // Container System
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '1.5rem',
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
      
      // Grid System Extensions
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      
      // Animations
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'bounce-subtle': 'bounceSubtle 400ms ease-in-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      
      // Z-Index Scale
      zIndex: {
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        overlay: '1300',
        modal: '1400',
        popover: '1500',
        tooltip: '1600',
        toast: '1700',
      },
    },
  },
  plugins: [
    // Custom Utilities Plugin
    function({ addUtilities, addComponents, theme }) {
      // Component Classes
      addComponents({
        // Card Components
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: theme('transitionProperty.all') + ' ' + theme('transitionDuration.DEFAULT'),
        },
        '.card-elevated': {
          boxShadow: theme('boxShadow.md'),
          border: 'none',
        },
        '.card-interactive': {
          cursor: 'pointer',
          '&:hover': {
            boxShadow: theme('boxShadow.lg'),
            transform: 'scale(1.02)',
          },
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: theme('colors.blue.500'),
            ringOffsetWidth: '2px',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        
        // Typography Components
        '.text-heading-1': {
          fontSize: theme('fontSize.3xl')[0],
          lineHeight: theme('fontSize.3xl')[1].lineHeight,
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: '-0.025em',
          color: theme('colors.gray.900'),
        },
        '.text-heading-2': {
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: theme('fontSize.2xl')[1].lineHeight,
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.gray.900'),
        },
        '.text-heading-3': {
          fontSize: theme('fontSize.xl')[0],
          lineHeight: theme('fontSize.xl')[1].lineHeight,
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.gray.900'),
        },
        '.text-body': {
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('fontSize.base')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
          color: theme('colors.gray.900'),
        },
        '.text-body-secondary': {
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('fontSize.base')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
          color: theme('colors.gray.600'),
        },
        '.text-caption': {
          fontSize: theme('fontSize.xs')[0],
          lineHeight: theme('fontSize.xs')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
          color: theme('colors.gray.500'),
        },
        '.text-stat-large': {
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: theme('fontSize.2xl')[1].lineHeight,
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.gray.900'),
        },
        
        // Layout Components
        '.container-page': {
          maxWidth: theme('maxWidth.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          paddingTop: theme('spacing.6'),
          paddingBottom: theme('spacing.6'),
        },
        
        // Interactive Elements
        '.interactive': {
          transition: theme('transitionProperty.all') + ' ' + theme('transitionDuration.DEFAULT'),
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
        
        // Button Components
        '.btn-primary': {
          backgroundColor: theme('colors.blue.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.medium'),
          transition: theme('transitionProperty.colors'),
          '&:hover': {
            backgroundColor: theme('colors.blue.700'),
          },
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: theme('colors.blue.500'),
            ringOffsetWidth: '2px',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.200'),
          color: theme('colors.gray.700'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.medium'),
          transition: theme('transitionProperty.colors'),
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
        },
      });
      
      // Utility Classes
      addUtilities({
        // Aspect Ratios
        '.aspect-card': {
          aspectRatio: '3 / 2',
        },
        '.aspect-square': {
          aspectRatio: '1 / 1',
        },
        
        // Truncate Text
        '.truncate-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.truncate-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        
        // Glassmorphism
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        
        // Safe Areas (für Mobile)
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
      });
    },
    
    // Form Plugin für bessere Form-Styles
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};