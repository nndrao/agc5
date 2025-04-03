import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Undo2, 
  Redo2
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
        (enrichedState as any).field = colDef.field;
      }
      
      // Extract and apply header component params
      const headerComponentParams = colDef.headerComponentParams || {};
      
      // Only add explicitly defined properties (to ensure proper fallback to theme defaults)
      if (headerComponentParams.alignment !== undefined) {
        enrichedState.headerAlignment = headerComponentParams.alignment;
      }
      
      if (headerComponentParams.backgroundColor !== undefined) {
        enrichedState.headerBackgroundColor = headerComponentParams.backgroundColor;
      }
      
      if (headerComponentParams.textColor !== undefined) {
        enrichedState.headerTextColor = headerComponentParams.textColor;
      }
      
      if (headerComponentParams.fontFamily !== undefined) {
        enrichedState.headerFontFamily = headerComponentParams.fontFamily;
      }
      
      if (headerComponentParams.fontSize !== undefined) {
        enrichedState.headerFontSize = headerComponentParams.fontSize;
      }
      
      if (headerComponentParams.fontWeight !== undefined) {
        enrichedState.headerFontWeight = headerComponentParams.fontWeight;
      }
      
      if (headerComponentParams.fontStyle !== undefined) {
        enrichedState.headerFontStyle = headerComponentParams.fontStyle;
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

  const handleApplyToGroup = (property: keyof ExtendedColumnState, value: unknown) => {
    if (!selectedColumnId) return;
    
    // Find the currently selected column to get its field prefix
    const selectedColumn = localColumnState.find(col => col.colId === selectedColumnId);
    if (!selectedColumn) return;
    
    // Get the field from the column (we've extended the type with any, since field isn't in the standard ColumnState)
    const field = (selectedColumn as any).field;
    if (!field) {
      toast.warning('No field property found for grouping');
      return;
    }
    
    // Extract the group prefix (everything before the last dot)
    const lastDotIndex = field.lastIndexOf('.');
    if (lastDotIndex === -1) {
      // No group prefix found
      toast.warning('No column group detected');
      return;
    }
    
    const groupPrefix = field.substring(0, lastDotIndex + 1);
    
    // Update all columns in the same group
    const updatedColumns = localColumnState.map(col => {
      // Get the field from the column (using any since field isn't in the standard type)
      const colField = (col as any).field;
      
      if (colField && colField.startsWith(groupPrefix)) {
        // Record the change in history before applying it
        const previousValue = col[property];
        
        if (previousValue !== value) {
          const newChange: ColumnChange = {
            type: 'group_update',
            columnId: col.colId,
            property: property as string,
            value,
            previousValue
          };
          
          // Add the change to history (without tracking individual columns to avoid clutter)
          if (col.colId === selectedColumnId) {
            const newHistory = changeHistory.slice(0, changeIndex + 1);
            newHistory.push(newChange);
            setChangeHistory(newHistory);
            setChangeIndex(newHistory.length - 1);
          }
          
          setIsDirty(true);
          
          // Return the updated column
          return {
            ...col,
            [property]: value
          };
        }
      }
      return col;
    });
    
    setLocalColumnState(updatedColumns);
    toast.success(`Applied ${property} to all columns in group`);
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
        
        // Only set headerStyle if we have properties to apply
        if (hasHeaderStyle) {
          updatedColDef.headerStyle = headerStyle;
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
        
        // Only set cellStyle if we have properties to apply
        if (hasCellStyle) {
          updatedColDef.cellStyle = cellStyle;
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
      <DialogContent className="max-w-4xl min-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Column Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance and behavior of grid columns
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Column list */}
          <div className="w-64 border-r pr-4">
            <ColumnList 
              columns={localColumnState}
              selectedColumnId={selectedColumnId}
              onColumnSelect={handleColumnSelect}
              onToggleVisibility={handleToggleVisibility}
            />
          </div>
          
          {/* Settings tabs */}
          <div className="flex-1 overflow-hidden">
            {selectedColumn ? (
              <Tabs defaultValue="header" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="header">Header</TabsTrigger>
                  <TabsTrigger value="cell">Cell</TabsTrigger>
                  <TabsTrigger value="formatting">Formatting</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-1">
                  <TabsContent value="header" className="mt-0">
                    <HeaderSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="cell" className="mt-0">
                    <CellSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="formatting" className="mt-0">
                    <FormattingSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="components" className="mt-0">
                    <ComponentSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumnId!, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a column to edit its settings
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleUndo}
              disabled={changeIndex < 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRedo}
              disabled={changeIndex >= changeHistory.length - 1}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {changeIndex + 1} of {changeHistory.length} changes
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
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