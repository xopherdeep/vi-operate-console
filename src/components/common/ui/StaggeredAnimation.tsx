import React, { ReactNode } from 'react';
import { Animate, AnimationType } from './Animate';

export interface StaggeredAnimationProps {
  children: ReactNode;
  type: AnimationType;
  staggerDelay?: number; // Delay between each child in milliseconds
  initialDelay?: number; // Initial delay before the first animation
  className?: string;
  childClassName?: string;
  duration?: number;
  playOnVisible?: boolean;
  direction?: 'row' | 'column'; // Animation direction for grid layouts
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  type,
  staggerDelay = 250, // Increased default delay to 250ms
  initialDelay = 0,
  className = '',
  childClassName = '',
  duration,
  playOnVisible = false,
  direction = 'row', // Default to row direction
}) => {
  const childrenArray = React.Children.toArray(children);
  
  // For grid layouts, we need to apply the delay differently based on direction
  const getDelay = (index: number) => {
    return initialDelay + staggerDelay * index;
  };
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <Animate
          key={index}
          type={type}
          delay={getDelay(index)}
          duration={duration}
          playOnVisible={playOnVisible}
          className={childClassName}
        >
          {child}
        </Animate>
      ))}
    </div>
  );
};

export default StaggeredAnimation;