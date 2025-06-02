'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';

interface ErrorDialogProps {
  /**
   * Error message to display
   */
  message: string;
  /**
   * Whether to show the error in a dialog (true) or inline (false)
   */
  asDialog?: boolean;
  /**
   * Called when the user dismisses the error
   */
  onDismiss?: () => void;
  /**
   * Whether the dialog is open
   */
  open?: boolean;
}

/**
 * Component to display error messages either as an alert or in a dialog
 */
export function ErrorDisplay({ 
  message, 
  asDialog = false,
  onDismiss,
  open = true
}: ErrorDialogProps) {
  if (!message) return null;
  
  if (asDialog) {
    return (
      <AlertDialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen && onDismiss) onDismiss();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onDismiss}>Dismiss</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}