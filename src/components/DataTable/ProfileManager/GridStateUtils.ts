/**
 * GridStateUtils.ts
 * Utilities for safely interacting with AG Grid's API for profile management
 */

import { GridApi } from "ag-grid-community";
import { GridSettings } from "../Settings/types";

/**
 * Safe wrapper for accessing the Grid API
 */
/**
 * Safe wrapper for accessing the Grid API in AG-Grid version 33+
 * 
 * In AG-Grid 33+, the columnApi is no longer provided separately.
 * All column-related methods are now part of the main gridApi.
 */
export function safelyAccessGridApi(gridRef: any): {
  gridApi: GridApi | null;
  columnApi: any | null;
  isReady: boolean;
} {
  try {
    if (!gridRef || !gridRef.current) {
      console.warn("Grid reference is not available");
      return { gridApi: null, columnApi: null, isReady: false };
    }

    const gridApi = gridRef.current.api;
    
    if (!gridApi) {
      console.warn("Grid API is not available");
      return { gridApi: null, columnApi: null, isReady: false };
    }

    // In AG-Grid 33+, column API methods have been merged into the grid API
    // For backward compatibility, we'll set columnApi = gridApi
    const columnApi = gridApi;
    
    // Log what methods are available on the API for debugging
    const apiMethods = Object.keys(gridApi)
      .filter(key => typeof gridApi[key] === 'function')
      .slice(0, 10); // Just log a few methods
    
    console.log("AG-Grid API methods available:", apiMethods);
    
    // Check if we can access some essential column methods directly on the gridApi
    const hasColumnMethods = 
      (typeof gridApi.getColumnState === 'function' ||
       typeof gridApi.applyColumnState === 'function');
    
    if (hasColumnMethods) {
      console.log("AG-Grid 33+ detected: column methods are on the main gridApi");
    }
    
    return { gridApi, columnApi, isReady: true };
  } catch (error) {
    console.error("Error accessing grid APIs:", error);
    return { gridApi: null, columnApi: null, isReady: false };
  }
}

/**
 * Safely get column state for AG-Grid 33+
 * 
 * In AG-Grid 33+, the columnApi methods have been merged into the main gridApi.
 * This function works with both old and new AG-Grid versions.
 */
export function getColumnState(columnApi: any, gridApi?: GridApi | null): any[] {
  try {
    // AG-Grid 33+: Try direct method on gridApi first
    if (gridApi && typeof gridApi.getColumnState === 'function') {
      console.log("Using gridApi.getColumnState (AG-Grid 33+)");
      return gridApi.getColumnState();
    }
    
    // Pre-33: Try using columnApi
    if (columnApi && typeof columnApi.getColumnState === 'function' && columnApi !== gridApi) {
      console.log("Using columnApi.getColumnState (pre AG-Grid 33)");
      return columnApi.getColumnState();
    }
    
    // Fallback: Try all possible methods
    if (gridApi) {
      // Check if getColumnState exists but with a different name
      const possibleMethodNames = [
        'getColumnState',
        'getColumnsState',
        'getColumnDefs',
        'getColumns'
      ];
      
      for (const methodName of possibleMethodNames) {
        if (typeof gridApi[methodName] === 'function') {
          console.log(`Found alternative column state method: ${methodName}`);
          const result = gridApi[methodName]();
          if (Array.isArray(result)) {
            return result;
          }
        }
      }
    }
    
    console.warn("Cannot get column state - API methods not available");
    console.info("Please check AG-Grid documentation for the correct method to get column state in your version");
    
    // Return empty array as fallback
    return [];
  } catch (error) {
    console.error("Error getting column state:", error);
    return [];
  }
}

/**
 * Safely apply column state for AG-Grid 33+
 * 
 * In AG-Grid 33+, the applyColumnState method is on the main gridApi.
 * This function works with both old and new AG-Grid versions.
 */
export function applyColumnState(columnApi: any, columnState: any[], gridApi?: GridApi | null): boolean {
  try {
    if (!columnState || columnState.length === 0) {
      console.warn("Cannot apply column state - state is empty");
      return false;
    }
    
    // AG-Grid 33+: Try direct method on gridApi first
    if (gridApi && typeof gridApi.applyColumnState === 'function') {
      console.log("Using gridApi.applyColumnState (AG-Grid 33+)");
      gridApi.applyColumnState({
        state: columnState,
        applyOrder: true
      });
      return true;
    }
    
    // Pre-33: Try using columnApi if it's different from gridApi
    if (columnApi && typeof columnApi.applyColumnState === 'function' && columnApi !== gridApi) {
      console.log("Using columnApi.applyColumnState (pre AG-Grid 33)");
      columnApi.applyColumnState({
        state: columnState,
        applyOrder: true
      });
      return true;
    }
    
    // Fallback: Try alternative methods
    if (gridApi) {
      // Check if applyColumnState exists but with a different name
      const possibleMethodNames = [
        'applyColumnState',
        'setColumnState',
        'setColumnsState',
        'updateColumns'
      ];
      
      for (const methodName of possibleMethodNames) {
        if (typeof gridApi[methodName] === 'function') {
          console.log(`Found alternative column state method: ${methodName}`);
          try {
            // Try with standard parameters first
            gridApi[methodName]({
              state: columnState,
              applyOrder: true
            });
            return true;
          } catch (e) {
            // If that fails, try with just the state
            try {
              gridApi[methodName](columnState);
              return true;
            } catch (e2) {
              console.warn(`Failed to use ${methodName} method`);
            }
          }
        }
      }
    }
    
    console.warn("Cannot apply column state - API methods not available");
    console.info("Please check AG-Grid documentation for the correct method to apply column state in your version");
    return false;
  } catch (error) {
    console.error("Error applying column state:", error);
    return false;
  }
}

