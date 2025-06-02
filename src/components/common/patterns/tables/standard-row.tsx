'use client';

import React from 'react';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu';
import { MoreHorizontal, ExternalLink, Eye, Edit, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/ui/table';
import Link from 'next/link';

export interface ColumnConfig<T> {
  key: string;
  renderCell?: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface ActionConfig<T> {
  label: string;
  onClick: (item: T) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  linkHref?: string;
}

export interface StandardRowProps<T> {
  item: T;
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  primaryAction?: 'view' | 'edit' | 'none';
  viewHref?: string;
  editHref?: string;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function StandardRow<T>({
  item,
  columns,
  actions = [],
  primaryAction = 'view',
  viewHref,
  editHref,
  onView,
  onEdit,
  onDelete
}: StandardRowProps<T>) {
  // Add standard actions if callbacks or hrefs are provided
  const allActions: ActionConfig<T>[] = [];
  
  if (primaryAction !== 'view' && (viewHref || onView)) {
    allActions.push({
      label: 'View',
      onClick: onView || (() => {}),
      icon: <Eye className="h-4 w-4 mr-2" />,
      linkHref: viewHref
    });
  }
  
  if (primaryAction !== 'edit' && (editHref || onEdit)) {
    allActions.push({
      label: 'Edit',
      onClick: onEdit || (() => {}),
      icon: <Edit className="h-4 w-4 mr-2" />,
      linkHref: editHref
    });
  }
  
  if (onDelete) {
    allActions.push({
      label: 'Delete',
      onClick: onDelete,
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      variant: 'destructive'
    });
  }
  
  // Add custom actions
  if (actions.length > 0) {
    if (allActions.length > 0) {
      allActions.push({ label: '', onClick: () => {}, icon: <DropdownMenuSeparator /> });
    }
    allActions.push(...actions);
  }

  // Determine primary action link
  const primaryLink = 
    primaryAction === 'view' ? viewHref :
    primaryAction === 'edit' ? editHref :
    undefined;

  const primaryHandler = 
    primaryAction === 'view' ? onView :
    primaryAction === 'edit' ? onEdit :
    undefined;

  return (
    <TableRow 
      className={primaryLink || primaryHandler ? 'cursor-pointer hover:bg-muted/60' : undefined}
      onClick={primaryLink || !primaryHandler ? undefined : () => primaryHandler?.(item)}
    >
      {columns.map((column) => {
        const cell = (
          <TableCell
            key={column.key}
            className={column.hideOnMobile ? 'hidden md:table-cell' : undefined}
          >
            {column.renderCell
              ? column.renderCell(item)
              : String((item as any)[column.key] || '')}
          </TableCell>
        );

        // If this is the first column and we have a primary link, wrap it in a Link
        if (column === columns[0] && primaryLink) {
          return (
            <TableCell
              key={column.key}
              className={column.hideOnMobile ? 'hidden md:table-cell p-0' : 'p-0'}
            >
              <Link
                href={primaryLink}
                className="block p-4 h-full w-full"
              >
                {column.renderCell
                  ? column.renderCell(item)
                  : String((item as any)[column.key] || '')}
              </Link>
            </TableCell>
          );
        }
        
        return cell;
      })}

      {allActions.length > 0 && (
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {allActions.map((action, index) => {
                // Handle separator special case
                if (action.icon && React.isValidElement(action.icon) && action.icon.type === DropdownMenuSeparator) {
                  return <DropdownMenuSeparator key={index} />;
                }
                
                // Create menu item
                const menuItem = (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(item)}
                    className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : undefined}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                );
                
                // If there's a link href, wrap it in a Link
                if (action.linkHref) {
                  return (
                    <Link key={index} href={action.linkHref} legacyBehavior passHref>
                      {menuItem}
                    </Link>
                  );
                }
                
                return menuItem;
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}