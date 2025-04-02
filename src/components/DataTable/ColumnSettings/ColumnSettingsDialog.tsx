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
import { GridApi, ColDef, ColGroupDef, ColumnState } from 'ag-grid-community';

// Import components with type declarations
import { ColumnList } from './ColumnList';
import { HeaderSettings } from './HeaderSettings';
import { CellSettings } from './CellSettings';
import { FormattingSettings } from './FormattingSettings';
import { ComponentSettings } from './ComponentSettings';

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

interface CellStyleProperties {
  textAlign?: string;
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
}

// Update ColumnState to match AG Grid's types
interface ExtendedColumnState extends ColumnState {
  headerName?: string;
  field?: string;
  headerAlignment?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  headerFontFamily?: string;
  headerFontSize?: number;
  headerFontWeight?: string;
  headerFontStyle?: string;
  cellAlignment?: string;
  cellBackgroundColor?: string;
  cellTextColor?: string;
  cellFontFamily?: string;
  cellFontSize?: number;
  cellFontWeight?: string;
  cellFontStyle?: string;
  valueFormatter?: string;
  formatterParams?: Record<string, unknown>;
  valueFormatterPattern?: string;
  cellRenderer?: string;
  cellEditor?: string;
  cellEditorParams?: Record<string, unknown>;
  editable?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  filter?: boolean;
  filterParams?: Record<string, unknown>;
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
    setColumnState,
    setApplyingColumnChanges
  } = useGridStore();

  // Local state for the dialog
  const [localColumnState, setLocalColumnState] = useState<ExtendedColumnState[]>(columnState as ExtendedColumnState[]);
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
      const colDef = column ? column.getColDef() : {};
      
      // Get cell style properties safely
      const cellStyle = typeof colDef.cellStyle === 'function' ? {} : (colDef.cellStyle as CellStyleProperties) || {};
      
      // Extract header settings if they exist, otherwise use null to indicate not explicitly set
      const headerComponentParams = colDef.headerComponentParams || {};
      
      // Create an enriched column state that only includes explicitly defined properties
      const enrichedState: ExtendedColumnState = {
        ...col,
        // Add basic properties that aren't in the standard column state
        headerName: colDef.headerName || col.colId,
        field: colDef.field || col.colId,
      };
      
      // Only add header styling properties that are explicitly defined in the column def
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
      
      // Only add cell styling properties that are explicitly defined in the column def
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
        enrichedState.cellFontSize = typeof cellStyle.fontSize === 'string'
          ? parseInt(cellStyle.fontSize.replace('px', ''), 10)
          : cellStyle.fontSize;
      }
      
      if (cellStyle.fontWeight !== undefined) {
        enrichedState.cellFontWeight = cellStyle.fontWeight;
      }
      
      if (cellStyle.fontStyle !== undefined) {
        enrichedState.cellFontStyle = cellStyle.fontStyle;
      }
      
      // Formatting settings - only include if explicitly defined
      if (colDef.valueFormatter) {
        enrichedState.valueFormatter = typeof colDef.valueFormatter === 'function' ? 'custom' : colDef.valueFormatter;
      }
      
      const valueParserParams = (colDef as { valueParserParams?: Record<string, unknown> }).valueParserParams;
      if (valueParserParams) {
        enrichedState.formatterParams = valueParserParams;
      }
      
      const valueFormatterPattern = (colDef as { valueFormatterPattern?: string }).valueFormatterPattern;
      if (valueFormatterPattern) {
        enrichedState.valueFormatterPattern = valueFormatterPattern;
      }
      
      // Component settings - only include if explicitly defined
      if (colDef.cellRenderer) {
        enrichedState.cellRenderer = colDef.cellRenderer;
      }
      
      if (colDef.cellEditor) {
        enrichedState.cellEditor = colDef.cellEditor;
      } else {
        // Default cell editor if not specified
        enrichedState.cellEditor = 'agTextCellEditor';
      }
      
      if (colDef.cellEditorParams) {
        enrichedState.cellEditorParams = colDef.cellEditorParams;
      }
      
      // Other properties - explicitly check boolean values
      if (colDef.editable !== undefined) {
        enrichedState.editable = colDef.editable === true;
      }
      
      if (colDef.resizable !== undefined) {
        enrichedState.resizable = colDef.resizable !== false;
      }
      
      if (colDef.sortable !== undefined) {
        enrichedState.sortable = colDef.sortable !== false;
      }
      
      if (colDef.filter !== undefined) {
        enrichedState.filter = colDef.filter !== false;
      }
      
      if (colDef.filterParams) {
        enrichedState.filterParams = colDef.filterParams;
      }
      
      return enrichedState;
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
  const handleColumnChange = (columnId: string, property: keyof ExtendedColumnState, value: unknown) => {
    // Record the change for undo/redo
    const column = localColumnState.find(col => col.colId === columnId);
    if (!column) return;

    // Track if the property was previously undefined (not explicitly set)
    const wasExplicitlySet = column[property] !== undefined;
    const previousValue = column[property];
    
    // Special handling to detect "clearing" a value (setting it back to undefined)
    // This is important for preserving theme values
    const isResettingToDefault = value === '' || value === null || value === 'default';
    const actualValue = isResettingToDefault ? undefined : value;
    
    console.log(`Column change: ${columnId}.${String(property)} from ${previousValue} to ${actualValue} (wasExplicitlySet: ${wasExplicitlySet}, isResettingToDefault: ${isResettingToDefault})`);
    
    // If we're in the middle of the history, truncate it
    if (changeIndex < changeHistory.length - 1) {
      setChangeHistory(prev => prev.slice(0, changeIndex + 1));
    }
    
    // Add the new change to history
    setChangeHistory(prev => [...prev, {
      type: 'COLUMN_CHANGE',
      columnId,
      property,
      value: actualValue,
      previousValue
    }]);
    setChangeIndex(prev => prev + 1);
    
    // Update the column state
    setLocalColumnState(prev => 
      prev.map(col => 
        col.colId === columnId 
          ? { ...col, [property]: actualValue }
          : col
      )
    );
    
    setIsDirty(true);
  };

  // Apply changes to multiple columns (group)
  const handleApplyToGroup = (property: keyof ExtendedColumnState, value: unknown) => {
    if (!selectedColumn) return;
    
    // Find all columns in the same group
    const groupId = selectedColumn.colId.split('.')[0];
    const columnsInGroup = localColumnState.filter(col => 
      col.colId.startsWith(groupId + '.') || col.colId === groupId
    );
    
    // Special handling to detect "clearing" a value (setting it back to undefined)
    // This is important for preserving theme values
    const isResettingToDefault = value === '' || value === null || value === 'default';
    const actualValue = isResettingToDefault ? undefined : value;
    
    console.log(`Applying group change: ${property} to ${actualValue} for group ${groupId} (${columnsInGroup.length} columns)`);
    
    // Update all columns in the group
    let newColumnState = [...localColumnState];
    const changes: ColumnChange[] = [];
    
    columnsInGroup.forEach(col => {
      // Track if the property was previously undefined (not explicitly set)
      const wasExplicitlySet = col[property] !== undefined;
      const previousValue = col[property];
      
      changes.push({
        type: 'COLUMN_CHANGE',
        columnId: col.colId,
        property,
        value: actualValue,
        previousValue
      });
      
      newColumnState = newColumnState.map(c => 
        c.colId === col.colId 
          ? { ...c, [property]: actualValue }
          : c
      );
    });
    
    // Add all changes to history as a single group
    if (changeIndex < changeHistory.length - 1) {
      setChangeHistory(prev => prev.slice(0, changeIndex + 1));
    }
    
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
      
      // Set the flag in the store to prevent grid event handlers from overriding our changes
      setApplyingColumnChanges(true);
      
      // We'll close the dialog after we're done with the changes, not immediately
      // This helps ensure our changes are fully applied before event handlers take over
      
      try {
        // 1. Get current column definitions
        const currentColDefs = gridApi.getColumnDefs();
        console.log('Current column definitions:', currentColDefs);
        
        if (!currentColDefs || !Array.isArray(currentColDefs)) {
          throw new Error('Could not get column definitions from grid API');
        }
        
        // 2. Create a map of updates by colId
        const columnUpdatesMap = localColumnState.reduce((map, column) => {
          map[column.colId] = column;
          return map;
        }, {} as Record<string, ExtendedColumnState>);
        
        // 3. Update column definitions
        const updatedColDefs = currentColDefs.map((colDef: ColDef | ColGroupDef) => {
          const colId = (colDef as ColDef).colId || (colDef as ColDef).field;
          if (!colId) return colDef;
          
          const updates = columnUpdatesMap[colId];
          if (!updates) return colDef;
          
          console.log(`Updating column definition for ${colId}:`, updates);
          
          // Create a new column definition preserving existing properties
          const newColDef = { ...colDef };
          
          // Apply all custom properties that the column settings dialog manages
          // Header properties
          if (updates.headerName !== undefined) (newColDef as ColDef).headerName = updates.headerName;
          
          // Start with existing headerComponentParams or empty object
          const headerParams = { ...((colDef as ColDef).headerComponentParams || {}) };
          let hasHeaderChanges = false;
          
          // Only set header properties that are explicitly defined in the updates
          if (updates.headerAlignment !== undefined) {
            headerParams.alignment = updates.headerAlignment;
            hasHeaderChanges = true;
          }
          
          if (updates.headerBackgroundColor !== undefined) {
            headerParams.backgroundColor = updates.headerBackgroundColor;
            hasHeaderChanges = true;
          }
          
          if (updates.headerTextColor !== undefined) {
            headerParams.textColor = updates.headerTextColor;
            hasHeaderChanges = true;
          }
          
          if (updates.headerFontFamily !== undefined) {
            headerParams.fontFamily = updates.headerFontFamily;
            hasHeaderChanges = true;
          }
          
          if (updates.headerFontSize !== undefined) {
            headerParams.fontSize = updates.headerFontSize;
            hasHeaderChanges = true;
          }
          
          if (updates.headerFontWeight !== undefined) {
            headerParams.fontWeight = updates.headerFontWeight;
            hasHeaderChanges = true;
          }
          
          if (updates.headerFontStyle !== undefined) {
            headerParams.fontStyle = updates.headerFontStyle;
            hasHeaderChanges = true;
          }
          
          // Only apply if there are explicit changes
          if (hasHeaderChanges) {
            console.log(`Applied header params for ${colId}:`, headerParams);
            (newColDef as ColDef).headerComponentParams = headerParams;
          } else {
            console.log(`No header changes for ${colId}, preserving theme values`);
          }
          
          // Cell styling properties - only apply styles that are explicitly defined
          // Don't apply default values that would override the theme
          // Start with existing cellStyle or empty object
          const originalCellStyle = typeof (colDef as ColDef).cellStyle === 'object' 
            ? { ...((colDef as ColDef).cellStyle || {}) } 
            : {};
            
          let hasCellStyleChanges = false;
          
          // Only set cell properties that are explicitly defined in the updates
          if (updates.cellAlignment !== undefined) {
            originalCellStyle.textAlign = updates.cellAlignment;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellBackgroundColor !== undefined) {
            originalCellStyle.backgroundColor = updates.cellBackgroundColor;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellTextColor !== undefined) {
            originalCellStyle.color = updates.cellTextColor;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellFontFamily !== undefined) {
            originalCellStyle.fontFamily = updates.cellFontFamily;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellFontSize !== undefined) {
            originalCellStyle.fontSize = typeof updates.cellFontSize === 'number' 
              ? `${updates.cellFontSize}px` 
              : updates.cellFontSize;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellFontWeight !== undefined) {
            originalCellStyle.fontWeight = updates.cellFontWeight;
            hasCellStyleChanges = true;
          }
          
          if (updates.cellFontStyle !== undefined) {
            originalCellStyle.fontStyle = updates.cellFontStyle;
            hasCellStyleChanges = true;
          }
          
          // Only apply if there are explicit changes
          if (hasCellStyleChanges) {
            console.log(`Applied cell style for ${colId}:`, originalCellStyle);
            (newColDef as ColDef).cellStyle = originalCellStyle;
          } else {
            console.log(`No cell style changes for ${colId}, preserving theme values`);
          }
          
          // Component properties - only apply if explicitly defined
          if (updates.cellRenderer !== undefined) {
            (newColDef as ColDef).cellRenderer = updates.cellRenderer;
            console.log(`Applied cellRenderer for ${colId}: ${updates.cellRenderer}`);
          }
          
          if (updates.cellEditor !== undefined) {
            (newColDef as ColDef).cellEditor = updates.cellEditor;
            console.log(`Applied cellEditor for ${colId}: ${updates.cellEditor}`);
          }
          
          // Apply cellEditorParams only if defined
          if (updates.cellEditorParams !== undefined) {
            (newColDef as ColDef).cellEditorParams = updates.cellEditorParams;
            console.log(`Applied cellEditorParams for ${colId}:`, updates.cellEditorParams);
          }
          
          // Functionality properties - only apply if explicitly defined
          if (updates.editable !== undefined) {
            (newColDef as ColDef).editable = updates.editable;
            console.log(`Applied editable for ${colId}: ${updates.editable}`);
          }
          
          if (updates.filter !== undefined) {
            (newColDef as ColDef).filter = updates.filter;
            console.log(`Applied filter for ${colId}: ${updates.filter}`);
          }
          
          if (updates.sortable !== undefined) {
            (newColDef as ColDef).sortable = updates.sortable;
            console.log(`Applied sortable for ${colId}: ${updates.sortable}`);
          }
          
          if (updates.resizable !== undefined) {
            (newColDef as ColDef).resizable = updates.resizable;
            console.log(`Applied resizable for ${colId}: ${updates.resizable}`);
          }
          
          // Formatting properties
          // Only modify valueFormatter if we have explicit formatting updates
          let hasFormattingChanges = false;
          
          // Check if we need to clear/update formatter properties
          if (updates.valueFormatter !== undefined || 
              updates.numberFormat !== undefined || 
              updates.dateFormat !== undefined || 
              updates.textTransform !== undefined) {
              
            // Clear existing formatters to avoid conflicts
            delete (newColDef as ColDef).valueFormatter;
            delete (newColDef as ColDef).valueParserParams;
            delete (newColDef as ColDef).valueFormatterParams;
            
            hasFormattingChanges = true;
            console.log(`Cleared existing formatters for ${colId}`);
          }
          
          // Apply formatter params if defined
          if (updates.formatterParams !== undefined) {
            (newColDef as ColDef).valueFormatterParams = updates.formatterParams;
            hasFormattingChanges = true;
            console.log(`Applied formatter params for ${colId}:`, updates.formatterParams);
          }
          
          // Apply number formatting based on settings
          // Handle specific formatting types
          if (updates.numberFormat && updates.numberFormat !== 'none') {
            // Create a proper formatter function based on the type
            try {
              switch (updates.numberFormat) {
                case 'currency':
                  // Use a string that returns a formatted currency value
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: ${updates.decimalPlaces || 2},
                        maximumFractionDigits: ${updates.decimalPlaces || 2}
                      }).format(Number(params.value));
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'percentage':
                  // Use a string that returns a formatted percentage value
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return new Intl.NumberFormat('en-US', {
                        style: 'percent',
                        minimumFractionDigits: ${updates.decimalPlaces || 0},
                        maximumFractionDigits: ${updates.decimalPlaces || 0}
                      }).format(Number(params.value));
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'decimal':
                  // Use a string that returns a formatted decimal value
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: ${updates.decimalPlaces || 2},
                        maximumFractionDigits: ${updates.decimalPlaces || 2}
                      }).format(Number(params.value));
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'integer':
                  // Use a string that returns a formatted integer value
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(Math.round(Number(params.value)));
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
              }
            } catch (e) {
              console.error('Error creating number formatter:', e);
            }
          } else if (updates.dateFormat && updates.dateFormat !== 'none') {
            // Create date formatters
            try {
              // For date formatting, use a simpler approach with toLocaleDateString
              switch (updates.dateFormat) {
                case 'short':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      const date = new Date(params.value);
                      if (isNaN(date.getTime())) return params.value;
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      });
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'medium':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      const date = new Date(params.value);
                      if (isNaN(date.getTime())) return params.value;
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'long':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      const date = new Date(params.value);
                      if (isNaN(date.getTime())) return params.value;
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'iso':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      const date = new Date(params.value);
                      if (isNaN(date.getTime())) return params.value;
                      return date.toISOString().split('T')[0];
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
              }
            } catch (e) {
              console.error('Error creating date formatter:', e);
            }
          } else if (updates.textTransform && updates.textTransform !== 'none') {
            // Apply text transformations
            try {
              switch (updates.textTransform) {
                case 'uppercase':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return String(params.value).toUpperCase();
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'lowercase':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return String(params.value).toLowerCase();
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
                  
                case 'capitalize':
                  (newColDef as ColDef).valueFormatter = `function(params) {
                    if (params.value == null) return '';
                    try {
                      return String(params.value).replace(/\\b\\w/g, function(letter) { 
                        return letter.toUpperCase(); 
                      });
                    } catch (e) {
                      return params.value;
                    }
                  }`;
                  break;
              }
            } catch (e) {
              console.error('Error creating text formatter:', e);
            }
          }
          return newColDef;
        });
        
        // 4. If the onApplySettings callback is provided, call it with the updated column definitions
        if (onApplySettings) {
          console.log('Calling onApplySettings callback with updated column definitions');
          console.log('Column Definitions being passed to parent:', JSON.stringify(updatedColDefs));
          onApplySettings(updatedColDefs as ColDef[]);
        } else {
          // If no callback is provided, update the grid directly (previous approach)
          console.log('No callback provided, updating grid directly (not recommended)');
          gridApi.setGridOption('columnDefs', updatedColDefs);
        }
        
        // 5. Apply basic column state (width, visibility, pinning, sorting)
        const basicColumnState = localColumnState.map(({ colId, width, hide, pinned, sort, sortIndex }) => ({
          colId,
          width,
          hide: hide || false,
          pinned: pinned || null,
          sort: sort as 'asc' | 'desc' | null || null,
          sortIndex: sortIndex || null
        }));
        
        console.log('Basic column state to apply:', basicColumnState);
        
        // 6. Apply column state to the grid directly for immediate visual feedback
        console.log('Applying column state to grid');
        gridApi.applyColumnState({
          state: basicColumnState,
          applyOrder: true,
          defaultState: undefined
        });
        
        // 7. Force a complete refresh of the grid
        console.log('Refreshing grid display');
        gridApi.refreshHeader();
        gridApi.refreshCells({ force: true });
        
        // 8. Wait for grid to settle before updating store
        setTimeout(() => {
          try {
            // Get the final column state after all changes are applied
            const finalColumnState = gridApi.getColumnState();
            console.log('Final column state:', finalColumnState);
            
            // Update store state with the final column state
            console.log('Updating store with final column state');
            setColumnState(finalColumnState);
            
            // Clear dialog state
            setChangeHistory([]);
            setChangeIndex(-1);
            setIsDirty(false);
            
            // Keep the flag set for a bit longer to ensure all grid events are processed
            // Only now close the dialog
            onOpenChange(false);
            
            // Clear the column changes flag after a longer delay
            // This ensures that any grid events triggered by our changes don't override our settings
            setTimeout(() => {
              setApplyingColumnChanges(false);
              console.log('Column settings successfully applied and flag cleared!');
            }, 300);
          } catch (error) {
            console.error('Error in final state update:', error);
            setApplyingColumnChanges(false);
            onOpenChange(false);
          }
        }, 300); // Increased delay to ensure grid has time to process changes
      } catch (error) {
        console.error('Error applying column settings:', error);
        setApplyingColumnChanges(false);
        onOpenChange(false);
        toast?.error?.('Failed to apply column settings: ' + (error instanceof Error ? error.message : String(error)));
      }
    } catch (error) {
      console.error('Failed to apply column settings:', error);
      setApplyingColumnChanges(false);
      onOpenChange(false);
      toast?.error?.('Failed to apply column settings: ' + (error instanceof Error ? error.message : String(error)));
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
                      onChange={(property: keyof ExtendedColumnState, value: unknown) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="cell" className="m-0">
                    <CellSettings 
                      column={selectedColumn}
                      onChange={(property: keyof ExtendedColumnState, value: unknown) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="formatting" className="m-0">
                    <FormattingSettings 
                      column={selectedColumn}
                      onChange={(property: keyof ExtendedColumnState, value: unknown) => handleColumnChange(selectedColumn.colId, property, value)}
                      onApplyToGroup={handleApplyToGroup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="component" className="m-0">
                    <ComponentSettings 
                      column={selectedColumn}
                      onChange={(property: keyof ExtendedColumnState, value: unknown) => handleColumnChange(selectedColumn.colId, property, value)}
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