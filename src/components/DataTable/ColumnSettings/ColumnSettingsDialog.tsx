import React, { useState, useEffect, useCallback } from 'react';
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
  Save, 
  X, 
  Undo2, 
  Redo2,
  EyeOff,
  EyeIcon,
  LucideIcon
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useGridStore } from '../store/gridStore';
import { ColumnList } from './ColumnList';
import { HeaderSettings } from './HeaderSettings';
import { CellSettings } from './CellSettings';
import { FormattingSettings } from './FormattingSettings';
import { ComponentSettings } from './ComponentSettings';

interface ColumnSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gridApi: any;
}

interface ColumnChange {
  type: string;
  columnId: string;
  property: string;
  value: any;
  previousValue: any;
}

export function ColumnSettingsDialog({ 
  open, 
  onOpenChange,
  gridApi
}: ColumnSettingsDialogProps) {
  // Get state and actions from store
  const { 
    columnState,
    setColumnState,
    setApplyingColumnChanges,
    isApplyingColumnChanges
  } = useGridStore();

  // Local state for the dialog
  const [localColumnState, setLocalColumnState] = useState(columnState);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [changeHistory, setChangeHistory] = useState<ColumnChange[]>([]);
  const [changeIndex, setChangeIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);

  // Reset local state when dialog opens or columnState changes
  useEffect(() => {
    if (open && gridApi) {
      // Check if we have column state in the store
      if (columnState.length > 0) {
        console.log('Initializing from store column state:', columnState);
        const enrichedColumnState = enrichColumnState(columnState);
        setLocalColumnState(enrichedColumnState);
      } else {
        // Otherwise get from grid
        console.log('Getting column state from grid');
        const currentColumnState = gridApi.getColumnState();
        const enrichedColumnState = enrichColumnState(currentColumnState);
        setLocalColumnState(enrichedColumnState);
      }
      
      // Select the first visible column by default
      const firstVisibleColumn = localColumnState.find(col => !col.hide);
      if (firstVisibleColumn) {
        setSelectedColumnId(firstVisibleColumn.colId);
      }
    }
  }, [open, gridApi, columnState]);

  // Enrich the column state with additional information from the grid
  const enrichColumnState = (columnState: any[]) => {
    return columnState.map(col => {
      const column = gridApi.getColumn(col.colId);
      const colDef = column ? column.getColDef() : {};
      
      return {
        ...col,
        // Add additional properties that aren't in the standard column state
        headerName: colDef.headerName || col.colId,
        field: colDef.field || col.colId,
        // Header settings
        headerAlignment: colDef.headerComponentParams?.alignment || 'left',
        headerBackgroundColor: colDef.headerComponentParams?.backgroundColor || '#f4f4f4',
        headerTextColor: colDef.headerComponentParams?.textColor || '#000000',
        headerFontFamily: colDef.headerComponentParams?.fontFamily || 'Inter',
        headerFontSize: colDef.headerComponentParams?.fontSize || 14,
        headerFontWeight: colDef.headerComponentParams?.fontWeight || 'normal',
        headerFontStyle: colDef.headerComponentParams?.fontStyle || 'normal',
        // Cell settings
        cellAlignment: colDef.cellStyle?.textAlign || 'left',
        cellBackgroundColor: colDef.cellStyle?.backgroundColor || '#ffffff',
        cellTextColor: colDef.cellStyle?.color || '#000000',
        cellFontFamily: colDef.cellStyle?.fontFamily || 'Inter',
        cellFontSize: colDef.cellStyle?.fontSize || 14,
        cellFontWeight: colDef.cellStyle?.fontWeight || 'normal',
        cellFontStyle: colDef.cellStyle?.fontStyle || 'normal',
        // Formatting settings
        valueFormatter: colDef.valueFormatter ? (typeof colDef.valueFormatter === 'function' ? 'custom' : colDef.valueFormatter) : 'none',
        formatterParams: colDef.valueParserParams || {},  // Use standard params approach instead of the invalid valueFormatterData
        valueFormatterPattern: colDef.valueFormatterPattern || '',
        // Component settings
        cellRenderer: colDef.cellRenderer || undefined,  // Don't default to 'agCellRenderer' - use undefined instead
        cellEditor: colDef.cellEditor || 'agTextCellEditor',
        cellEditorParams: colDef.cellEditorParams || {},
        // Other properties
        editable: colDef.editable === true,
        resizable: colDef.resizable !== false,
        sortable: colDef.sortable !== false,
        filter: colDef.filter !== false,
        filterParams: colDef.filterParams || {},
      };
    });
  };

  // Get the selected column
  const selectedColumn = selectedColumnId 
    ? localColumnState.find(col => col.colId === selectedColumnId) 
    : null;

  // Handle column selection
  const handleColumnSelect = (columnId: string) => {
    setSelectedColumnId(columnId);
  };

  // Handle column property change with undo/redo support
  const handleColumnChange = (columnId: string, property: string, value: any) => {
    // Record the change for undo/redo
    const column = localColumnState.find(col => col.colId === columnId);
    if (!column) return;

    const previousValue = column[property as keyof typeof column];
    
    // If we're in the middle of the history, truncate it
    if (changeIndex < changeHistory.length - 1) {
      setChangeHistory(prev => prev.slice(0, changeIndex + 1));
    }
    
    // Add the new change to history
    setChangeHistory(prev => [...prev, {
      type: 'COLUMN_CHANGE',
      columnId,
      property,
      value,
      previousValue
    }]);
    setChangeIndex(prev => prev + 1);
    
    // Update the column state
    setLocalColumnState(prev => 
      prev.map(col => 
        col.colId === columnId 
          ? { ...col, [property]: value }
          : col
      )
    );
    
    setIsDirty(true);
  };

  // Apply changes to multiple columns (group)
  const handleApplyToGroup = (property: string, value: any) => {
    if (!selectedColumn) return;
    
    // Find all columns in the same group
    const groupId = selectedColumn.colId.split('.')[0];
    const columnsInGroup = localColumnState.filter(col => 
      col.colId.startsWith(groupId + '.') || col.colId === groupId
    );
    
    // Update all columns in the group
    let newColumnState = [...localColumnState];
    const changes: ColumnChange[] = [];
    
    columnsInGroup.forEach(col => {
      const previousValue = col[property as keyof typeof col];
      changes.push({
        type: 'COLUMN_CHANGE',
        columnId: col.colId,
        property,
        value,
        previousValue
      });
      
      newColumnState = newColumnState.map(c => 
        c.colId === col.colId 
          ? { ...c, [property]: value }
          : c
      );
    });
    
    // Add all changes to history as a single group
    setChangeHistory(prev => [...prev, ...changes]);
    setChangeIndex(prev => prev + changes.length);
    
    // Update the column state
    setLocalColumnState(newColumnState);
    setIsDirty(true);
  };

  // Toggle column visibility
  const handleToggleVisibility = (columnId: string) => {
    const column = localColumnState.find(col => col.colId === columnId);
    if (!column) return;
    
    handleColumnChange(columnId, 'hide', !column.hide);
  };

  // Undo last change
  const handleUndo = () => {
    if (changeIndex < 0) return;
    
    const change = changeHistory[changeIndex];
    setLocalColumnState(prev => 
      prev.map(col => 
        col.colId === change.columnId 
          ? { ...col, [change.property]: change.previousValue }
          : col
      )
    );
    
    setChangeIndex(prev => prev - 1);
    setIsDirty(true);
  };

  // Redo last undone change
  const handleRedo = () => {
    if (changeIndex >= changeHistory.length - 1) return;
    
    const change = changeHistory[changeIndex + 1];
    setLocalColumnState(prev => 
      prev.map(col => 
        col.colId === change.columnId 
          ? { ...col, [change.property]: change.value }
          : col
      )
    );
    
    setChangeIndex(prev => prev + 1);
    setIsDirty(true);
  };

  // Apply changes to the grid
  const handleApply = () => {
    if (!gridApi) {
      console.error('Grid API not available');
      return;
    }

    try {
      console.log('Starting column settings apply process');
      
      // Set the flag in the store
      setApplyingColumnChanges(true);
      
      // Close the dialog immediately
      onOpenChange(false);
      
      try {
        // Get current column definitions
        const currentColDefs = gridApi.getColumnDefs();
        console.log('Current column definitions:', currentColDefs);
        
        if (!currentColDefs || !Array.isArray(currentColDefs)) {
          throw new Error('Could not get column definitions from grid API');
        }
        
        // Create a map of updates by colId
        const columnUpdatesMap = localColumnState.reduce((map, column) => {
          map[column.colId] = column;
          return map;
        }, {});
        
        // Update column definitions
        const updatedColDefs = currentColDefs.map((colDef: any) => {
          const colId = colDef.colId || colDef.field;
          const updates = columnUpdatesMap[colId];
          
          if (!updates) return colDef;
          
          console.log(`Updating column definition for ${colId}:`, updates);
          
          // Create a new column definition with updates
          const newColDef = { ...colDef };
          
          // Update specific properties that we want to change
          if (updates.headerName !== undefined) {
            console.log(`Setting headerName for ${colId} to:`, updates.headerName);
            newColDef.headerName = updates.headerName;
          }
          
          // Update width, hide, pinned state
          if (updates.width !== undefined) newColDef.width = updates.width;
          if (updates.hide !== undefined) newColDef.hide = updates.hide;
          if (updates.pinned !== undefined) newColDef.pinned = updates.pinned;
          
          // Update header component params
          if (updates.headerAlignment !== undefined || 
              updates.headerBackgroundColor !== undefined ||
              updates.headerTextColor !== undefined ||
              updates.headerFontFamily !== undefined ||
              updates.headerFontSize !== undefined ||
              updates.headerFontWeight !== undefined ||
              updates.headerFontStyle !== undefined) {
            
            newColDef.headerComponentParams = {
              ...colDef.headerComponentParams,
              alignment: updates.headerAlignment,
              backgroundColor: updates.headerBackgroundColor,
              textColor: updates.headerTextColor,
              fontFamily: updates.headerFontFamily,
              fontSize: updates.headerFontSize,
              fontWeight: updates.headerFontWeight,
              fontStyle: updates.headerFontStyle
            };
          }
          
          // Update cell style
          if (updates.cellAlignment !== undefined ||
              updates.cellBackgroundColor !== undefined ||
              updates.cellTextColor !== undefined ||
              updates.cellFontFamily !== undefined ||
              updates.cellFontSize !== undefined ||
              updates.cellFontWeight !== undefined ||
              updates.cellFontStyle !== undefined) {
            
            newColDef.cellStyle = {
              ...colDef.cellStyle,
              textAlign: updates.cellAlignment,
              backgroundColor: updates.cellBackgroundColor,
              color: updates.cellTextColor,
              fontFamily: updates.cellFontFamily,
              fontSize: updates.cellFontSize,
              fontWeight: updates.cellFontWeight,
              fontStyle: updates.cellFontStyle
            };
          }
          
          return newColDef;
        });
        
        // Log the updated definitions before applying
        console.log('Setting updated column definitions:', JSON.stringify(updatedColDefs, null, 2));
        
        // Update the grid's column definitions directly
        const gridOptions = gridApi.getGridOption('gridOptions');
        gridOptions.columnDefs = updatedColDefs;
        
        // Force a complete refresh of the grid
        gridApi.setGridOption('columnDefs', updatedColDefs);
        gridApi.refreshHeader();
        gridApi.refreshCells({ force: true });
        
        // Update the store with the new state
        const finalColumnState = gridApi.getColumnState();
        console.log('Final column state:', finalColumnState);
        setColumnState(finalColumnState);
        
        // Clear dialog state
        setChangeHistory([]);
        setChangeIndex(-1);
        setIsDirty(false);
        
        // Clear the column changes flag
        setApplyingColumnChanges(false);
        console.log('Column settings successfully applied!');
        
      } catch (error) {
        console.error('Error applying column settings:', error);
        setApplyingColumnChanges(false);
      }
    } catch (error) {
      console.error('Failed to apply column settings:', error);
      setApplyingColumnChanges(false);
    }
  };

  // Render the dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Column Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Configure column properties including visibility, header and cell styling, formatting, and component options.
          </DialogDescription>
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
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Column List Sidebar */}
          <div className="w-64 border-r pr-2">
            <ColumnList 
              columns={localColumnState}
              selectedColumnId={selectedColumnId}
              onColumnSelect={handleColumnSelect}
              onToggleVisibility={handleToggleVisibility}
            />
          </div>
          
          {/* Column Editor */}
          <div className="flex-1 pl-4">
            {selectedColumn ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="header">Header</TabsTrigger>
                  <TabsTrigger value="cell">Cell</TabsTrigger>
                  <TabsTrigger value="formatting">Formatting</TabsTrigger>
                  <TabsTrigger value="component">Component</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[calc(80vh-180px)]">
                  <TabsContent value="header" className="m-0">
                    <HeaderSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="cell" className="m-0">
                    <CellSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="formatting" className="m-0">
                    <FormattingSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="component" className="m-0">
                    <ComponentSettings 
                      column={selectedColumn}
                      onChange={(property, value) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a column to edit
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!isDirty}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 