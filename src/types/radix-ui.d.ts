declare module '@radix-ui/themes' {
  import * as React from 'react';

  // Définition des types de base
  export type ThemeProps = {
    children?: React.ReactNode;
    appearance?: 'light' | 'dark';
    accentColor?: string;
    grayColor?: string;
    panelBackground?: string;
    radius?: string;
    scaling?: string;
  };

  // Composants
  export const Theme: React.FC<ThemeProps>;
  export const Box: React.FC<any>;
  export const Container: React.FC<any>;
  export const Flex: React.FC<any>;
  export const Grid: React.FC<any>;
  export const Text: React.FC<any>;
  export const Card: React.FC<any>;
  export const Button: React.FC<any>;
  export const Avatar: React.FC<any>;
  export const Badge: React.FC<any>;
  export const Heading: React.FC<any>;
  export const Separator: React.FC<any>;
  export const Switch: React.FC<any>;
  export const TextField: React.FC<any>;
  
  // Select component and its nested components
  export const Select: {
    Root: React.FC<any>;
    Trigger: React.FC<any>;
    Content: React.FC<any>;
    Item: React.FC<any>;
  };
  
  // Dialog component and its nested components
  export const Dialog: {
    Root: React.FC<any>;
    Trigger: React.FC<any>;
    Content: React.FC<any>;
    Title: React.FC<any>;
    Description: React.FC<any>;
    Close: React.FC<any>;
  };
  
  // Popover component and its nested components
  export const Popover: {
    Root: React.FC<any>;
    Trigger: React.FC<any>;
    Content: React.FC<any>;
  };

  // Fonctions
  export const keyframes: (frames: Record<string, any>) => string;
} 