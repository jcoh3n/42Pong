"use client";

import { ReactNode } from "react";
import { MobileOnly, DesktopOnly } from "./ResponsiveContainer";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  href?: string;
  ariaLabel?: string;
}

/**
 * Composant de navigation responsive qui s'adapte aux différentes tailles d'écran
 * Affiche uniquement l'icône sur mobile et l'icône + label sur desktop
 */
export function NavItem({ 
  icon, 
  label, 
  onClick, 
  active = false, 
  href, 
  ariaLabel 
}: NavItemProps) {
  const Tag = href ? 'a' : 'button';
  const props = href ? { href } : { type: 'button' };
  const accessibilityProps = {
    'aria-label': ariaLabel || label,
    'aria-current': active ? 'page' : undefined,
    role: href ? 'link' : 'button',
  };

  return (
    <Tag 
      {...props} 
      {...accessibilityProps}
      onClick={onClick} 
      className="flex flex-row items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {/* Version Mobile - Uniquement l'icône */}
      <MobileOnly>
        <div
          className={`
            relative
            rounded-full
            h-14
            w-14
            flex items-center
            justify-center
            p-4
            hover:bg-slate-300
            hover:bg-opacity-10
            cursor-pointer
            transition-colors duration-200
            ${active ? 'bg-slate-300 bg-opacity-10' : ''}
          `}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </div>
      </MobileOnly>

      {/* Version Desktop - Icône + Label */}
      <DesktopOnly>
        <div
          className={`
            relative
            rounded-full
            flex
            items-center
            gap-4
            p-4
            hover:bg-slate-300
            hover:bg-opacity-10
            cursor-pointer
            transition-colors duration-200
            ${active ? 'bg-slate-300 bg-opacity-10' : ''}
          `}
        >
          {icon}
          <p className="text-white text-xl">
            {label}
          </p>
        </div>
      </DesktopOnly>
    </Tag>
  );
} 