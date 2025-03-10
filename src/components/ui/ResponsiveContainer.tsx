"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { ReactNode } from "react";

export interface ResponsiveContainerProps {
  children: ReactNode;
  mobileContent?: ReactNode;
  tabletContent?: ReactNode;
  breakpoint?: keyof typeof MEDIA_QUERIES;
}

/**
 * Composant qui affiche différent contenu en fonction de la taille de l'écran
 * 
 * @param children Contenu par défaut (desktop)
 * @param mobileContent Contenu pour mobile (optionnel)
 * @param tabletContent Contenu pour tablette (optionnel)
 * @param breakpoint Breakpoint à utiliser (par défaut 'lg')
 */
export function ResponsiveContainer({ 
  children, 
  mobileContent, 
  tabletContent,
  breakpoint = 'lg' 
}: ResponsiveContainerProps) {
  const isDesktop = useMediaQuery(MEDIA_QUERIES[breakpoint]);
  const isTablet = useMediaQuery(MEDIA_QUERIES.md);
  
  if (!isDesktop && !isTablet && mobileContent) {
    return <>{mobileContent}</>;
  }
  
  if (!isDesktop && isTablet && tabletContent) {
    return <>{tabletContent}</>;
  }
  
  return <>{children}</>;
}

/**
 * Composant qui n'affiche son contenu que sur mobile
 */
export function MobileOnly({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(MEDIA_QUERIES.lg);
  
  if (isDesktop) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * Composant qui n'affiche son contenu que sur desktop
 */
export function DesktopOnly({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(MEDIA_QUERIES.lg);
  
  if (!isDesktop) {
    return null;
  }
  
  return <>{children}</>;
} 