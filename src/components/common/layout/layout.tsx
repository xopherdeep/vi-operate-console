'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';

export type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
};

export interface PageLayoutProps {
  title: string;
  description?: string;
  actionButton?: ActionButtonProps;
  secondaryActionButton?: ActionButtonProps;
  children: React.ReactNode;
  className?: string;
}

// PageHeader component for layouts with header content
export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 px-4">
      {children}
    </div>
  );
}

export function Layout({
  title,
  description,
  actionButton,
  secondaryActionButton,
  children,
  className = '',
}: PageLayoutProps) {
  const router = useRouter();

  const handlePrimaryAction = () => {
    if (actionButton?.onClick) {
      actionButton.onClick();
    } else if (actionButton?.href) {
      router.push(actionButton.href);
    }
  };

  const handleSecondaryAction = () => {
    if (secondaryActionButton?.onClick) {
      secondaryActionButton.onClick();
    } else if (secondaryActionButton?.href) {
      router.push(secondaryActionButton.href);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-between items-center m-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-3">
          {secondaryActionButton && (
            <Button
              variant={secondaryActionButton.variant || 'outline'}
              onClick={handleSecondaryAction}
            >
              {secondaryActionButton.icon && (
                <span className="mr-2">{secondaryActionButton.icon}</span>
              )}
              {secondaryActionButton.label}
            </Button>
          )}

          {actionButton && (
            <Button
              variant={actionButton.variant || 'default'}
              onClick={handlePrimaryAction}
            >
              {actionButton.icon && (
                <span className="mr-2">{actionButton.icon}</span>
              )}
              {actionButton.label}
            </Button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
