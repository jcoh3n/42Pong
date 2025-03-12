"use client";

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Vérifier si window est défini (côté client)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Définir l'état initial
      setMatches(media.matches);
      
      // Créer un gestionnaire d'événements pour les changements
      const listener = () => setMatches(media.matches);
      
      // Ajouter l'écouteur d'événements
      media.addEventListener('change', listener);
      
      // Nettoyer l'écouteur d'événements lors du démontage
      return () => media.removeEventListener('change', listener);
    }
    
    // Valeur par défaut pour le rendu côté serveur
    return () => {};
  }, [query]);

  return matches;
} 