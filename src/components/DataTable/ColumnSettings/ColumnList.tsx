import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Eye, EyeOff, Check, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sort, setSort] = React.useState<'default' | 'visibility'>('default');
  
  // Filter columns based on search term
  const filteredColumns = React.useMemo(() => {
    if (!searchTerm) return columns;
    
    const lowerSearch = searchTerm.toLowerCase();
    return columns.filter(col => {
      // Match by column ID or header name
      const colId = col.colId.toLowerCase();
      const headerName = (col.headerName || '').toLowerCase();
      return colId.includes(lowerSearch) || headerName.includes(lowerSearch);
    });
  }, [columns, searchTerm]);
  
  // Sort columns based on current sort mode
  const sortedColumns = React.useMemo(() => {
    if (sort === 'default') {
      return [...filteredColumns];
    } else if (sort === 'visibility') {
      return [...filteredColumns].sort((a, b) => {
        if (a.hide === b.hide) return 0;
        return a.hide ? 1 : -1; // Visible columns first
      });
    }
    return filteredColumns;
  }, [filteredColumns, sort]);
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>
      
      <div className="flex mb-1 px-1">
        <Button 
          variant="ghost" 
          size="xs" 
          className="h-6 text-xs flex items-center gap-1 text-muted-foreground"
          onClick={() => setSort(sort === 'default' ? 'visibility' : 'default')}
        >
          <ArrowUpDown className="h-3 w-3" />
          <span>Sort</span>
        </Button>
        <Badge variant="outline" className="ml-auto h-5 text-[10px] px-1.5">
          {sortedColumns.filter(col => !col.hide).length} visible
        </Badge>
      </div>
      
      <div className="grid gap-[2px]">
        {sortedColumns.map((column) => (
          <div 
            key={column.colId}
            className={cn(
              "flex items-center py-1 px-2 rounded-sm text-xs cursor-pointer",
              selectedColumnId === column.colId ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/60"
            )}
            onClick={() => onColumnSelect(column.colId)}
          >
            <div className="flex-1 truncate">
              {column.headerName || column.colId}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(column.colId);
              }}
            >
              {column.hide ? 
                <EyeOff className="h-3 w-3" /> : 
                <Eye className="h-3 w-3" />
              }
            </Button>
            {selectedColumnId === column.colId && (
              <Check className="h-3 w-3 ml-1 text-primary" />
            )}
          </div>
        ))}
        
        {sortedColumns.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No columns match your search
          </div>
        )}
      </div>
    </div>
  );
} 