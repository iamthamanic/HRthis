/**
 * Card Component
 * Universelle Karten-Komponente für konsistente Container
 */

import React from 'react';
import { cn } from '../../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
  onClick?: () => void;
  fullHeight?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  centerContent?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-white shadow-sm border border-gray-200',
  elevated: 'bg-white shadow-md border-0',
  outlined: 'bg-white border-2 border-gray-200 shadow-none',
  ghost: 'bg-transparent border-0 shadow-none',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

/**
 * Main Card Component
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  clickable = false,
  onClick,
  fullHeight = false,
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
        
        // Height
        fullHeight && 'h-full',
        
        // Interactive styles
        clickable && [
          'cursor-pointer',
          'hover:shadow-md hover:scale-[1.02]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        ],
        
        // Custom classes
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
  actions,
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>{children}</div>
      {actions && <div>{actions}</div>}
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
}) => {
  return (
    <div
      className={cn(
        'flex-grow',
        centerContent && 'flex items-center justify-center',
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
 * Preset Card Variants für häufige Use Cases
 */

// Stats Card (für Dashboard-Statistiken)
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('relative', className)} fullHeight>
      <CardHeader>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      
      <CardContent>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <div className="mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Avatar Card (für Gamification)
interface AvatarCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Card
      className={cn('flex flex-col', className)}
      clickable={!!onClick}
      onClick={onClick}
      fullHeight
    >
      {children}
    </Card>
  );
};

// Info Card (für Details, Formulare)
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  className,
  actions,
}) => {
  return (
    <Card className={className} fullHeight>
      <CardHeader actions={actions}>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};