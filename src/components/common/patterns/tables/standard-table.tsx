'use client';

import React from 'react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Table
} from '@/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

interface StandardTableProps<T> {
  // Data and display properties
  data: T[];
  columns: {
    key: string;
    label: string;
    hidden?: boolean;
    hideOnMobile?: boolean;
    sortable?: boolean;
    width?: string;
  }[];
  title: string;
  description?: string;
  renderRow: (item: T, index: number) => React.ReactNode;
  
  // Pagination properties
  itemsPerPage: number;
  currentOffset: number;
  totalItems: number;
  basePath: string;
  
  // Optional features
  searchable?: boolean;
  onSearch?: (query: string) => void;
  createButtonLabel?: string;
  onCreateClick?: () => void;
  searchPlaceholder?: string;
  actionButtons?: React.ReactNode;
}

export function StandardTable<T>({
  data,
  columns,
  title,
  description,
  renderRow,
  itemsPerPage,
  currentOffset,
  totalItems,
  basePath,
  searchable = false,
  onSearch,
  createButtonLabel,
  onCreateClick,
  searchPlaceholder = "Search...",
  actionButtons
}: StandardTableProps<T>) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  function prevPage() {
    const newOffset = Math.max(currentOffset - itemsPerPage, itemsPerPage);
    router.push(`${basePath}?offset=${newOffset}`, { scroll: false });
  }

  function nextPage() {
    router.push(`${basePath}?offset=${currentOffset + itemsPerPage}`, {
      scroll: false
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {createButtonLabel && onCreateClick && (
            <Button onClick={onCreateClick} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>
        {searchable && (
          <form onSubmit={handleSearch} className="flex items-center gap-2 mt-4">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        )}
        {actionButtons && (
          <div className="mt-4 flex flex-wrap gap-2">
            {actionButtons}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={
                      column.hideOnMobile
                        ? 'hidden md:table-cell'
                        : column.hidden
                          ? 'hidden'
                          : undefined
                    }
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.label === 'sr-only' ? (
                      <span className="sr-only">{column.key}</span>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => renderRow(item, index))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {totalItems === 0 
                ? 0 
                : Math.max(0, Math.min(currentOffset - itemsPerPage, totalItems) + 1)}
              -{Math.min(currentOffset, totalItems)}
            </strong>{' '}
            of <strong>{totalItems}</strong> items
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={currentOffset <= itemsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={currentOffset + itemsPerPage > totalItems}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}