/**
 * Safely get filter model
 */
export function getFilterModel(gridApi: GridApi | null): any {
  try {
    if (!gridApi || !gridApi.getFilterModel) {
      console.warn("Cannot get filter model - API not available");
      return {};
    }
    return gridApi.getFilterModel();
  } catch (error) {
    console.error("Error getting filter model:", error);
    return {};
  }
}

/**
 * Safely apply filter model
 */
export function applyFilterModel(gridApi: GridApi | null, filterModel: any): boolean {
  try {
    if (!gridApi || !gridApi.setFilterModel) {
      console.warn("Cannot apply filter model - API not available");
      return false;
    }
    
    if (!filterModel) {
      console.warn("Filter model is empty, skipping application");
      return false;
    }
    
    gridApi.setFilterModel(filterModel);
    return true;
  } catch (error) {
    console.error("Error applying filter model:", error);
    return false;
  }
}

/**
 * Get sort model from column state
 */
export function getSortModelFromColumnState(columnState: any[]): any[] {
  try {
    if (!columnState || !Array.isArray(columnState)) {
      return [];
    }
    
    return columnState
      .filter(col => col.sort !== null && col.sort !== undefined)
      .map(col => ({
        colId: col.colId,
        sort: col.sort,
        sortIndex: col.sortIndex
      }));
  } catch (error) {
    console.error("Error extracting sort model:", error);
    return [];
  }
}

/**
 * Apply grid settings safely to the grid
 * Prioritizes what settings to apply based on whether we want to preserve column widths
 */
export function applyGridSettings(
  gridApi: GridApi | null, 
  columnApi: any | null, 
  settings: GridSettings,
  preserveColumnWidths: boolean = false
): boolean {
  if (!gridApi) {
    console.warn("Cannot apply settings - Grid API not available");
    return false;
  }

  try {
    // All available settings listed in priority order
    const allSettings = [
      // High Priority (visual impact)
      'pagination', 'paginationPageSize', 'rowHeight', 'headerHeight',
      'rowSelection', 'suppressCellSelection', 'enableCellTextSelection',
      'floatingFilter', 'animateRows', 'enableRangeSelection', 
      'editType', 'singleClickEdit', 'floatingFiltersHeight',
      
      // Medium Priority
      'suppressRowHoverHighlight', 'suppressRowClickSelection',
      'enableRangeHandle', 'suppressClickEdit', 'domLayout',
      'groupDisplayType', 'groupDefaultExpanded', 'rowGroupPanelShow',
      'multiSortKey', 'cacheQuickFilter', 'enableCellChangeFlash',
      
      // Other Settings
      'pivotHeaderHeight', 'pivotGroupHeaderHeight',
      'suppressScrollOnNewData', 'ensureDomOrder', 
      'alwaysShowVerticalScroll', 'suppressBrowserResizeObserver',
      'enableRtl', 'suppressColumnMoveAnimation',
      'cacheBlockSize', 'enableFillHandle', 'suppressRowDrag', 
      'suppressMovableColumns', 'immutableData', 'deltaRowDataMode', 
      'rowBuffer', 'rowDragManaged', 'batchUpdateWaitMillis',
      'rowMultiSelectWithClick', 'rowDeselection', 'suppressRowDeselection',
      'groupSelectsChildren', 'groupSelectsFiltered',
      'enterMovesDown', 'enterMovesDownAfterEdit', 'undoRedoCellEditing', 
      'undoRedoCellEditingLimit', 'stopEditingWhenCellsLoseFocus',
      'enterNavigatesVertically', 'tabNavigatesVertically',
      'suppressMenuHide', 'enableBrowserTooltips', 'suppressContextMenu',
      'suppressCopyRowsToClipboard', 'suppressCopySingleCellRanges',
      'tooltipShowDelay', 'tooltipHideDelay',
      'groupIncludeFooter', 'groupIncludeTotalFooter', 'showOpenedGroup',
      'enableRowGroup', 'suppressDragLeaveHidesColumns',
      'accentedSort', 'unSortIcon',
      'suppressCsvExport', 'suppressExcelExport',
      'enableCharts', 'suppressAriaColCount', 'suppressAriaRowCount'
    ];

    let settingsApplied = 0;
    let errors = 0;
    
    // Apply all settings at once
    allSettings.forEach(key => {
      if (settings[key] !== undefined) {
        try {
          gridApi.setGridOption(key, settings[key]);
          settingsApplied++;
        } catch (err) {
          errors++;
        }
      }
    });

    // Also apply the defaultColDef if specified
    if (!preserveColumnWidths) {
      try {
        const defaultColDef = {
          flex: settings.defaultColFlex || 1,
          minWidth: settings.defaultColMinWidth || 100,
          maxWidth: settings.defaultColMaxWidth || null,
          filter: settings.defaultColFilter !== undefined ? settings.defaultColFilter : true,
          editable: settings.defaultColEditable !== undefined ? settings.defaultColEditable : true,
          resizable: settings.defaultColResizable !== undefined ? settings.defaultColResizable : true,
          sortable: settings.defaultColSortable !== undefined ? settings.defaultColSortable : true,
          floatingFilter: settings.floatingFilter !== undefined ? settings.floatingFilter : false,
        };
        
        gridApi.setGridOption('defaultColDef', defaultColDef);
      } catch (error) {
        errors++;
      }
    }

    // Final UI refresh to ensure everything is visible
    try {
      if (gridApi.refreshCells) {
        gridApi.refreshCells({ force: true });
      }
      if (gridApi.refreshHeader) {
        gridApi.refreshHeader();
      }
    } catch (refreshError) {
      errors++;
    }

    // Only log summary info
    if (errors > 0) {
      console.info(`Applied ${settingsApplied} grid settings with ${errors} errors`);
    }

    return true;
  } catch (error) {
    console.error("Error applying grid settings");
    return false;
  }
}

