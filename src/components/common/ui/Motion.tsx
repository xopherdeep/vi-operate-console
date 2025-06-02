import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type MotionVariant = 
  | 'hover-lift'
  | 'hover-scale'
  | 'hover-glow'
  | 'none';

export type MotionTransition = 
  | 'fast'
  | 'medium'
  | 'slow'
  | 'none';

export interface MotionProps {
  children: ReactNode;
  variant?: MotionVariant;
  transition?: MotionTransition;
  className?: string;
  as?: React.ElementType;
  onClick?: () => void;
}

export const Motion: React.FC<MotionProps> = ({
  children,
  variant = 'none',
  transition = 'medium',
  className = '',
  as: Component = 'div',
  onClick,
  ...props
}) => {
  const variantClass = variant !== 'none' ? variant : '';
  const transitionClass = transition !== 'none' ? `transition-${transition}` : '';

  return (
    <Component
      className={cn(variantClass, transitionClass, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Motion;