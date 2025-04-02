import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Columns, Settings } from 'lucide-react';
import { DataTableProvider, useDataTableContext } from './DataTableContext';
import { ColumnSettingsDialog } from './ColumnSettings/ColumnSettingsDialog';
import { ProfileManager } from './ProfileManager/ProfileManager';

// Example data for the grid
const exampleData = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York', salary: 85000, startDate: '2020-01-15' },
  { id: 2, name: 'Jane Smith', age: 28, city: 'San Francisco', salary: 92000, startDate: '2019-03-20' },
  { id: 3, name: 'Mike Johnson', age: 35, city: 'Chicago', salary: 78000, startDate: '2018-11-08' },
  { id: 4, name: 'Sara Williams', age: 32, city: 'Boston', salary: 88000, startDate: '2021-02-10' },
  { id: 5, name: 'David Brown', age: 42, city: 'Seattle', salary: 110000, startDate: '2017-06-25' },
];

// Default column definitions
const defaultColDef = {
  flex: 1,
  minWidth: 100,
  filter: true,
  sortable: true,
  resizable: true,
  editable: false,
};

// Define column definitions for the grid
const columnDefs = [
  { field: 'id', headerName: 'ID', width: 80, flex: 0 },
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age', width: 100, flex: 0 },
  { field: 'city', headerName: 'City' },
  { field: 'salary', headerName: 'Salary', valueFormatter: (params: any) => `$${params.value.toLocaleString()}` },
  { field: 'startDate', headerName: 'Start Date' },
];

function DataTableExampleInner() {
  const { 
    columnState, 
    updateColumnState, 
    filterModel, 
    updateFilterModel, 
    sortModel, 
    updateSortModel 
  } = useDataTableContext();
  
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  
  // Handle grid ready event
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    
    // Initial sync of column state with context
    if (columnState.length === 0) {
      updateColumnState(params.api.getColumnState());
    } else {
      // Apply existing column state from context
      params.api.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }
    
    // Apply filter model
    if (filterModel && Object.keys(filterModel).length > 0) {
      params.api.setFilterModel(filterModel);
    }
    
    // Apply sort model
    if (sortModel && sortModel.length > 0) {
      params.api.setSortModel(sortModel);
    }
  };
  
  // Sync column state changes with context
  const onColumnStateChanged = () => {
    if (gridApi) {
      updateColumnState(gridApi.getColumnState());
    }
  };
  
  // Sync filter changes with context
  const onFilterChanged = () => {
    if (gridApi) {
      updateFilterModel(gridApi.getFilterModel());
    }
  };
  
  // Sync sort changes with context
  const onSortChanged = () => {
    if (gridApi) {
      // In AG-Grid 33+, extract sort model from column state
      const columnState = gridApi.getColumnState();
      const sortModel = columnState
        .filter(col => col.sort !== null && col.sort !== undefined)
        .map(col => ({
          colId: col.colId,
          sort: col.sort,
          sortIndex: col.sortIndex
        }));
      updateSortModel(sortModel);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Data Table Example</h1>
        
        <div className="flex items-center gap-2">
          <ProfileManager />
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsColumnSettingsOpen(true)}
            title="Column Settings"
          >
            <Columns className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Grid */}
      <div className="flex-1 w-full ag-theme-quartz">
        <AgGridReact
          ref={gridRef}
          rowData={exampleData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onColumnStateChanged={onColumnStateChanged}
          onFilterChanged={onFilterChanged}
          onSortChanged={onSortChanged}
          domLayout="normal"
        />
      </div>
      
      {/* Column Settings Dialog */}
      {gridApi && (
        <ColumnSettingsDialog
          open={isColumnSettingsOpen}
          onOpenChange={setIsColumnSettingsOpen}
          gridApi={gridApi}
        />
      )}
    </div>
  );
}

// Wrapper component that provides the DataTableContext
export function DataTableExample() {
  return (
    <DataTableProvider>
      <DataTableExampleInner />
    </DataTableProvider>
  );
} 