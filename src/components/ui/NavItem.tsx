"use client";

import { ReactNode } from "react";
import { MobileOnly, DesktopOnly } from "./ResponsiveContainer";
import Link from "next/link";

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
  const commonProps = {
    onClick,
    className: "flex flex-row items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    'aria-label': ariaLabel || label,
    'aria-current': active ? ('page' as const) : undefined,
  };

  const content = (
    <>
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
          <span className={`${active ? 'text-accent-9' : 'text-gray-9'}`}>
            {icon}
          </span>
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
          <span className={`${active ? 'text-accent-9' : 'text-gray-9'}`}>
            {icon}
          </span>
          <p className={`text-xl ${active ? 'text-accent-11 font-medium' : 'text-gray-11 font-normal'}`}>
            {label}
          </p>
        </div>
      </DesktopOnly>
    </>
  );

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {content}
    </button>
  );
} 