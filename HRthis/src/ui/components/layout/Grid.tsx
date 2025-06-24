/**
 * Grid System - 12-Column Layout
 * Flexibles, responsives Grid-System für deine App
 */

import React from 'react';
import { cn } from '../../../utils/cn';

// Grid Container Props
interface GridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  mdCols?: 1 | 2 | 3 | 4 | 6 | 12;
  lgCols?: 1 | 2 | 3 | 4 | 6 | 12;
  xlCols?: 1 | 2 | 3 | 4 | 6 | 12;
  responsive?: boolean; // Auto-responsive behavior
}

// Grid Item Props  
interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  mdSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  lgSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  xlSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  order?: number;
  mdOrder?: number;
  lgOrder?: number;
}

// CSS Class Mappings
const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',      // 8px
  sm: 'gap-3',      // 12px  
  md: 'gap-6',      // 24px (Standard)
  lg: 'gap-8',      // 32px
  xl: 'gap-12',     // 48px
};

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2', 
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const spanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
  full: 'col-span-full',
};

/**
 * Main Grid Container
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  gap = 'md',
  cols = 1,
  mdCols,
  lgCols,
  xlCols,
  responsive = true,
}) => {
  const responsiveClasses = responsive ? {
    // Auto-responsive: 1 -> 2 -> 3 -> 4 columns
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-12',
  } : {};

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        responsive ? responsiveClasses[cols] : colsClasses[cols],
        mdCols && !responsive && `md:${colsClasses[mdCols]}`,
        lgCols && !responsive && `lg:${colsClasses[lgCols]}`,
        xlCols && !responsive && `xl:${colsClasses[xlCols]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Grid Item
 */
export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span = 1,
  mdSpan,
  lgSpan,
  xlSpan,
  order,
  mdOrder,
  lgOrder,
}) => {
  return (
    <div
      className={cn(
        spanClasses[span],
        mdSpan && `md:${spanClasses[mdSpan]}`,
        lgSpan && `lg:${spanClasses[lgSpan]}`,
        xlSpan && `xl:${spanClasses[xlSpan]}`,
        order && `order-${order}`,
        mdOrder && `md:order-${mdOrder}`,
        lgOrder && `lg:order-${lgOrder}`,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Preset Grid Layouts - Ready-to-use für häufige Patterns
 */

// Dashboard Grid (9-3 Split wie in deiner App)
export const DashboardGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <Grid cols={1} mdCols={12} gap="md" responsive={false} className={className}>
    {children}
  </Grid>
);

// Stats Grid (1->2->3 responsive, wie deine Dashboard-Karten)
export const StatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <Grid cols={3} gap="md" className={className}>
    {children}
  </Grid>
);

// Two Column Grid (gleichmäßig)
export const TwoColumnGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <Grid cols={2} gap="md" className={className}>
    {children}
  </Grid>
);

// Four Column Grid (für Listen, Cards)
export const FourColumnGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <Grid cols={4} gap="md" className={className}>
    {children}
  </Grid>
);

// Auto Grid (automatische Spalten basierend auf Content)
export const AutoGrid: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  minWidth?: string;
}> = ({ 
  children, 
  className, 
  minWidth = '250px'
}) => (
  <div 
    className={cn('grid gap-6', className)}
    style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` }}
  >
    {children}
  </div>
);

/**
 * Layout Utilities für spezifische Use Cases
 */

// Dashboard Main/Sidebar Layout
export const DashboardMainSidebar: React.FC<{
  main: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}> = ({ main, sidebar, sidebarPosition = 'right', className }) => (
  <DashboardGrid className={className}>
    {sidebarPosition === 'left' && (
      <GridItem span="full" mdSpan={3}>
        {sidebar}
      </GridItem>
    )}
    
    <GridItem span="full" mdSpan={9}>
      {main}
    </GridItem>
    
    {sidebarPosition === 'right' && (
      <GridItem span="full" mdSpan={3}>
        {sidebar}
      </GridItem>
    )}
  </DashboardGrid>
);

// Content mit optionaler Sidebar
export const ContentWithSidebar: React.FC<{
  content: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarWidth?: 'narrow' | 'normal' | 'wide';
  className?: string;
}> = ({ content, sidebar, sidebarWidth = 'normal', className }) => {
  const sidebarSpans = {
    narrow: 2,   // 2/12
    normal: 3,   // 3/12  
    wide: 4,     // 4/12
  };
  
  const contentSpan = sidebar ? 12 - sidebarSpans[sidebarWidth] : 12;
  
  return (
    <DashboardGrid className={className}>
      <GridItem span="full" mdSpan={contentSpan as any}>
        {content}
      </GridItem>
      
      {sidebar && (
        <GridItem span="full" mdSpan={sidebarSpans[sidebarWidth] as any}>
          {sidebar}
        </GridItem>
      )}
    </DashboardGrid>
  );
};