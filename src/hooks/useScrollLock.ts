"use client";

import { useEffect } from 'react';

/**
 * Hook pour verrouiller le défilement du body lorsqu'un modal/drawer est ouvert
 * Particulièrement utile sur mobile pour empêcher le défilement de la page en arrière-plan
 * 
 * @param isLocked - Si true, le défilement est verrouillé
 */
export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return;
    }

    // Sauvegarder la position de défilement actuelle
    const scrollY = window.scrollY;
    
    // Sauvegarder les styles originaux
    const originalStyle = window.getComputedStyle(document.body);
    const originalOverflow = originalStyle.overflow;
    const originalPaddingRight = originalStyle.paddingRight;
    
    // Calculer la largeur de la barre de défilement
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Appliquer les styles pour verrouiller le défilement
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Restaurer les styles originaux
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restaurer la position de défilement
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
} 