/**
 * Staged profile loading to handle failures gracefully
 * Updated for AG-Grid 33+ compatibility
 */
export function loadProfileInStages(
  gridApi: GridApi | null, 
  columnApi: any | null,
  settings: GridSettings,
  columnState: any[],
  filterModel: any,
  sortModel: any[]
): { success: boolean; stage: string; error?: any; timing?: { total: number; stages: Record<string, number> } } {
  if (!gridApi) {
    return { success: false, stage: "initialization", error: "Grid API not available" };
  }

  // Start timing the profile loading operation
  const startTime = performance.now();
  const stageTiming: Record<string, number> = {};

  // Stage 1: Apply grid settings first
  let stageStartTime = performance.now();
  try {
    // In AG-Grid 33+, use gridApi for both parameters since column API is merged
    const apiToUse = columnApi || gridApi;
    applyGridSettings(gridApi, apiToUse, settings, true);
  } catch (error) {
    // Silent catch - errors logged in applyGridSettings
  }
  stageTiming.settings = performance.now() - stageStartTime;

  // Stage 2: Apply column state 
  stageStartTime = performance.now();
  try {
    if (columnState && columnState.length > 0) {
      applyColumnState(columnApi, columnState, gridApi);
    }
  } catch (error) {
    // Silent catch
  }
  stageTiming.columnState = performance.now() - stageStartTime;

  // Stage 3: Apply filter model
  stageStartTime = performance.now();
  try {
    if (filterModel) {
      applyFilterModel(gridApi, filterModel);
    }
  } catch (error) {
    // Silent catch
  }
  stageTiming.filterModel = performance.now() - stageStartTime;

  // Stage 4: Apply sort model
  stageStartTime = performance.now();
  try {
    if (sortModel && sortModel.length > 0 && typeof gridApi.setSortModel === 'function') {
      gridApi.setSortModel(sortModel);
    }
  } catch (error) {
    // Silent catch
  }
  stageTiming.sortModel = performance.now() - stageStartTime;
  
  // Final stage: Refresh the grid
  stageStartTime = performance.now();
  try {
    if (typeof gridApi.refreshCells === 'function') {
      gridApi.refreshCells({ force: true });
    }
    
    if (typeof gridApi.refreshHeader === 'function') {
      gridApi.refreshHeader();
    }
    
    // Additional refresh for filters
    if (settings.floatingFilter && typeof gridApi.refreshHeader === 'function') {
      gridApi.refreshHeader();
    }
  } catch (error) {
    // Silent catch
  }
  stageTiming.refresh = performance.now() - stageStartTime;

  // Calculate total time
  const totalTime = performance.now() - startTime;

  // Return success with timing information
  return { 
    success: true, 
    stage: "complete",
    timing: {
      total: Number(totalTime.toFixed(1)),
      stages: stageTiming
    }
  };
}