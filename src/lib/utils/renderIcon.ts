import * as LucideIcons from 'lucide-react';
import React from 'react';
import { IconData } from '@/types/common';

/**
 * Converts an IconData object to a React element
 * 
 * @param iconData - The icon data object to render
 * @returns A React element representing the icon
 */
export const renderIcon = (iconData: IconData): React.ReactNode => {
  if (!iconData) return null;

  const IconComponent = (LucideIcons as Record<string, React.ComponentType<any>>)[iconData.type];
  if (!IconComponent) return null;

  return React.createElement(IconComponent, iconData.props);
};
