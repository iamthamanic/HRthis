/**
 * Container Component
 * Konsistente Container für Seiten-Layouts
 */

import React from 'react';
import { cn } from '../../../utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
}

const sizeClasses = {
  sm: 'max-w-2xl',      // 672px
  md: 'max-w-4xl',      // 896px  
  lg: 'max-w-6xl',      // 1152px
  xl: 'max-w-7xl',      // 1280px
  full: 'max-w-none',
};

const paddingClasses = {
  none: 'px-0 py-0',
  sm: 'px-4 py-4',
  md: 'px-6 py-6',
  lg: 'px-8 py-8',
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
 * Page Container Component
 * Vollständiger Container für Seiten mit Header, Titel etc.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  backButton = false,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <Container size="xl" className={className}>
        {/* Page Header */}
        {(title || subtitle || actions || backButton) && (
          <div className="mb-6">
            {/* Back Button */}
            {backButton && onBack && (
              <button 
                onClick={onBack}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                ← Zurück
              </button>
            )}
            
            {/* Title Section */}
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {/* Actions */}
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        {children}
      </Container>
    </div>
  );
};

/**
 * Section Container
 * Container für Seiten-Abschnitte mit optionalem Titel
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

const spacingClasses = {
  sm: 'mb-8',
  md: 'mb-12',
  lg: 'mb-16',
};

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  title,
  subtitle,
  spacing = 'md',
}) => {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Section Content */}
      {children}
    </section>
  );
};

/**
 * Content Area
 * Bereich für Haupt-Inhalt mit optionalem Sidebar
 */
interface ContentAreaProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  sidebar,
  sidebarPosition = 'right',
  className,
}) => {
  if (!sidebar) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('grid lg:grid-cols-12 gap-6', className)}>
      {sidebarPosition === 'left' && sidebar && (
        <aside className="lg:col-span-3">
          {sidebar}
        </aside>
      )}
      
      <main className={cn(
        sidebar ? 'lg:col-span-9' : 'lg:col-span-12'
      )}>
        {children}
      </main>
      
      {sidebarPosition === 'right' && sidebar && (
        <aside className="lg:col-span-3">
          {sidebar}
        </aside>
      )}
    </div>
  );
};