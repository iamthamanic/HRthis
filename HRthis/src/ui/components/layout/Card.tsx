/**
 * Card System - Universelle Container für deine App
 * Ersetzt deine bestehenden Box-Komponenten mit konsistentem Design
 */

import React from 'react';
import { cn } from '../../../utils/cn';

// Base Card Props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
  fullHeight?: boolean;
  interactive?: boolean; // Hover effects
}

// Card Header Props
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

// Card Content Props
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  centerContent?: boolean;
  scrollable?: boolean;
}

// Card Footer Props
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// CSS Class Mappings
const variantClasses = {
  default: 'bg-white border border-gray-200',           // Standard (wie deine Cards)
  elevated: 'bg-white border-0 shadow-md',             // Mit Shadow
  outlined: 'bg-white border-2 border-gray-300',       // Emphasized Border
  ghost: 'bg-transparent border-0 shadow-none',        // Transparent
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',        // 16px (kleine Cards)
  md: 'p-6',        // 24px (Standard, wie deine Cards)
  lg: 'p-8',        // 32px (große Cards)
};

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md', 
  lg: 'rounded-lg',
  xl: 'rounded-xl',  // Standard (wie deine Cards)
};

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',   // Standard (wie deine Cards)
  md: 'shadow-md',   // Elevated
  lg: 'shadow-lg',   // Hover/Focus
};

/**
 * Base Card Component
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  shadow = 'sm',
  clickable = false,
  onClick,
  fullHeight = false,
  interactive = false,
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        // Base styles
        'transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        radiusClasses[radius],
        variant === 'default' && shadowClasses[shadow],
        
        // Layout
        fullHeight && 'h-full',
        'flex flex-col', // Für konsistentes Layout
        
        // Interactive styles
        (clickable || interactive) && [
          'cursor-pointer',
          'hover:shadow-lg hover:scale-[1.02]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'active:scale-[0.98]',
        ],
        
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

/**
 * Card Header Component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  title,
  subtitle,
  actions,
  icon,
}) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
          {!title && !subtitle && children}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
};

/**
 * Card Content Component
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  centerContent = false,
  scrollable = false,
}) => {
  return (
    <div
      className={cn(
        'flex-grow',
        centerContent && 'flex items-center justify-center',
        scrollable && 'overflow-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

/**
 * Preset Card Components für häufige Use Cases
 */

// Stats Card (wie deine Dashboard-Karten)
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  onClick,
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600', 
    neutral: 'text-gray-600',
  };

  return (
    <Card 
      className={className} 
      clickable={!!onClick}
      onClick={onClick}
      fullHeight
    >
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>
      </CardHeader>
      
      <CardContent>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2">
              <span className={cn('text-sm font-medium', trendColors[trend.direction])}>
                {trend.direction === 'up' && '↗ '}
                {trend.direction === 'down' && '↘ '}
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Info Card (wie deine Beschäftigungsdetails)
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  className,
  actions,
  icon,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <Card className={className} fullHeight>
      <CardHeader
        title={title}
        icon={icon}
        actions={
          <div className="flex items-center gap-2">
            {actions}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isCollapsed ? '▼' : '▲'}
              </button>
            )}
          </div>
        }
      >
        {/* Empty children for CardHeader */}
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

// Avatar Card (wie deine Gamification-Card)
interface AvatarCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  children,
  className,
  onClick,
  compact = false,
}) => {
  return (
    <Card
      className={cn('relative', compact && 'p-4', className)}
      clickable={!!onClick}
      onClick={onClick}
      fullHeight
      interactive={!!onClick}
    >
      {children}
    </Card>
  );
};

// Action Card (mit Primary Action)
interface ActionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <Card className={className} clickable onClick={action.onClick} fullHeight>
      <CardContent centerContent>
        <div className="text-center">
          {icon && (
            <div className="text-3xl mb-4">{icon}</div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 mb-4">
              {description}
            </p>
          )}
          <span className="text-blue-600 font-medium">
            {action.label} →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Card
interface EmptyStateCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <Card className={className} variant="ghost" fullHeight>
      <CardContent centerContent>
        <div className="text-center py-8">
          {icon && (
            <div className="text-4xl mb-4 opacity-50">{icon}</div>
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};