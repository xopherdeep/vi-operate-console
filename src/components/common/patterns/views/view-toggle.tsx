'use client';

import * as React from 'react';
import { Button } from '@/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  value: string;
  onChangeAction: (value: string) => void;
}

export function ViewToggle({ value, onChangeAction }: ViewToggleProps) {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <Button
        variant={value === 'card' ? 'secondary' : 'ghost'}
        size="sm"
        className="rounded-none"
        onClick={() => onChangeAction('card')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span>Cards</span>
      </Button>
      <Button
        variant={value === 'table' ? 'secondary' : 'ghost'}
        size="sm"
        className="rounded-none"
        onClick={() => onChangeAction('table')}
      >
        <List className="h-4 w-4 mr-2" />
        <span>Table</span>
      </Button>
    </div>
  );
}