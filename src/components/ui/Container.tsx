"use client";

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: boolean;
}

/**
 * Composant Container responsive qui s'adapte aux différentes tailles d'écran
 * Ajoute automatiquement des marges et un padding adaptatif
 */
export function Container({ 
  children, 
  className = "", 
  maxWidth = 'xl',
  padding = true 
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'sm:max-w-[540px]',
    md: 'md:max-w-[720px]',
    lg: 'lg:max-w-[960px]',
    xl: 'xl:max-w-[1140px]',
    '2xl': '2xl:max-w-[1320px]',
    full: 'max-w-full',
    none: ''
  };

  return (
    <div 
      className={`
        w-full 
        mx-auto 
        ${padding ? 'px-4 sm:px-6 md:px-8 lg:px-10' : ''}
        ${maxWidth !== 'none' ? maxWidthClasses[maxWidth] : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Composant pour créer une grille responsive
 */
export function Grid({ 
  children, 
  className = "",
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 'md'
}: GridProps) {
  const colClasses = {
    xs: `grid-cols-${cols.xs || 1}`,
    sm: cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    md: cols.md ? `md:grid-cols-${cols.md}` : '',
    lg: cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    xl: cols.xl ? `xl:grid-cols-${cols.xl}` : '',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8 md:gap-10',
  };

  return (
    <div 
      className={`
        grid 
        ${colClasses.xs}
        ${colClasses.sm}
        ${colClasses.md}
        ${colClasses.lg}
        ${colClasses.xl}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface FlexContainerProps {
  children: ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse' | 'responsive';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

/**
 * Composant pour créer une mise en page flexible responsive
 */
export function FlexContainer({ 
  children, 
  className = "",
  direction = 'responsive',
  gap = 'md',
  align,
  justify
}: FlexContainerProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
    responsive: 'flex-col sm:flex-row'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8 md:gap-10',
  };

  const alignClasses = align ? `items-${align}` : '';
  const justifyClasses = justify ? `justify-${justify}` : '';

  return (
    <div 
      className={`
        flex 
        ${directionClasses[direction]}
        ${gapClasses[gap]}
        ${alignClasses}
        ${justifyClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
} 