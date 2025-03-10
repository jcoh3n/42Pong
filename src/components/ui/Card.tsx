"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Composant Card responsive pour afficher du contenu de manière cohérente
 */
export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg
        shadow-sm
        overflow-hidden
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Composant pour le contenu de la Card
 */
export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Composant pour l'en-tête de la Card
 */
export function CardHeader({ title, subtitle, action, className = "" }: CardHeaderProps) {
  return (
    <div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Composant pour le pied de page de la Card
 */
export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
} 