declare module '@radix-ui/react-icons' {
  import * as React from 'react';

  export interface IconProps extends React.SVGAttributes<SVGElement> {
    width?: number | string;
    height?: number | string;
    color?: string;
  }

  export const CaretRightIcon: React.FC<IconProps>;
  export const MagnifyingGlassIcon: React.FC<IconProps>;
  export const ClockIcon: React.FC<IconProps>;
  export const TrophyIcon: React.FC<IconProps>;
  export const LineChartIcon: React.FC<IconProps>;
  export const ActivityLogIcon: React.FC<IconProps>;
  export const CaretUpIcon: React.FC<IconProps>;
  export const CaretDownIcon: React.FC<IconProps>;
  export const DotFilledIcon: React.FC<IconProps>;
  export const CalendarIcon: React.FC<IconProps>;
  export const ArrowLeftIcon: React.FC<IconProps>;
  export const StarFilledIcon: React.FC<IconProps>;
  export const BarChartIcon: React.FC<IconProps>;
} 