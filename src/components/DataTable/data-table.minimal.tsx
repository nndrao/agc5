/**
 * data-table.minimal.tsx
 * A completely stripped-down version of the DataTable component
 */
import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useGridStore } from './store/unifiedGridStore';
import { defaultColumnDefs } from "./defaultColumnDefs";

// Minimal DataTable component
export function DataTableWithProfiles<TData, TValue>({ columns, data }: { columns: any[], data: TData[] }) {
  // Access the unified store
  const { loadProfiles } = useGridStore();
  
  // Load profiles on mount
  useEffect(() => {
    console.log('DataTableWithProfiles: Loading profiles');
    loadProfiles();
  }, [loadProfiles]);
  
  return (
    <div className="data-table-container">
      <DataTableInner data={data} />
    </div>
  );
}

// Minimal DataTableInner component
function DataTableInner<TData>({ data }: { data: TData[] }) {
  // Access unified store
  const {
    setGridApi,
    selectProfile,
    profiles,
    selectedProfileId,
    applyGridState
  } = useGridStore();
  
  // Local state
  const [gridReady, setGridReady] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  
  // Handle grid ready
  const onGridReady = (params: any) => {
    console.log("Grid Ready!");
    setGridReady(true);
    
    // Store the grid API in the unified store
    setGridApi(params.api);
    
    // Apply grid state if we have a selected profile
    if (selectedProfileId) {
      console.log('Applying grid state from selected profile');
      applyGridState();
    }
  };
  
  // Load the selected profile when it changes
  useEffect(() => {
    if (selectedProfileId && gridReady && gridRef.current?.api) {
      console.log(`Loading profile with ID: ${selectedProfileId}`);
      selectProfile(selectedProfileId);
    }
  }, [selectedProfileId, gridReady, selectProfile]);
  
  // Simple profile selector
  const handleProfileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = event.target.value;
    if (profileId === selectedProfileId) {
      console.log(`Profile ${profileId} is already selected, skipping`);
      return;
    }
    
    console.log(`Loading profile with ID: ${profileId}`);
    selectProfile(profileId);
  };
  
  return (
    <div>
      {/* Simple profile selector */}
      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={selectedProfileId || ""}
          onChange={handleProfileSelect}
          disabled={profiles.length === 0}
        >
          <option value="" disabled>
            Select a profile
          </option>
          {profiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name} {profile.isDefault ? '(Default)' : ''}
            </option>
          ))}
        </select>
      </div>
      
      {/* AG-Grid */}
      <div className="ag-theme-quartz h-[600px] w-full">
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={defaultColumnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            resizable: true
          }}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
