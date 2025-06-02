'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { ArrowLeft, Edit, Save, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

interface StandardItemViewProps {
  // Header information
  title: string;
  description?: string;
  status?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  
  // Content sections
  children: React.ReactNode;
  
  // Optional tab configuration
  tabs?: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  
  // Action buttons
  onBack?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  
  // Additional elements
  headerActions?: React.ReactNode;
  footerContent?: React.ReactNode;
  insightCard?: React.ReactNode;
}

export function StandardItemView({
  title,
  description,
  status,
  children,
  tabs,
  defaultTab,
  onBack,
  onEdit,
  onSave,
  onDelete,
  isEditing = false,
  headerActions,
  footerContent,
  insightCard
}: StandardItemViewProps) {
  return (
    <div className="space-y-6">
      {/* Main content card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col items-start gap-1.5">
              {onBack && (
                <Button 
                  onClick={onBack} 
                  variant="ghost" 
                  size="sm" 
                  className="mb-1 -ml-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-3">
                <CardTitle>{title}</CardTitle>
                {status && (
                  <Badge variant={status.variant || 'outline'} className="capitalize">
                    {status.label}
                  </Badge>
                )}
              </div>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {onEdit && !isEditing && (
                <Button onClick={onEdit} size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
              {onSave && isEditing && (
                <Button onClick={onSave} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tabs ? (
            <Tabs defaultValue={defaultTab || tabs[0].id}>
              <TabsList className="mb-4">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            children
          )}
        </CardContent>
        {footerContent && (
          <CardFooter className="flex justify-between">{footerContent}</CardFooter>
        )}
      </Card>
      
      {/* Optional ROI Insight Card that stands out */}
      {insightCard && (
        <div className="mt-6">{insightCard}</div>
      )}
    </div>
  );
}