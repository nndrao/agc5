# Context-Based State Management for ag-Grid

This implementation provides a centralized state management system for ag-Grid in React. It uses React Context to maintain all grid settings, configurations, and profile information, ensuring a consistent state across all components.

## Core Architecture

```
ProfileSettings → Context → ag-Grid → Customization Dialogs
                   ↑   ↓       ↑
                   └───┴───────┘
```

## Features

- **Centralized State Management**: All grid configuration is stored in a single context
- **Profile System**: Support for multiple named configuration profiles
- **Default Profile**: Automatically loaded on initial application start
- **Stateless Dialog Boxes**: All customization dialogs share the same context
- **Type Safety**: Full TypeScript support throughout the implementation

## Main Components

### DataTableContext

The central context for all grid state and settings:

```tsx
// Use the context in your components
import { useDataTableContext } from './DataTableContext';

function MyComponent() {
  const { 
    settings, // Current grid settings
    updateSettings, // Update settings
    profiles, // Available profiles
    selectedProfileId, // Currently selected profile
    createProfile, // Create a new profile
    // ... other context values and methods
  } = useDataTableContext();
  
  // Use the context values and methods
}
```

### ProfileService

Service class for managing profiles:

```tsx
import { ProfileService } from './ProfileService';

// Create an instance
const profileService = new ProfileService();

// Get all profiles
const profiles = await profileService.getProfiles();

// Create a new profile
const newProfile = await profileService.createProfile(
  'My Profile',
  'Description',
  settings,
  columnState,
  filterModel,
  sortModel
);

// Other methods: updateProfile, saveProfiles, getDefaultProfile, etc.
```

### SettingsService

Service for managing grid settings:

```tsx
import { SettingsService } from './SettingsService';

// Create an instance
const settingsService = new SettingsService();

// Apply settings to grid
settingsService.applySettingsToGrid(settings, gridApi, columnApi);

// Validate settings
const validSettings = settingsService.validateSettings(partialSettings);

// Merge settings
const newSettings = settingsService.mergeSettings(currentSettings, partialSettings);
```

### GridStateUtils

Utilities for working with grid state:

```tsx
import { gridStateUtils } from './GridStateUtils';

// Apply a profile in stages
const result = gridStateUtils.loadProfileInStages(
  gridApi,
  columnApi,
  settings,
  columnState,
  filterModel,
  sortModel
);

// Capture current grid state
const state = gridStateUtils.captureGridState(gridApi, columnApi);
```

### ProfileManager Component

UI component for managing profiles:

```tsx
import { ProfileManager } from './ProfileManager/ProfileManager';

function MyComponent() {
  return (
    <div>
      <ProfileManager />
      {/* Other components */}
    </div>
  );
}
```

## Usage Example

To use the complete system in your application:

```tsx
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { DataTableProvider, useDataTableContext } from './DataTableContext';
import { ProfileManager } from './ProfileManager/ProfileManager';

// Main DataTable component
function DataTable({ data }) {
  const {
    settings,
    columnState,
    updateColumnState,
    updateFilterModel,
    updateSortModel
  } = useDataTableContext();
  
  // Grid event handlers
  const onGridReady = (params) => {
    // Initialize grid
  };
  
  const onColumnStateChanged = (event) => {
    updateColumnState(event.columnApi.getColumnState());
  };
  
  const onFilterChanged = (event) => {
    updateFilterModel(event.api.getFilterModel());
  };
  
  const onSortChanged = (event) => {
    updateSortModel(event.api.getSortModel());
  };
  
  return (
    <div className="data-table-container">
      <div className="toolbar">
        <ProfileManager />
        {/* Other toolbar items */}
      </div>
      
      <div className="ag-theme-quartz">
        <AgGridReact
          rowData={data}
          onGridReady={onGridReady}
          onColumnStateChanged={onColumnStateChanged}
          onFilterChanged={onFilterChanged}
          onSortChanged={onSortChanged}
          // Apply settings from context
          {...settings}
        />
      </div>
    </div>
  );
}

// Wrap with provider
function DataTableWithProvider(props) {
  return (
    <DataTableProvider>
      <DataTable {...props} />
    </DataTableProvider>
  );
}

export default DataTableWithProvider;
```

## Profile Structure

Each profile contains:

- **id**: Unique identifier
- **name**: Display name
- **description**: Optional description
- **isDefault**: Whether this is the default profile
- **settings**: Grid settings (layout, behavior, etc.)
- **columnState**: Column visibility, order, width, etc.
- **filterModel**: Applied filters
- **sortModel**: Applied sorting
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Benefits

- Single source of truth for all grid configuration
- Consistent state across all components
- Separation of concerns (UI components vs. state management)
- Improved testability
- Type safety
- Profile management with persistence 