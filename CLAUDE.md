# AG-Grid React Project Guidelines

## Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production (runs TypeScript compiler and Vite build) 
- **Lint**: `npm run lint` - Run ESLint on codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Type Check**: `tsc --noEmit` - Run TypeScript type checking
- **Format Check**: `prettier --check .` - Check formatting (if Prettier is installed)

## Code Style
- **Imports**: Use aliases with `@/` prefix for internal imports (e.g., `@/components/ui/button`)
- **Components**: Use functional components with hooks, prefer destructured props
- **TypeScript**: 
  - Use strict type checking, avoid `any` types when possible
  - Define interfaces/types in separate files or at top of component files
  - Use explicit return types for functions and React components
- **Naming**:
  - Components: PascalCase (e.g., `DataTable.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useTheme`)
  - Utilities: camelCase (e.g., `getProfiles`)
  - Interfaces: Prefix with 'I' (e.g., `ITableProps`)
  - Types: PascalCase, descriptive names (e.g., `ColumnDefinition`)
- **UI Components**: Use shadcn/ui component patterns with Radix UI primitives
- **AG-Grid 33+**: 
  - Use `gridApi` for all operations including column methods (deprecated columnApi is now merged into gridApi)
  - Use `gridApi.setGridOption(key, value)` to update grid options individually
  - Use `gridApi.getGridOption(key)` to retrieve specific grid settings
  - Use themeParams for styling (avoid deprecated theme objects)
  - Use CSS variables for theming (`--ag-*` variables)
  - For component code that manipulates columns in AG-Grid 33+:
    ```typescript
    // Get all columns
    const columns = gridApi.getColumns(); // instead of columnApi.getAllColumns()
    
    // Column operations
    gridApi.setColumnVisible(colId, visible);
    gridApi.setColumnWidth(colId, width);
    gridApi.setColumnPinned(colId, pinned);
    gridApi.moveColumn(colId, index);
    ```
  - Use `gridApi.getColumnState()` and `gridApi.applyColumnState()` for column state management
  - For profile management, use the unified API approach:
    ```typescript
    // Access grid API (columnApi merged into gridApi in AG-Grid 33+)
    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    
    // Get column state
    const columnState = gridApi.getColumnState();
    
    // Apply column state
    gridApi.applyColumnState({
      state: columnState,
      applyOrder: true
    });
    ```
  - Use `rowData` and `columnDefs` as React props to AgGridReact component
  - Use object format for rowSelection to avoid deprecation warnings:
    ```tsx
    rowSelection={{
      type: 'multiRow', // or 'singleRow'
      enableClickSelection: true,  // Equivalent to !suppressRowClickSelection
      enableSelectionWithoutKeys: false, // Equivalent to rowMultiSelectWithClick
      groupSelects: 'descendants', // Values: 'children', 'descendants', 'filteredDescendants'
      copySelectedRows: true // Equivalent to !suppressCopyRowsToClipboard
    }}
    ```
  - Avoid these deprecated selection properties:
    - `rowDeselection` - No longer needed, all rowSelection types allow deselection
    - `suppressRowDeselection` - No longer needed, replaced by selection behavior in rowSelection object
    - `groupSelectsChildren` - Replaced by rowSelection.groupSelects
    - `groupSelectsFiltered` - Replaced by using 'filteredDescendants' in rowSelection.groupSelects
    - Using "single" or "multiple" for rowSelection - Use "singleRow" or "multiRow" instead
  - Use `suppressCellFocus` instead of invalid `suppressCellSelection`
  - Use `resetRowDataOnUpdate` and `getRowId` instead of invalid `immutableData`/`deltaRowDataMode`
  - Use `defaultColDef.sortingOrder` instead of deprecated grid-level `sortingOrder`
  - Use `defaultColDef.unSortIcon` instead of deprecated grid-level `unSortIcon`
  - Use `cellSelection` instead of deprecated `enableRangeSelection`
  - Use `groupTotalRow` and `grandTotalRow` instead of invalid `groupIncludeFooter` and `groupIncludeTotalFooter`
  - Use `enableRowGroup` only in `defaultColDef`, not at grid level
  - Use `enterNavigatesVertically` instead of invalid `enterMovesDown`
  - Use `enterNavigatesVerticallyAfterEdit` instead of invalid `enterMovesDownAfterEdit`
  - Use `cellFlashDuration` and `cellFadeDuration` instead of invalid `enableCellChangeFlash`
  - Use `asyncTransactionWaitMillis` instead of invalid `batchUpdateWaitMillis`
  - Do not use invalid properties like `tabNavigatesVertically` (use callback instead)
  - Do not use invalid properties: `suppressAriaColCount`, `suppressAriaRowCount`
  - Do not use `cacheBlockSize` with clientSide row model
  - Avoid deprecated `suppressBrowserResizeObserver` which has no effect
