import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Undo2, 
  Redo2,
  Heading1,
  Table2,
  Paintbrush,
  LayoutPanelLeft
} from 'lucide-react';
import { useGridStore } from '../store/gridStore';
import { toast } from 'sonner';
import { GridApi, ColDef } from 'ag-grid-community';

// Import components with type declarations
import { ColumnList } from './ColumnList';
import { HeaderSettings } from './HeaderSettings';
import { CellSettings } from './CellSettings';
import { FormattingSettings } from './FormattingSettings';
import { ComponentSettings } from './ComponentSettings';
import { ExtendedColumnState, CellStyleProperties } from './types';

interface ColumnSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gridApi: GridApi | undefined;
  // Callback to update column definitions in the parent component
  onApplySettings?: (updatedColumnDefs: ColDef[]) => void;
}

interface ColumnChange {
  type: string;
  columnId: string;
  property: string;
  value: unknown;
  previousValue: unknown;
}

export function ColumnSettingsDialog({ 
  open, 
  onOpenChange,
  gridApi,
  onApplySettings
}: ColumnSettingsDialogProps) {
  // Get state and actions from store
  const { 
    columnState,
    setColumnState
  } = useGridStore();

  // Local state for the dialog
  const [localColumnState, setLocalColumnState] = useState<ExtendedColumnState[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [changeHistory, setChangeHistory] = useState<ColumnChange[]>([]);
  const [changeIndex, setChangeIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);

  // Reset local state when dialog opens or columnState changes
  useEffect(() => {
    if (open && gridApi) {
      try {
        // Check if we have column state in the store
        if (columnState.length > 0) {
          console.log('Initializing from store column state:', columnState);
          const enrichedColumnState = enrichColumnState(columnState as ExtendedColumnState[]);
          setLocalColumnState(enrichedColumnState);
        } else {
          // Otherwise get from grid
          console.log('Getting column state from grid');
          const currentColumnState = gridApi.getColumnState();
          const enrichedColumnState = enrichColumnState(currentColumnState as ExtendedColumnState[]);
          setLocalColumnState(enrichedColumnState);
        }
        
        // Select the first visible column by default
        setTimeout(() => {
          const firstVisibleColumn = localColumnState.find(col => !col.hide);
          if (firstVisibleColumn) {
            setSelectedColumnId(firstVisibleColumn.colId);
          }
        }, 0);
      } catch (error) {
        console.error('Error initializing column settings dialog:', error);
      }
    }
  }, [open, gridApi, columnState]);

  // Enrich the column state with additional information from the grid
  const enrichColumnState = (columnState: ExtendedColumnState[]): ExtendedColumnState[] => {
    if (!gridApi) return columnState;
    
    return columnState.map(col => {
      const column = gridApi.getColumn(col.colId);
      if (!column) return col;
      
      const colDef = column.getColDef();
      
      // Create a base enriched state with required properties
      const enrichedState: ExtendedColumnState = {
        ...col,
        headerName: colDef.headerName || col.colId
      };
      
      // Add field from colDef if available (it's available in the GridAPI but not directly in ColumnState)
      if (colDef.field) {
        // Use type assertion to unknown first to avoid type errors
        const mutableState = enrichedState as unknown as Record<string, unknown>;
        mutableState.field = colDef.field;
      }
      
      // Extract and apply header component params and styles
      const headerComponentParams = colDef.headerComponentParams || {};
      const headerStyle = typeof colDef.headerStyle === 'function' ? {} : colDef.headerStyle || {};
      
      // Only add explicitly defined properties (to ensure proper fallback to theme defaults)
      if (headerComponentParams.alignment !== undefined) {
        enrichedState.headerAlignment = headerComponentParams.alignment;
      } else if (headerStyle.textAlign !== undefined) {
        enrichedState.headerAlignment = headerStyle.textAlign as 'left' | 'center' | 'right';
      }
      
      if (headerComponentParams.backgroundColor !== undefined) {
        enrichedState.headerBackgroundColor = headerComponentParams.backgroundColor;
      } else if (headerStyle.backgroundColor !== undefined) {
        enrichedState.headerBackgroundColor = headerStyle.backgroundColor as string;
      }
      
      if (headerComponentParams.textColor !== undefined) {
        enrichedState.headerTextColor = headerComponentParams.textColor;
      } else if (headerStyle.color !== undefined) {
        enrichedState.headerTextColor = headerStyle.color as string;
      }
      
      if (headerComponentParams.fontFamily !== undefined) {
        enrichedState.headerFontFamily = headerComponentParams.fontFamily;
      } else if (headerStyle.fontFamily !== undefined) {
        enrichedState.headerFontFamily = headerStyle.fontFamily as string;
      }
      
      if (headerComponentParams.fontSize !== undefined) {
        enrichedState.headerFontSize = headerComponentParams.fontSize;
      } else if (headerStyle.fontSize !== undefined) {
        enrichedState.headerFontSize = parseInt(headerStyle.fontSize as string);
      }
      
      if (headerComponentParams.fontWeight !== undefined) {
        enrichedState.headerFontWeight = headerComponentParams.fontWeight;
      } else if (headerStyle.fontWeight !== undefined) {
        enrichedState.headerFontWeight = headerStyle.fontWeight as string;
      }
      
      if (headerComponentParams.fontStyle !== undefined) {
        enrichedState.headerFontStyle = headerComponentParams.fontStyle;
      } else if (headerStyle.fontStyle !== undefined) {
        enrichedState.headerFontStyle = headerStyle.fontStyle as string;
      }
      
      // Extract header border styles
      if (headerStyle.borderTop !== undefined) {
        const [width, style, color] = parseBorderString(headerStyle.borderTop as string);
        enrichedState.headerBorderTop = { width, style, color };
      }
      
      if (headerStyle.borderRight !== undefined) {
        const [width, style, color] = parseBorderString(headerStyle.borderRight as string);
        enrichedState.headerBorderRight = { width, style, color };
      }
      
      if (headerStyle.borderBottom !== undefined) {
        const [width, style, color] = parseBorderString(headerStyle.borderBottom as string);
        enrichedState.headerBorderBottom = { width, style, color };
      }
      
      if (headerStyle.borderLeft !== undefined) {
        const [width, style, color] = parseBorderString(headerStyle.borderLeft as string);
        enrichedState.headerBorderLeft = { width, style, color };
      }
      
      // Extract and apply cell styling properties
      // Using safe type casting for cellStyle
      const cellStyle = typeof colDef.cellStyle === 'function' 
        ? {} 
        : (colDef.cellStyle as CellStyleProperties) || {};
      
      if (cellStyle.textAlign !== undefined) {
        enrichedState.cellAlignment = cellStyle.textAlign;
      }
      
      if (cellStyle.backgroundColor !== undefined) {
        enrichedState.cellBackgroundColor = cellStyle.backgroundColor;
      }
      
      if (cellStyle.color !== undefined) {
        enrichedState.cellTextColor = cellStyle.color;
      }
      
      if (cellStyle.fontFamily !== undefined) {
        enrichedState.cellFontFamily = cellStyle.fontFamily;
      }
      
      if (cellStyle.fontSize !== undefined) {
        enrichedState.cellFontSize = cellStyle.fontSize;
      }
      
      if (cellStyle.fontWeight !== undefined) {
        enrichedState.cellFontWeight = cellStyle.fontWeight;
      }
      
      if (cellStyle.fontStyle !== undefined) {
        enrichedState.cellFontStyle = cellStyle.fontStyle;
      }
      
      // Extract cell border styles
      if (cellStyle.borderTop !== undefined) {
        const [width, style, color] = parseBorderString(cellStyle.borderTop);
        enrichedState.cellBorderTop = { width, style, color };
      }
      
      if (cellStyle.borderRight !== undefined) {
        const [width, style, color] = parseBorderString(cellStyle.borderRight);
        enrichedState.cellBorderRight = { width, style, color };
      }
      
      if (cellStyle.borderBottom !== undefined) {
        const [width, style, color] = parseBorderString(cellStyle.borderBottom);
        enrichedState.cellBorderBottom = { width, style, color };
      }
      
      if (cellStyle.borderLeft !== undefined) {
        const [width, style, color] = parseBorderString(cellStyle.borderLeft);
        enrichedState.cellBorderLeft = { width, style, color };
      }
      
      // Handle formatting options
      if (colDef.valueFormatter) {
        enrichedState.valueFormatter = typeof colDef.valueFormatter === 'function' 
          ? 'function'
          : colDef.valueFormatter;
      }
      
      // Cell components
      if (colDef.cellRenderer) {
        enrichedState.cellRenderer = typeof colDef.cellRenderer === 'function'
          ? 'function'
          : colDef.cellRenderer;
      }
      
      if (colDef.cellEditor) {
        enrichedState.cellEditor = typeof colDef.cellEditor === 'function'
          ? 'function'
          : colDef.cellEditor;
      }
      
      // Additional properties
      if (typeof colDef.editable === 'boolean') {
        enrichedState.editable = colDef.editable;
      }
      
      if (typeof colDef.filter === 'boolean' || typeof colDef.filter === 'string') {
        enrichedState.filter = colDef.filter;
      }
      
      if (typeof colDef.sortable === 'boolean') {
        enrichedState.sortable = colDef.sortable;
      }
      
      if (typeof colDef.resizable === 'boolean') {
        enrichedState.resizable = colDef.resizable;
      }
      
      return enrichedState;
    });
  };

  // Helper function to parse border string into width, style, and color
  const parseBorderString = (borderStr: string): [string, 'none' | 'solid' | 'dashed' | 'dotted' | 'double', string] => {
    if (!borderStr || borderStr === 'none') return ['0', 'none', '#dddddd'];
    
    // Simple parsing of border string (width style color)
    const parts = borderStr.split(' ');
    const width = parts[0] || '1px';
    const style = (parts[1] || 'solid') as 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    const color = parts[2] || '#dddddd';
    
    return [width, style, color];
  };

  const handleColumnSelect = (columnId: string) => {
    setSelectedColumnId(columnId);
  };

  const handleColumnChange = (columnId: string, property: keyof ExtendedColumnState, value: unknown) => {
    // Find the column to update
    const updatedColumns = localColumnState.map(col => {
      if (col.colId === columnId) {
        // Get the previous value for the change history
        const previousValue = col[property];
        
        // Record the change in the history
        if (previousValue !== value) {
          const newChange: ColumnChange = {
            type: 'update',
            columnId,
            property: property as string,
            value,
            previousValue
          };
          
          // Add the change to history, removing any future changes if we're not at the end
          const newHistory = changeHistory.slice(0, changeIndex + 1);
          newHistory.push(newChange);
          setChangeHistory(newHistory);
          setChangeIndex(newHistory.length - 1);
          setIsDirty(true);
        }
        
        // Return the updated column
        return {
          ...col,
          [property]: value
        };
      }
      return col;
    });
    
    setLocalColumnState(updatedColumns);
  };

  const handleToggleVisibility = (columnId: string) => {
    handleColumnChange(columnId, 'hide', !localColumnState.find(col => col.colId === columnId)?.hide);
  };

  const handleUndo = () => {
    if (changeIndex >= 0) {
      const change = changeHistory[changeIndex];
      
      // Apply the undo operation
      const updatedColumns = localColumnState.map(col => {
        if (col.colId === change.columnId) {
          return {
            ...col,
            [change.property]: change.previousValue
          };
        }
        return col;
      });
      
      setLocalColumnState(updatedColumns);
      setChangeIndex(changeIndex - 1);
    }
  };

  const handleRedo = () => {
    if (changeIndex < changeHistory.length - 1) {
      const change = changeHistory[changeIndex + 1];
      
      // Apply the redo operation
      const updatedColumns = localColumnState.map(col => {
        if (col.colId === change.columnId) {
          return {
            ...col,
            [change.property]: change.value
          };
        }
        return col;
      });
      
      setLocalColumnState(updatedColumns);
      setChangeIndex(changeIndex + 1);
    }
  };

  const handleApply = () => {
    if (!gridApi) return;
    
    try {
      // Extract the updated column definitions
      const updatedColumnDefs = localColumnState.map(colState => {
        const column = gridApi.getColumn(colState.colId);
        if (!column) {
          console.warn(`Column not found: ${colState.colId}`);
          return null;
        }
        
        const originalColDef = column.getColDef();
        
        // Build an updated column definition
        const updatedColDef: ColDef = { ...originalColDef };
        
        // Update header properties
        updatedColDef.headerName = colState.headerName;
        
        // Add headerStyle directly to apply styling to headers
        const headerStyle: Record<string, unknown> = {};
        let hasHeaderStyle = false;
        
        // Apply only explicitly set header styles to ensure proper theme fallback
        if (colState.headerAlignment !== undefined) {
          headerStyle.textAlign = colState.headerAlignment;
          hasHeaderStyle = true;
        }
        
        if (colState.headerBackgroundColor !== undefined) {
          headerStyle.backgroundColor = colState.headerBackgroundColor;
          hasHeaderStyle = true;
        }
        
        if (colState.headerTextColor !== undefined) {
          headerStyle.color = colState.headerTextColor;
          hasHeaderStyle = true;
        }
        
        if (colState.headerFontFamily !== undefined) {
          headerStyle.fontFamily = colState.headerFontFamily;
          hasHeaderStyle = true;
        }
        
        if (colState.headerFontSize !== undefined) {
          headerStyle.fontSize = typeof colState.headerFontSize === 'number' 
            ? `${colState.headerFontSize}px` 
            : colState.headerFontSize;
          hasHeaderStyle = true;
        }
        
        if (colState.headerFontWeight !== undefined) {
          headerStyle.fontWeight = colState.headerFontWeight;
          hasHeaderStyle = true;
        }
        
        if (colState.headerFontStyle !== undefined) {
          headerStyle.fontStyle = colState.headerFontStyle;
          hasHeaderStyle = true;
        }
        
        // Add header border styles
        if (colState.headerBorderTop && colState.headerBorderTop.style !== 'none') {
          headerStyle.borderTop = `${colState.headerBorderTop.width || '1px'} ${colState.headerBorderTop.style || 'solid'} ${colState.headerBorderTop.color || '#dddddd'}`;
          hasHeaderStyle = true;
        }
        
        if (colState.headerBorderRight && colState.headerBorderRight.style !== 'none') {
          headerStyle.borderRight = `${colState.headerBorderRight.width || '1px'} ${colState.headerBorderRight.style || 'solid'} ${colState.headerBorderRight.color || '#dddddd'}`;
          hasHeaderStyle = true;
        }
        
        if (colState.headerBorderBottom && colState.headerBorderBottom.style !== 'none') {
          headerStyle.borderBottom = `${colState.headerBorderBottom.width || '1px'} ${colState.headerBorderBottom.style || 'solid'} ${colState.headerBorderBottom.color || '#dddddd'}`;
          hasHeaderStyle = true;
        }
        
        if (colState.headerBorderLeft && colState.headerBorderLeft.style !== 'none') {
          headerStyle.borderLeft = `${colState.headerBorderLeft.width || '1px'} ${colState.headerBorderLeft.style || 'solid'} ${colState.headerBorderLeft.color || '#dddddd'}`;
          hasHeaderStyle = true;
        }
        
        // Only set headerStyle if we have properties to apply
        if (hasHeaderStyle) {
          updatedColDef.headerStyle = headerStyle as import('ag-grid-community').HeaderStyle;
        } else {
          // If no header style properties are defined, remove the headerStyle property
          // to ensure proper fallback to theme defaults
          delete updatedColDef.headerStyle;
        }
        
        // Create cell style if needed
        const cellStyle: Record<string, unknown> = {};
        let hasCellStyle = false;
        
        // Apply only explicitly set cell styles
        if (colState.cellAlignment !== undefined) {
          cellStyle.textAlign = colState.cellAlignment;
          hasCellStyle = true;
        }
        
        if (colState.cellBackgroundColor !== undefined) {
          cellStyle.backgroundColor = colState.cellBackgroundColor;
          hasCellStyle = true;
        }
        
        if (colState.cellTextColor !== undefined) {
          cellStyle.color = colState.cellTextColor;
          hasCellStyle = true;
        }
        
        if (colState.cellFontFamily !== undefined) {
          cellStyle.fontFamily = colState.cellFontFamily;
          hasCellStyle = true;
        }
        
        if (colState.cellFontSize !== undefined) {
          cellStyle.fontSize = colState.cellFontSize;
          hasCellStyle = true;
        }
        
        if (colState.cellFontWeight !== undefined) {
          cellStyle.fontWeight = colState.cellFontWeight;
          hasCellStyle = true;
        }
        
        if (colState.cellFontStyle !== undefined) {
          cellStyle.fontStyle = colState.cellFontStyle;
          hasCellStyle = true;
        }
        
        // Add cell border styles
        if (colState.cellBorderTop && colState.cellBorderTop.style !== 'none') {
          cellStyle.borderTop = `${colState.cellBorderTop.width || '1px'} ${colState.cellBorderTop.style || 'solid'} ${colState.cellBorderTop.color || '#dddddd'}`;
          hasCellStyle = true;
        }
        
        if (colState.cellBorderRight && colState.cellBorderRight.style !== 'none') {
          cellStyle.borderRight = `${colState.cellBorderRight.width || '1px'} ${colState.cellBorderRight.style || 'solid'} ${colState.cellBorderRight.color || '#dddddd'}`;
          hasCellStyle = true;
        }
        
        if (colState.cellBorderBottom && colState.cellBorderBottom.style !== 'none') {
          cellStyle.borderBottom = `${colState.cellBorderBottom.width || '1px'} ${colState.cellBorderBottom.style || 'solid'} ${colState.cellBorderBottom.color || '#dddddd'}`;
          hasCellStyle = true;
        }
        
        if (colState.cellBorderLeft && colState.cellBorderLeft.style !== 'none') {
          cellStyle.borderLeft = `${colState.cellBorderLeft.width || '1px'} ${colState.cellBorderLeft.style || 'solid'} ${colState.cellBorderLeft.color || '#dddddd'}`;
          hasCellStyle = true;
        }
        
        // Only set cellStyle if we have properties to apply
        if (hasCellStyle) {
          updatedColDef.cellStyle = cellStyle as import('ag-grid-community').CellStyle;
        } else {
          // If no cell style properties are defined, remove the cellStyle property
          // to ensure proper fallback to theme defaults
          delete updatedColDef.cellStyle;
        }
        
        // Apply additional properties
        updatedColDef.hide = colState.hide;
        
        // Only apply editable if it's a boolean
        if (typeof colState.editable === 'boolean') {
          updatedColDef.editable = colState.editable;
        }
        
        // Handle filter which can be boolean or string
        if (colState.filter !== undefined) {
          updatedColDef.filter = colState.filter;
        }
        
        if (typeof colState.sortable === 'boolean') {
          updatedColDef.sortable = colState.sortable;
        }
        
        if (typeof colState.resizable === 'boolean') {
          updatedColDef.resizable = colState.resizable;
        }
        
        return updatedColDef;
      }).filter(Boolean) as ColDef[];
      
      // Update the store state
      setColumnState(localColumnState);
      
      // Apply the changes to the grid
      if (onApplySettings) {
        onApplySettings(updatedColumnDefs);
      }
      
      setIsDirty(false);
      toast.success('Column settings applied successfully');
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying column settings:', error);
      toast.error('Failed to apply column settings');
    }
  };

  // Get the currently selected column
  const selectedColumn = selectedColumnId 
    ? localColumnState.find(col => col.colId === selectedColumnId) 
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg">Column Settings</DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleUndo}
                disabled={changeIndex < 0}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRedo}
                disabled={changeIndex >= changeHistory.length - 1}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Column list - fixed height */}
          <div className="w-56 border-r overflow-hidden flex flex-col">
            <div className="p-3 bg-muted/40 border-b shrink-0">
              <h3 className="text-xs font-medium uppercase tracking-wider">Columns</h3>
            </div>
            <ScrollArea className="flex-1 h-0">
              <div className="p-2">
                <ColumnList 
                  columns={localColumnState}
                  selectedColumnId={selectedColumnId}
                  onColumnSelect={handleColumnSelect}
                  onToggleVisibility={handleToggleVisibility}
                />
              </div>
            </ScrollArea>
          </div>
          
          {/* Settings tabs - fixed height with scrollable content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedColumn ? (
              <Tabs defaultValue="header" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <div className="border-b px-4 shrink-0">
                  <TabsList className="h-10">
                    <TabsTrigger value="header" className="flex items-center gap-1.5 text-xs px-2">
                      <Heading1 className="h-3.5 w-3.5" />
                      <span>Header</span>
                    </TabsTrigger>
                    <TabsTrigger value="cell" className="flex items-center gap-1.5 text-xs px-2">
                      <Table2 className="h-3.5 w-3.5" />
                      <span>Cell</span>
                    </TabsTrigger>
                    <TabsTrigger value="formatting" className="flex items-center gap-1.5 text-xs px-2">
                      <Paintbrush className="h-3.5 w-3.5" />
                      <span>Format</span>
                    </TabsTrigger>
                    <TabsTrigger value="components" className="flex items-center gap-1.5 text-xs px-2">
                      <LayoutPanelLeft className="h-3.5 w-3.5" />
                      <span>Components</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <TabsContent value="header" className="mt-0 p-0">
                        <HeaderSettings 
                          column={selectedColumn}
                          onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="cell" className="mt-0 p-0">
                        <CellSettings 
                          column={selectedColumn}
                          onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="formatting" className="mt-0 p-0">
                        <FormattingSettings 
                          column={selectedColumn}
                          onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="components" className="mt-0 p-0">
                        <ComponentSettings 
                          column={selectedColumn}
                          onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                        />
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a column to edit its settings
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="p-3 border-t flex justify-between items-center gap-4 shrink-0">
          <div className="text-xs text-muted-foreground">
            {isDirty ? `${changeIndex + 1} of ${changeHistory.length} changes` : 'No changes'}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleApply}
              disabled={!isDirty}
            >
              Apply Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 