/**
 * Ant Design Theme Configuration
 * Provides design tokens that work with both Ant Design and Radix UI
 */

import { ThemeConfig } from 'antd';
import { blue, green, red, orange, gray } from '@ant-design/colors';

export const antdTheme: ThemeConfig = {
  token: {
    // Primary Colors (HRthis Blue)
    colorPrimary: '#1890ff',
    colorSuccess: green[6],
    colorWarning: orange[6],
    colorError: red[6],
    colorInfo: blue[6],
    
    // Background Colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    
    // Text Colors
    colorText: '#000000',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    
    // Border & Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // Typography
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    
    // Spacing
    size: 16,
    sizeStep: 4,
    sizeUnit: 4,
    
    // Height Controls
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 6px 16px rgba(0, 0, 0, 0.08)',
    
    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 32,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 32,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Table: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 12,
    },
    Drawer: {
      borderRadius: 12,
    }
  }
};

// CSS Variables für Radix UI Komponenten
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${antdTheme.token?.colorPrimary};
    --color-success: ${antdTheme.token?.colorSuccess};
    --color-warning: ${antdTheme.token?.colorWarning};
    --color-error: ${antdTheme.token?.colorError};
    --color-text: ${antdTheme.token?.colorText};
    --color-text-secondary: ${antdTheme.token?.colorTextSecondary};
    --color-bg: ${antdTheme.token?.colorBgBase};
    --color-bg-container: ${antdTheme.token?.colorBgContainer};
    
    /* Border Radius */
    --border-radius: ${antdTheme.token?.borderRadius}px;
    --border-radius-lg: ${antdTheme.token?.borderRadiusLG}px;
    --border-radius-sm: ${antdTheme.token?.borderRadiusSM}px;
    
    /* Typography */
    --font-size: ${antdTheme.token?.fontSize}px;
    --font-size-lg: ${antdTheme.token?.fontSizeLG}px;
    --font-size-sm: ${antdTheme.token?.fontSizeSM}px;
    --font-family: ${antdTheme.token?.fontFamily};
    
    /* Control Heights */
    --control-height: ${antdTheme.token?.controlHeight}px;
    --control-height-lg: ${antdTheme.token?.controlHeightLG}px;
    --control-height-sm: ${antdTheme.token?.controlHeightSM}px;
    
    /* Shadows */
    --box-shadow: ${antdTheme.token?.boxShadow};
    --box-shadow-secondary: ${antdTheme.token?.boxShadowSecondary};
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
  }
`;

// Tailwind-kompatible Klassen basierend auf Ant Design Tokens
export const themeClasses = {
  colors: {
    primary: 'text-[var(--color-primary)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    error: 'text-[var(--color-error)]',
    text: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
  },
  backgrounds: {
    primary: 'bg-[var(--color-primary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
    container: 'bg-[var(--color-bg-container)]',
  },
  spacing: {
    xs: 'p-[var(--spacing-xs)]',
    sm: 'p-[var(--spacing-sm)]',
    md: 'p-[var(--spacing-md)]',
    lg: 'p-[var(--spacing-lg)]',
    xl: 'p-[var(--spacing-xl)]',
  },
  borders: {
    radius: 'rounded-[var(--border-radius)]',
    radiusLg: 'rounded-[var(--border-radius-lg)]',
    radiusSm: 'rounded-[var(--border-radius-sm)]',
  },
  heights: {
    control: 'h-[var(--control-height)]',
    controlLg: 'h-[var(--control-height-lg)]',
    controlSm: 'h-[var(--control-height-sm)]',
  }
};