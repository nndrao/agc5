import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { ExtendedColumnState } from './types';

interface ColumnListProps {
  columns: ExtendedColumnState[];
  selectedColumnId: string | null;
  onColumnSelect: (columnId: string) => void;
  onToggleVisibility: (columnId: string) => void;
}

export function ColumnList({ 
  columns, 
  selectedColumnId, 
  onColumnSelect,
  onToggleVisibility 
}: ColumnListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {columns.map((column) => (
          <div
            key={column.colId}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
              selectedColumnId === column.colId ? 'bg-accent' : ''
            }`}
            onClick={() => onColumnSelect(column.colId)}
          >
            <span className="truncate">{column.headerName || column.colId}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(column.colId);
              }}
            >
              {column.hide ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 