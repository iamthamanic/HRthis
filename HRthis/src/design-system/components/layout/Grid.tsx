/**
 * Grid System Component
 * Flexibles 12-Spalten Grid-System für konsistente Layouts
 */

import React from 'react';
import { cn } from '../../../utils/cn';

// Grid Container Props
interface GridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  mdCols?: 1 | 2 | 3 | 4 | 6 | 12;
  lgCols?: 1 | 2 | 3 | 4 | 6 | 12;
  xlCols?: 1 | 2 | 3 | 4 | 6 | 12;
}

// Grid Item Props
interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  mdSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  lgSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  xlSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  mdOrder?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lgOrder?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-3',    // 12px
  md: 'gap-6',    // 24px
  lg: 'gap-8',    // 32px
  xl: 'gap-12',   // 48px
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

const orderClasses = {
  1: 'order-1',
  2: 'order-2',
  3: 'order-3',
  4: 'order-4',
  5: 'order-5',
  6: 'order-6',
  7: 'order-7',
  8: 'order-8',
  9: 'order-9',
  10: 'order-10',
  11: 'order-11',
  12: 'order-12',
};

/**
 * Grid Container Component
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  gap = 'md',
  cols = 1,
  mdCols,
  lgCols,
  xlCols,
}) => {
  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        colsClasses[cols],
        mdCols && `md:${colsClasses[mdCols]}`,
        lgCols && `lg:${colsClasses[lgCols]}`,
        xlCols && `xl:${colsClasses[xlCols]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Grid Item Component
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
        order && orderClasses[order],
        mdOrder && `md:${orderClasses[mdOrder]}`,
        lgOrder && `lg:${orderClasses[lgOrder]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Preset Grid Layouts für häufige Use Cases
 */

// Dashboard Layout (9-3 Split)
export const DashboardGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Grid cols={1} mdCols={12} gap="md" className={className}>
    {children}
  </Grid>
);

// Drei-Spalten Layout (gleichmäßig)
export const ThreeColumnGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Grid cols={1} mdCols={3} gap="md" className={className}>
    {children}
  </Grid>
);

// Zwei-Spalten Layout (gleichmäßig)
export const TwoColumnGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Grid cols={1} mdCols={2} gap="md" className={className}>
    {children}
  </Grid>
);

// Stats Grid (responsive stats cards)
export const StatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Grid cols={1} mdCols={3} lgCols={3} gap="md" className={className}>
    {children}
  </Grid>
);