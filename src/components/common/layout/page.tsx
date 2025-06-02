import React from 'react';
import {
  ActionButtonProps,
  Layout
} from '@/components/common/layout/layout';
import { Button } from '@/ui/button';
import { Loading, ErrorDisplay } from '@/components/common/patterns';

export interface StandardPageProps {
  title: string;
  actionButton?: ActionButtonProps;
  secondaryActionButton?: ActionButtonProps;
  variant?: 'default' | 'container' | 'full' | 'splash';
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export function Page({
  title,
  actionButton,
  secondaryActionButton,
  children,
  variant = 'default',
  isLoading = false,
  error = null
}: StandardPageProps) {
  // Splash variant - meant to be used with BackgroundComponent
  if (variant === 'splash') {
    return <div className="w-full h-full">{children}</div>;
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout 
        title={title} 
        actionButton={actionButton}
        secondaryActionButton={secondaryActionButton}
      >
        <Loading message="Loading content..." />
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout 
        title={title} 
        actionButton={actionButton}
        secondaryActionButton={secondaryActionButton}
      >
        <ErrorDisplay message={error} />
      </Layout>
    );
  }

  // Full variant - removes padding and lets content use full width
  if (variant === 'full') {
    return (
      <div className="w-full -m-4 sm:-mx-6 sm:py-0 md:-m-4">
        <div className="flex justify-between items-center p-4 border-b bg-background sticky top-0 z-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex gap-2">
            {secondaryActionButton && (
              <Button
                variant={secondaryActionButton.variant || 'outline'}
                onClick={secondaryActionButton.onClick}
              >
                {secondaryActionButton.icon}
                {secondaryActionButton.label}
              </Button>
            )}
            {actionButton && (
              <Button
                variant={actionButton.variant || 'default'}
                onClick={actionButton.onClick}
                {...(actionButton.href ? { asChild: true } : {})}
              >
                {actionButton.icon}
                {actionButton.label}
              </Button>
            )}
          </div>
        </div>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  // Default and container variants - use the standard PageLayout
  return (
    <Layout 
      title={title} 
      actionButton={actionButton}
      secondaryActionButton={secondaryActionButton}
    >
      {variant === 'container' ? (
        <div className="container mx-auto px-0 py-6">{children}</div>
      ) : (
        children
      )}
    </Layout>
  );
}
