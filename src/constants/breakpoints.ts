/**
 * Breakpoints standards pour l'application
 * Utilisés pour assurer une cohérence dans les media queries
 */
export const BREAKPOINTS = {
  sm: '640px',   // Small devices (phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // Extra extra large devices
};

/**
 * Media queries prêtes à l'emploi pour useMediaQuery
 */
export const MEDIA_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm})`,
  md: `(min-width: ${BREAKPOINTS.md})`,
  lg: `(min-width: ${BREAKPOINTS.lg})`,
  xl: `(min-width: ${BREAKPOINTS.xl})`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']})`,
  
  // Versions "max-width" pour les requêtes inversées
  maxSm: `(max-width: ${BREAKPOINTS.sm})`,
  maxMd: `(max-width: ${BREAKPOINTS.md})`,
  maxLg: `(max-width: ${BREAKPOINTS.lg})`,
  maxXl: `(max-width: ${BREAKPOINTS.xl})`,
  max2xl: `(max-width: ${BREAKPOINTS['2xl']})`,
}; 