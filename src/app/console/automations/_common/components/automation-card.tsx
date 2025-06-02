'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter
} from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Clock, Edit } from 'lucide-react';

interface AutomationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: string;
  lastRun: string;
  onView: () => void;
  onEdit: () => void;
  className?: string;
}

export function AutomationCard({
  name,
  description,
  icon,
  status,
  lastRun,
  onView,
  onEdit,
  className = ''
}: AutomationCardProps) {
  return (
    <Card className={`hover:shadow-md transition-all ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          <Badge className="mt-1" variant={status === 'Active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-sm text-muted-foreground mb-2">{description}</div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Last run: {lastRun}</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
            onClick={onEdit}
          >
            <Edit className="h-3 w-3" />
            <span>Edit</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          size="sm"
          className="text-sm p-0"
          onClick={onView}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}