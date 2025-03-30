import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, X, Save, Columns } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ColumnTree } from "./ColumnTree";
import { ColumnEditor } from "./ColumnEditor";
import { debounce } from "./utils";
import type { ColumnState, ColumnDefinition } from "./types";
import type { AgGridReact } from "ag-grid-react";

interface ColumnSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gridRef: React.RefObject<AgGridReact>;
  fallbackColumnDefs?: any[];
}

export function ColumnSettingsDialog({
  open,
  onOpenChange,
  gridRef,
  fallbackColumnDefs = []
}: ColumnSettingsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [columnStates, setColumnStates] = useState<Record<string, ColumnState>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const initialStateRef = useRef<Record<string, ColumnState>>({});

  // Initialize column state from grid
  useEffect(() => {
    if (!open) return;
    
    console.log('Dialog opened, initializing column state');
    console.log('Grid ref available:', !!gridRef.current);

    // Increased delay to ensure grid is fully initialized
    const timeoutId = setTimeout(() => {
      console.log('Inside timeout callback');
      console.log('Grid ref:', gridRef.current);
      console.log('Grid API available:', !!gridRef.current?.api);
      
      // In AG-Grid 33+, the grid API has all the column methods
      const gridApi = gridRef.current?.api;
      
      if (!gridRef.current || !gridApi) {
        console.warn('Grid API not available');
        
        // First try fallback from props of grid instance
        if (gridRef.current && gridRef.current.props && gridRef.current.props.columnDefs) {
          console.log('Falling back to columnDefs from props:', gridRef.current.props.columnDefs);
          
          const fallbackColumnDefs = gridRef.current.props.columnDefs;
          const states: Record<string, ColumnState> = {};
          const columnDefs: ColumnDefinition[] = [];
          
          fallbackColumnDefs.forEach((colDef, index) => {
            const field = colDef.field || '';
            const colId = colDef.field || `col-${index}`;
            
            // Create column state
            states[colId] = {
              visible: true,
              width: 200,
              pinned: null,
              sort: null,
              position: index,
              headerName: colDef.headerName || field || '',
              field: field,
              filter: colDef.filter !== false,
              resizable: colDef.resizable !== false,
              sortable: colDef.sortable !== false,
              headerAlignment: colDef.headerClass || 'left',
              cellAlignment: colDef.cellClass || 'left',
            };
            
            // Create column definition
            columnDefs.push({
              id: colId,
              field: field,
              headerName: colDef.headerName || field || '',
              children: [],
            });
          });
          
          console.log('Created fallback columns:', columnDefs);
          
          // Update state
          setColumnStates(states);
          initialStateRef.current = JSON.parse(JSON.stringify(states));
          setColumns(columnDefs);
          
          // Clear selected column
          setSelectedColumn(null);
          return;
        }
        // Final fallback using directly passed columnDefs
        else if (fallbackColumnDefs && fallbackColumnDefs.length > 0) {
          console.log('Using directly passed fallbackColumnDefs:', fallbackColumnDefs);
          
          const states: Record<string, ColumnState> = {};
          const columnDefs: ColumnDefinition[] = [];
          
          fallbackColumnDefs.forEach((colDef, index) => {
            const field = colDef.field || '';
            const colId = colDef.field || `col-${index}`;
            
            // Create column state
            states[colId] = {
              visible: true,
              width: 200,
              pinned: null,
              sort: null,
              position: index,
              headerName: colDef.headerName || field || '',
              field: field,
              filter: colDef.filter !== false,
              resizable: colDef.resizable !== false,
              sortable: colDef.sortable !== false,
              headerAlignment: colDef.headerClass || 'left',
              cellAlignment: colDef.cellClass || 'left',
            };
            
            // Create column definition
            columnDefs.push({
              id: colId,
              field: field,
              headerName: colDef.headerName || field || '',
              children: [],
            });
          });
          
          console.log('Created fallback columns from direct props:', columnDefs);
          
          // Update state
          setColumnStates(states);
          initialStateRef.current = JSON.parse(JSON.stringify(states));
          setColumns(columnDefs);
          
          // Clear selected column
          setSelectedColumn(null);
          return;
        }
        
        return;
      }
      
      // In AG-Grid 33+, use gridApi.getColumns() instead of columnApi.getAllColumns()
      // Note: getColumns is not in the TypeScript definition, so we check for existence
      const getAllColumnsFn = typeof gridApi.getColumns === 'function' ? 
                             gridApi.getColumns.bind(gridApi) : 
                             (typeof gridApi.getAllColumns === 'function' ? 
                              gridApi.getAllColumns.bind(gridApi) : null);
      
      if (!getAllColumnsFn) {
        console.warn('Could not find getColumns or getAllColumns method on grid API');
        return;
      }
      
      const allColumns = getAllColumnsFn() || [];
      
      console.log('All columns:', allColumns);
      
      if (!allColumns || allColumns.length === 0) {
        console.warn('No columns found in the grid');
        return;
      }
      
      // Reset states
      const states: Record<string, ColumnState> = {};
      const columnDefs: ColumnDefinition[] = [];
      
      // Get column state from gridApi in AG-Grid 33+
      const columnState = gridApi.getColumnState ? gridApi.getColumnState() : [];

      allColumns.forEach(col => {
        const colDef = col.getColDef();
        const colId = col.getId();
        const colState = columnState.find(s => s.colId === colId);
        
        console.log('Processing column:', colId, colDef);
        
        // Create column state - using column methods that are the same in AG-Grid 33+
        states[colId] = {
          visible: col.isVisible(),
          width: col.getActualWidth(),
          pinned: col.getPinned(),
          sort: colState?.sort || null,
          // In AG-Grid 33+, use gridApi for getting column index
          position: typeof gridApi.getColumnIndex === 'function' ? 
                   gridApi.getColumnIndex(colId) : 
                   columnState.findIndex(s => s.colId === colId),
          headerName: colDef.headerName || colDef.field || '',
          field: colDef.field || '',
          filter: colDef.filter !== false,
          resizable: colDef.resizable !== false,
          sortable: colDef.sortable !== false,
          headerAlignment: colDef.headerClass || 'left',
          cellAlignment: colDef.cellClass || 'left',
        };

        // Create column definition
        columnDefs.push({
          id: colId,
          field: colDef.field || '',
          headerName: colDef.headerName || colDef.field || '',
          children: [], // Add children if you have grouped columns
        });
      });

      console.log('Processed states:', states);
      console.log('Processed column definitions:', columnDefs);

      // Update state
      setColumnStates(states);
      initialStateRef.current = JSON.parse(JSON.stringify(states));
      setColumns(columnDefs);
      
      // Clear selected column
      setSelectedColumn(null);
    }, 300); // Increased delay to ensure grid is ready
    
    return () => clearTimeout(timeoutId);
  }, [open, gridRef, fallbackColumnDefs]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        setColumns(prev => prev.map(col => ({ ...col, hidden: false })));
        return;
      }

      const searchLower = query.toLowerCase();
      setColumns(prev => 
        prev.map(col => ({
          ...col,
          hidden: !col.headerName?.toLowerCase().includes(searchLower) && 
                 !col.field.toLowerCase().includes(searchLower)
        }))
      );
    }, 150),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleColumnStateChange = (columnId: string, changes: Partial<ColumnState>) => {
    setColumnStates(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], ...changes }
    }));
    setHasChanges(true);
  };

  const handleApply = () => {
    if (!gridRef.current?.api) return;

    // In AG-Grid 33+, all column API methods are merged into the main gridApi
    const gridApi = gridRef.current.api;
    
    Object.entries(columnStates).forEach(([columnId, state]) => {
      // Get column using gridApi in AG-Grid 33+
      const column = gridApi.getColumn(columnId);
      if (!column) return;

      // Update column visibility using gridApi
      gridApi.setColumnVisible(columnId, state.visible);

      // Update column width using gridApi
      gridApi.setColumnWidth(columnId, state.width);

      // Update column pinning using gridApi
      gridApi.setColumnPinned(columnId, state.pinned);

      // Update column position using gridApi
      if (typeof state.position === 'number') {
        gridApi.moveColumn(columnId, state.position);
      }

      // Update column definition
      const colDef = column.getColDef();
      colDef.headerName = state.headerName;
      colDef.filter = state.filter;
      colDef.resizable = state.resizable;
      colDef.sortable = state.sortable;
      colDef.headerClass = state.headerAlignment;
      colDef.cellClass = state.cellAlignment;
    });

    // Refresh the grid
    gridApi.refreshHeader();
    gridApi.refreshCells({ force: true });

    setHasChanges(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        setColumnStates(initialStateRef.current);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1000px] p-0 backdrop-blur-sm">
        <DialogHeader className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border-b dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Columns className="h-4 w-4 text-primary" />
              <DialogTitle className="text-sm font-semibold text-foreground">
                {selectedColumn ? 
                  `Column: ${columnStates[selectedColumn]?.headerName || selectedColumn}` : 
                  'Column Settings'
                }
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex h-[600px] rounded-lg overflow-hidden border-0">
          {/* Left Panel - Column Tree */}
          <div className="w-[320px] border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-850/50 flex flex-col">
            {/* Search Bar */}
            <div className="p-3 border-b dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search columns..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Column List */}
            <ScrollArea className="flex-1">
              <ColumnTree
                columns={columns}
                selectedColumn={selectedColumn}
                onColumnSelect={setSelectedColumn}
                columnStates={columnStates}
                onColumnStateChange={handleColumnStateChange}
              />
            </ScrollArea>
          </div>

          {/* Right Panel - Column Editor */}
          <div className="flex-1 flex flex-col">
            {/* Content */}
            <ScrollArea className="flex-1 bg-white dark:bg-gray-900">
              {selectedColumn ? (
                <ColumnEditor
                  columnId={selectedColumn}
                  state={columnStates[selectedColumn]}
                  onChange={(changes) => handleColumnStateChange(selectedColumn, changes)}
                />
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Select a column to edit its properties
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between py-3 px-4 border-t dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:bg-gray-800 dark:bg-none shadow-sm">
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-xs py-0 px-2 rounded-md">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  size="sm"
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApply}
                  size="sm"
                  disabled={!hasChanges}
                  className="text-sm bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-3 w-3" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}