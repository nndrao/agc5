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