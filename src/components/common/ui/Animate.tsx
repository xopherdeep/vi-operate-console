import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

export type AnimationType =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'float'
  | 'pulse'
  | 'title'
  | 'scale-in'
  | 'scale-out'
  | 'slide-in-bottom'
  | 'slide-in-top'
  | 'bounce'
  | 'shimmer'
  | 'rotate'
  | 'blink'
  | 'none';

export interface AnimateProps {
  children: ReactNode;
  type: AnimationType;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  infinite?: boolean;
  playOnVisible?: boolean; // Animate when element comes into view
  onAnimationEnd?: () => void;
}

export const Animate: React.FC<AnimateProps> = ({
  children,
  type,
  className = '',
  delay = 0,
  duration,
  infinite = false,
  playOnVisible = false,
  onAnimationEnd,
}) => {
  const [isVisible, setIsVisible] = useState(!playOnVisible);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playOnVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [playOnVisible, hasAnimated]);

  const handleAnimationEnd = () => {
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  };

  if (type === 'none') {
    return <>{children}</>;
  }

  const animationClass = `animate-${type}`;
  
  const style: React.CSSProperties = {
    animationDelay: delay ? `${delay}ms` : undefined,
    animationDuration: duration ? `${duration}ms` : undefined,
    animationIterationCount: infinite ? 'infinite' : undefined,
  };

  return (
    <div
      ref={elementRef}
      className={cn(isVisible ? animationClass : 'opacity-0', className)}
      style={style}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

export default Animate;