- **State Management**: Use React hooks for local state, context for component trees
- **Error Handling**: Use try/catch blocks with console logging for debugging
- **CSS**: Use Tailwind utility classes with the `cn` helper for conditional classes
- **Formatting**: 2-space indentation, single quotes, semicolons required

## Project Structure
- UI components in `/components/ui/`
- Feature components in directories by feature (e.g., `/components/DataTable/`)
- Utilities in `/lib/` directory
- Use barrel exports (index.ts) for organizing exports from directories

## Recent Fixes and Improvements

### 1. Fixed AG Grid Selection Mode Errors

AG Grid 33+ requires a valid `rowSelection` object with a proper `type` property ('singleRow' or 'multiRow'). Implemented multiple layers of protection:

```typescript
// Helper function to validate rowSelection type
const validateRowSelectionType = (rowSelection: any): boolean => {
  if (!rowSelection) return false;
  if (typeof rowSelection !== 'object') return false;
  if (!rowSelection.type) return false;  // Ensure type exists
  if (rowSelection.type !== 'singleRow' && rowSelection.type !== 'multiRow') return false;
  return true;
};

// Initialization effect to ensure rowSelection is valid on startup
useEffect(() => {
  if (!validateRowSelectionType(gridSettings.rowSelection)) {
    // Create a proper rowSelection object
    setGridSettings(prev => ({
      ...prev,
      rowSelection: {
        type: 'multiRow',
        enableClickSelection: !prev.suppressRowClickSelection,
        enableSelectionWithoutKeys: !!prev.rowMultiSelectWithClick,
        groupSelects: 'descendants',
        copySelectedRows: !prev.suppressCopyRowsToClipboard
      }
    }));
  }
}, []);

// In AG Grid component ensure rowSelection is always valid
<AgGridReact
  // Other props...
  rowSelection={validateRowSelectionType(gridSettings.rowSelection) ? 
    gridSettings.rowSelection : 
    {
      type: 'multiRow',
      enableClickSelection: !gridSettings.suppressRowClickSelection,
      enableSelectionWithoutKeys: !!gridSettings.rowMultiSelectWithClick,
      groupSelects: 'descendants',
      copySelectedRows: !gridSettings.suppressCopyRowsToClipboard
    }
  }
/>
```

### 2. Fixed Profile Settings to Dialog Communication

Fixed an issue where the General Settings dialog didn't reflect the current profile settings when the app was refreshed or a profile was loaded:

```typescript
// Pass gridSettings from DataTable to GeneralSettingsDialog
<GeneralSettingsDialog
  open={settingsOpen}
  onOpenChange={setSettingsOpen}
  onApplySettings={(settings) => handleApplySettings(settings, false)}
  currentSettings={gridSettings}
/>

// In GeneralSettingsDialog, initialize settings from props
useEffect(() => {
  if (currentSettings) {
    setSettings(currentSettings);
  }
}, [currentSettings]);

// Reset hasChanges and update settings when dialog opens
useEffect(() => {
  if (open && currentSettings) {
    setSettings(currentSettings);
    setHasChanges(false);
  }
}, [open, currentSettings]);
```

### 3. Improved Profile Loading

Fixed profile loading to properly update UI state when loading a profile:

