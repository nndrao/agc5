import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  EyeIcon, 
  EyeOff, 
  Search, 
  X,
  ArrowUpDown,
  GripVertical,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnListProps {
  columns: any[];
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showHiddenColumns, setShowHiddenColumns] = useState(true);
  
  // Filter columns based on search term and visibility setting
  const filteredColumns = columns.filter(column => {
    const matchesSearch = 
      column.headerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      column.field?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      column.colId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisibility = showHiddenColumns || !column.hide;
    
    return matchesSearch && matchesVisibility;
  });
  
  // Group columns by parent (for grouped columns)
  const groupedColumns = filteredColumns.reduce((groups, column) => {
    const groupId = column.colId.includes('.') 
      ? column.colId.split('.')[0] 
      : null;
    
    if (groupId && groupId !== column.colId) {
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(column);
    } else {
      if (!groups['root']) {
        groups['root'] = [];
      }
      groups['root'].push(column);
    }
    
    return groups;
  }, {} as Record<string, any[]>);
  
  // Render a column item
  const renderColumnItem = (column: any, isChild = false) => {
    const isSelected = selectedColumnId === column.colId;
    
    return (
      <div 
        key={column.colId}
        className={cn(
          "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group",
          isSelected ? "bg-primary/10" : "hover:bg-muted",
          isChild ? "ml-4" : ""
        )}
        onClick={() => onColumnSelect(column.colId)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <GripVertical className="h-4 w-4 text-muted-foreground invisible group-hover:visible" />
          <div className="truncate font-medium">
            {column.headerName || column.field || column.colId}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(column.colId);
          }}
        >
          {column.hide ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-8"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="show-hidden"
          checked={showHiddenColumns}
          onCheckedChange={(checked) => setShowHiddenColumns(!!checked)}
        />
        <Label htmlFor="show-hidden" className="text-sm cursor-pointer">
          Show hidden columns
        </Label>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {/* Render root level columns first */}
          {groupedColumns['root']?.map(column => renderColumnItem(column))}
          
          {/* Then render grouped columns */}
          {Object.entries(groupedColumns)
            .filter(([groupId]) => groupId !== 'root')
            .map(([groupId, columns]) => (
              <div key={groupId} className="space-y-1 mb-2">
                <div className="text-sm font-semibold text-muted-foreground px-2 py-1">
                  {groupId}
                </div>
                {columns.map(column => renderColumnItem(column, true))}
              </div>
            ))
          }
          
          {filteredColumns.length === 0 && (
            <div className="px-2 py-4 text-center text-muted-foreground">
              No columns found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 