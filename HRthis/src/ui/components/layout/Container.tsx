/**
 * Container System - Page Layout & Spacing
 * Konsistente Container für alle Seiten
 */

import React from 'react';
import { cn } from '../../../utils/cn';

// Base Container Props
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

// Page Container Props
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'default' | 'white' | 'gray';
}

// Section Props
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  separator?: boolean;
}

// CSS Class Mappings
const sizeClasses = {
  sm: 'max-w-2xl',      // 672px
  md: 'max-w-4xl',      // 896px
  lg: 'max-w-6xl',      // 1152px
  xl: 'max-w-7xl',      // 1280px (wie deine App)
  full: 'max-w-none',
};

const paddingClasses = {
  none: 'px-0 py-0',
  sm: 'px-4 py-4',      // Mobile
  md: 'px-6 py-6',      // Standard (wie deine App)
  lg: 'px-8 py-8',      // Desktop
};

const spacingClasses = {
  sm: 'mb-6',           // 24px
  md: 'mb-8',           // 32px
  lg: 'mb-12',          // 48px
  xl: 'mb-16',          // 64px
};

const backgroundClasses = {
  default: 'bg-gray-50',     // Wie deine App
  white: 'bg-white',
  gray: 'bg-gray-100',
};

/**
 * Base Container Component
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'xl',
  padding = 'md',
  centered = true,
}) => {
  return (
    <div
      className={cn(
        sizeClasses[size],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Page Container - Vollständiger Page Wrapper
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  breadcrumbs,
  backButton = false,
  onBack,
  maxWidth = 'xl',
  background = 'default',
}) => {
  return (
    <div className={cn('flex-1 min-h-screen', backgroundClasses[background])}>
      <Container size={maxWidth} className={className}>
        {/* Page Header */}
        {(breadcrumbs || backButton || title || subtitle || actions) && (
          <div className="mb-6">
            {/* Navigation */}
            {(breadcrumbs || backButton) && (
              <div className="mb-4">
                {backButton && onBack && (
                  <button 
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium mb-2"
                  >
                    ← Zurück
                  </button>
                )}
                {breadcrumbs}
              </div>
            )}
            
            {/* Title Section */}
            {(title || subtitle || actions) && (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-gray-600 text-sm md:text-base">
                      {subtitle}
                    </p>
                  )}
                </div>
                
                {actions && (
                  <div className="flex items-center gap-3 ml-6">
                    {actions}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Page Content */}
        {children}
      </Container>
    </div>
  );
};

/**
 * Section Component - Content Sections mit optionalem Titel
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  spacing = 'md',
  separator = false,
}) => {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {/* Section Header */}
      {(title || subtitle || actions) && (
        <div className={cn('mb-6', separator && 'pb-4 border-b border-gray-200')}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Section Content */}
      {children}
    </section>
  );
};

/**
 * Content Area - Main/Sidebar Layout
 */
interface ContentAreaProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'narrow' | 'normal' | 'wide';
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const sidebarWidths = {
  narrow: 'w-64',     // 256px
  normal: 'w-80',     // 320px  
  wide: 'w-96',       // 384px
};

const gapSizes = {
  sm: 'gap-4',        // 16px
  md: 'gap-6',        // 24px
  lg: 'gap-8',        // 32px
};

export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'normal',
  className,
  gap = 'md',
}) => {
  if (!sidebar) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('flex flex-col lg:flex-row', gapSizes[gap], className)}>
      {sidebarPosition === 'left' && sidebar && (
        <aside className={cn('flex-shrink-0 lg:order-1', sidebarWidths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
      
      <main className="flex-1 lg:order-2">
        {children}
      </main>
      
      {sidebarPosition === 'right' && sidebar && (
        <aside className={cn('flex-shrink-0 lg:order-3', sidebarWidths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
    </div>
  );
};

/**
 * Header Card Component (wie dein Dashboard Header)
 */
interface HeaderCardProps {
  children: React.ReactNode;
  className?: string;
  background?: boolean;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  children,
  className,
  background = true,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl p-6 mb-6',
        background && 'bg-white shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Stack Component - Vertikale Layouts
 */
interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const stackSpacingClasses = {
  xs: 'space-y-2',      // 8px
  sm: 'space-y-3',      // 12px
  md: 'space-y-6',      // 24px
  lg: 'space-y-8',      // 32px
  xl: 'space-y-12',     // 48px
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        stackSpacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Inline Component - Horizontale Layouts
 */
interface InlineProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

const inlineSpacingClasses = {
  xs: 'space-x-1',      // 4px
  sm: 'space-x-2',      // 8px
  md: 'space-x-4',      // 16px
  lg: 'space-x-6',      // 24px
  xl: 'space-x-8',      // 32px
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const inlineAlignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

export const Inline: React.FC<InlineProps> = ({
  children,
  className,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
}) => {
  return (
    <div
      className={cn(
        'flex',
        inlineSpacingClasses[spacing],
        inlineAlignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};