```typescript
// In data-table.tsx, update gridSettings when a profile is loaded
(async () => {
  try {
    const profile = await loadProfileById(selectedProfileId, gridRef.current?.api);
    if (profile && profile.settings) {
      // Update the gridSettings state with the profile settings
      setGridSettings(profile.settings);
    }
  } catch (err) {
    // Error handling...
  }
})();

// Added a callback to ProfileManagerUI to update settings when a profile is loaded manually
<ProfileManagerUI 
  gridRef={gridRef} 
  gridSettings={gridSettings}
  onSettingsChange={setGridSettings}
/>

// In ProfileManagerUI.tsx
const handleLoadProfile = async (profileId: string) => {
  try {
    const profile = await loadProfileById(profileId, gridRef.current.api);
    if (profile?.settings && onSettingsChange) {
      onSettingsChange(profile.settings);
    }
  } catch (error) {
    // Error handling...
  }
};
```

### 4. Fixed Async Profile Loading

Updated the profile loading mechanism to use ES modules dynamic imports instead of CommonJS require:

```typescript
// In ProfileContext.tsx
const loadProfileById = async (profileId: string, gridApi?: any): Promise<GridProfile | null> => {
  const profile = profiles.find(p => p.id === profileId);
  if (profile && gridApi) {
    try {
      // Using import() instead of require()
      const GridStateUtils = await import('./GridStateUtils');
      
      const result = GridStateUtils.loadProfileInStages(
        gridApi,
        gridApi, // For AG-Grid 33+ compatibility
        profile.settings || {},
        profile.columnState || [],
        profile.filterModel || {},
        profile.sortModel || []
      );
      
      // Error handling...
    } catch (error) {
      // Error handling...
    }
  }
  return profile;
};
```

### 5. Fixed Dialog Accessibility Issues

Updated the DialogContent components to include proper DialogHeader and DialogTitle elements for screen reader accessibility:

```tsx
<DialogContent className="max-w-[900px] p-0 backdrop-blur-sm">
  <DialogHeader className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border-b dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Settings2 className="h-4 w-4 text-primary" />
        <DialogTitle className="text-[14px] font-semibold text-foreground">
          {currentSection?.label || 'Grid Settings'}
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
  
  {/* Dialog content... */}
</DialogContent>
```

### 6. Added Comprehensive Error Handling

Enhanced error handling for profile operations:

```typescript
// Better error formatting in loadProfileById
if (!result.success) {
  const errorMessage = result.error 
    ? (typeof result.error === 'object' ? JSON.stringify(result.error) : result.error.toString())
    : 'Unknown error loading profile';
  console.error(`Error loading profile at stage ${result.stage || 'unknown'}: ${errorMessage}`);
}

// Proper async/await error handling
try {
  const profile = await loadProfileById(selectedProfileId, gridRef.current?.api);
  // Success handling...
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error('Error loading profile:', errorMessage);
  toast.error('Error loading profile: ' + errorMessage);
}
```

### 7. Fixed Settings Merging When Saving Profiles

Ensured settings are properly merged when saving a profile:

```typescript
// Get the current profile to preserve any existing settings
const currentProfile = profiles.find(p => p.id === selectedProfileId);
if (!currentProfile) {
  toast.error('Selected profile not found');
  return;
}

// Merge current profile settings with new settings
const mergedSettings = {
  ...currentProfile.settings,  // Start with all existing settings
  ...gridSettings              // Override with any new settings
};

// Use the merged settings when updating the profile
updateCurrentProfile(
  mergedSettings,
  columnState,
  filterModel,
  sortModel
);
```

### 8. Added Retry Mechanism for Profile Loading

Added a retry mechanism to handle race conditions in profile loading:

```typescript
// Check if profile settings are already applied - if not, try again
const currentSettings = gridRef.current.api.getGridOption('domLayout');
const selectedProfile = profiles.find(p => p.id === selectedProfileId);

if (selectedProfile?.settings && 
    selectedProfile.settings.domLayout !== currentSettings) {
  
  // Try loading again with a small delay
  setTimeout(() => {
    (async () => {
      try {
        const profile = await loadProfileById(selectedProfileId, gridRef.current?.api);
        if (profile?.settings) {
          setGridSettings(profile.settings);
        }
      } catch (err) {
        // Error handling...
      }
    })();
  }, 100);
}
```

These improvements collectively make the application more robust, accessible, and better able to handle profile management across different scenarios.