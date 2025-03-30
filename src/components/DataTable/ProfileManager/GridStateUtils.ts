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
  columnApi: any | null; // Included for backward compatibility only
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
    // For backward compatibility, we'll return both but they point to the same object
    // This ensures code that still uses columnApi won't break
    
    // Log available methods for debugging
    const apiMethods = Object.keys(gridApi)
      .filter(key => typeof gridApi[key] === 'function')
      .slice(0, 10); // Just log a few methods
    
    console.log("AG-Grid 33+ API methods available:", apiMethods);
    
    // Verify that the API has the essential column-related methods
    // Note: getAllColumns might not be available, but getColumns is the AG-Grid 33+ equivalent
    const essentialMethods = ['getColumnState', 'applyColumnState', 'getColumn'];
    const missingEssential = essentialMethods.filter(method => typeof gridApi[method] !== 'function');
    
    if (missingEssential.length > 0) {
      console.warn("Missing essential AG-Grid 33+ column methods:", missingEssential);
    } else {
      console.log("All essential AG-Grid 33+ column methods are available");
    }
    
    // Check for the possible presence of either getAllColumns or getColumns
    if (typeof gridApi.getAllColumns !== 'function' && typeof gridApi.getColumns !== 'function') {
      console.log("Note: Neither getAllColumns nor getColumns methods are available");
    }
    
    return { 
      gridApi, 
      columnApi: gridApi, // In AG-Grid 33+, columnApi and gridApi are the same object
      isReady: true 
    };
  } catch (error) {
    console.error("Error accessing grid API:", error);
    return { gridApi: null, columnApi: null, isReady: false };
  }
}

/**
 * Safely get column state for AG-Grid 33+
 * 
 * In AG-Grid 33+, the columnApi methods have been merged into the main gridApi.
 * Always use gridApi for accessing column state in AG-Grid 33+.
 */
export function getColumnState(columnApi: any, gridApi: GridApi | null): any[] {
  try {
    // AG-Grid 33+: Use direct method on gridApi
    if (gridApi && typeof gridApi.getColumnState === 'function') {
      console.log("Using gridApi.getColumnState (AG-Grid 33+)");
      return gridApi.getColumnState();
    }
    
    // Fallback to columnApi (pre-AG-Grid 33+)
    if (columnApi && typeof columnApi.getColumnState === 'function') {
      console.log("Using columnApi.getColumnState (pre-AG-Grid 33+)");
      return columnApi.getColumnState();
    }
    
    // If the method is missing or API is not available
    console.warn("Cannot get column state - grid API or method not available");
    console.info("Make sure you're using AG-Grid 33+ and passing the gridApi parameter");
    
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
 */
export function applyColumnState(gridApi: GridApi | null, columnState: any[]): boolean {
  try {
    if (!columnState || columnState.length === 0) {
      console.warn("Cannot apply column state - state is empty");
      return false;
    }
    
    if (!gridApi) {
      console.warn("Cannot apply column state - grid API not available");
      return false;
    }
    
    // AG-Grid 33+: Use direct method on gridApi
    if (typeof gridApi.applyColumnState === 'function') {
      console.log("Applying column state using AG-Grid 33+ API");
      gridApi.applyColumnState({
        state: columnState,
        applyOrder: true
      });
      return true;
    }
    
    console.warn("Cannot apply column state - applyColumnState method not available on gridApi");
    console.info("Make sure you're using AG-Grid 33+ with the latest API");
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
    
    // Validate filter model before applying
    // Filter models with numeric keys (like "0", "1", "2") will cause errors in AG-Grid 33+
    // because they expect column IDs, not numeric indexes
    const isValidFilterModel = typeof filterModel === 'object' && 
                             !Array.isArray(filterModel) &&
                             Object.keys(filterModel).every(key => {
                               // Check if key is a numeric-like string
                               const isNumericKey = /^\d+$/.test(key);
                               if (isNumericKey) {
                                 console.warn(`Invalid filter model key: "${key}" appears to be numeric. AG-Grid expects column IDs.`);
                               }
                               return !isNumericKey;
                             });
    
    if (!isValidFilterModel) {
      console.warn("Filter model contains invalid keys. Skipping application to avoid errors.");
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
 * Apply grid settings safely to the grid using AG-Grid 33+ API
 * Prioritizes what settings to apply based on whether we want to preserve column widths
 */
export function applyGridSettings(
  gridApi: GridApi | null, 
  settings: GridSettings,
  preserveColumnWidths: boolean = false
): { success: boolean; error?: any } {
  if (!gridApi) {
    console.warn("Cannot apply settings - Grid API not available");
    return { success: false, error: "Grid API not available" };
  }

  try {
    console.log("Applying grid settings:", { preserveColumnWidths });

    // Get current grid options before applying new ones
    // This ensures we don't lose settings that aren't explicitly provided
    const currentOptions: Record<string, any> = {};
    
    // List of options we want to preserve if not explicitly overridden
    const optionsToPreserve = [
      'headerHeight', 'rowHeight', 'domLayout', 'pagination', 
      'paginationPageSize', 'animateRows', 'enableCellTextSelection',
      'tooltipShowDelay', 'tooltipHideDelay', 'groupDefaultExpanded',
      'groupDisplayType', 'showOpenedGroup', 'rowGroupPanelShow',
      'suppressDragLeaveHidesColumns', 'multiSortKey', 'accentedSort',
      'suppressCsvExport', 'suppressExcelExport', 'autoSizePadding',
      'maintainColumnOrder', 'enableCharts'
    ];
    
    // Get current values of options we want to preserve
    optionsToPreserve.forEach(key => {
      try {
        currentOptions[key] = gridApi.getGridOption(key);
      } catch (err) {
        // Ignore errors for options that might not exist
      }
    });
    
    console.log('Current grid options (before applying):', currentOptions);

    // First, prioritize settings that are safe to apply (won't affect column layout)
    const safeSettings = [
      'headerHeight', 'rowHeight', 
      'pagination', 'paginationPageSize', 
      'animateRows', 'enableCellTextSelection',
      'tooltipShowDelay', 'tooltipHideDelay',
      'suppressRowHoverHighlight', 'suppressScrollOnNewData',
      'alwaysShowVerticalScroll', 'suppressColumnMoveAnimation',
      'suppressMenuHide', 'quickFilterText',
      'suppressContextMenu', 'tooltipShowDelay', 'tooltipHideDelay',
      'groupDefaultExpanded', 'groupDisplayType', 'showOpenedGroup',
      'rowGroupPanelShow', 'suppressDragLeaveHidesColumns', 
      'multiSortKey', 'accentedSort',
      'suppressCsvExport', 'suppressExcelExport',
      'autoSizePadding', 'maintainColumnOrder', 'enableCharts',
      'excludeChildrenWhenTreeDataFiltering'
    ];

    // Apply safe settings first using gridApi.setGridOption
    safeSettings.forEach(key => {
      // Only apply settings that are explicitly provided
      if (settings[key] !== undefined) {
        try {
          // Use AG-Grid 33+ setGridOption method
          console.log(`Applying setting: ${key} = ${settings[key]}`);
          gridApi.setGridOption(key, settings[key]);
        } catch (err) {
          console.warn(`Failed to apply safe setting ${key}:`, err);
        }
      } else if (currentOptions[key] !== undefined) {
        // If setting is not provided but we have a current value, preserve it
        console.log(`Preserving current setting: ${key} = ${currentOptions[key]}`);
      }
    });

    // Apply cell flash settings
    try {
      gridApi.setGridOption('cellFlashDuration', 
        settings.cellFlashDuration !== undefined ? 
        settings.cellFlashDuration : 
        (settings.enableCellChangeFlash ? 1000 : 0)
      );
      
      gridApi.setGridOption('cellFadeDuration', 
        settings.cellFadeDuration !== undefined ? 
        settings.cellFadeDuration : 
        (settings.enableCellChangeFlash ? 500 : 0)
      );
    } catch (err) {
      console.warn('Failed to apply cell flash settings:', err);
    }

    // Apply row grouping settings
    try {
      gridApi.setGridOption('groupTotalRow', 
        settings.groupTotalRow !== undefined ? 
        settings.groupTotalRow : 
        settings.groupIncludeFooter
      );
      
      gridApi.setGridOption('grandTotalRow', 
        settings.grandTotalRow !== undefined ? 
        settings.grandTotalRow : 
        settings.groupIncludeTotalFooter
      );
    } catch (err) {
      console.warn('Failed to apply row grouping settings:', err);
    }

    // Apply navigation settings
    try {
      gridApi.setGridOption('enterNavigatesVertically', 
        settings.enterNavigatesVertically !== undefined ? 
        settings.enterNavigatesVertically : 
        settings.enterMovesDown
      );
      
      gridApi.setGridOption('enterNavigatesVerticallyAfterEdit', 
        settings.enterNavigatesVerticallyAfterEdit !== undefined ? 
        settings.enterNavigatesVerticallyAfterEdit : 
        settings.enterMovesDownAfterEdit
      );
    } catch (err) {
      console.warn('Failed to apply navigation settings:', err);
    }

    // Apply cell focus settings
    try {
      gridApi.setGridOption('suppressCellFocus', 
        settings.suppressCellFocus !== undefined ? 
        settings.suppressCellFocus : 
        settings.suppressCellSelection
      );
    } catch (err) {
      console.warn('Failed to apply cell focus settings:', err);
    }

    // Apply row selection settings - this is complex so wrap in try/catch
    try {
      // Create the rowSelection object format
      const rowSelection = {
        // Ensure the type is always either 'singleRow' or 'multiRow'
        type: (settings.rowSelection?.type === 'singleRow' || settings.rowSelection?.type === 'multiRow') 
          ? settings.rowSelection.type 
          : 'multiRow',
        enableClickSelection: settings.rowSelection?.enableClickSelection !== undefined 
          ? settings.rowSelection.enableClickSelection 
          : !settings.suppressRowClickSelection,
        enableSelectionWithoutKeys: settings.rowSelection?.enableSelectionWithoutKeys !== undefined
          ? settings.rowSelection.enableSelectionWithoutKeys
          : !!settings.rowMultiSelectWithClick,
        groupSelects: settings.rowSelection?.groupSelects || 'descendants',
        copySelectedRows: settings.rowSelection?.copySelectedRows !== undefined
          ? settings.rowSelection.copySelectedRows
          : !settings.suppressCopyRowsToClipboard
      };
      
      console.log('Applying rowSelection:', rowSelection);
      gridApi.setGridOption('rowSelection', rowSelection);
    } catch (err) {
      console.warn('Failed to apply row selection settings:', err);
    }

    // If not preserving column widths, apply column-related settings
    if (!preserveColumnWidths) {
      // Apply default column definition
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
          // AG-Grid 33+: Move sortingOrder to defaultColDef
          sortingOrder: settings.defaultColSortingOrder || settings.sortingOrder || ['asc', 'desc', null],
          // AG-Grid 33+: Move unSortIcon to defaultColDef
          unSortIcon: settings.defaultColUnSortIcon || settings.unSortIcon || false,
          // In AG-Grid 33+, enableRowGroup should only be used at column level, not grid level
          enableRowGroup: settings.enableRowGroup,
          // Other column properties if needed
          autoHeight: settings.defaultColAutoHeight,
          wrapText: settings.defaultColWrapText,
          cellStyle: settings.defaultColCellStyle,
        };
        
        // Use AG-Grid 33+ setGridOption for defaultColDef
        console.log('Applying defaultColDef:', defaultColDef);
        gridApi.setGridOption('defaultColDef', defaultColDef);
      } catch (error) {
        console.warn("Error applying defaultColDef:", error);
      }
    }

    // Set floating filter height
    if (settings.floatingFilter !== undefined) {
      try {
        gridApi.setGridOption('floatingFiltersHeight', settings.floatingFilter ? 35 : 0);
      } catch (error) {
        console.warn("Error setting floating filter height:", error);
      }
    }

    // Refresh the grid UI using AG-Grid 33+ methods
    try {
      // Refresh header components
      if (typeof gridApi.refreshHeader === 'function') {
        gridApi.refreshHeader();
      }
      
      // Refresh cells
      if (typeof gridApi.refreshCells === 'function') {
        gridApi.refreshCells({ force: true });
      } else if (typeof gridApi.redrawRows === 'function') {
        gridApi.redrawRows();
      }
    } catch (error) {
      console.warn("Error refreshing grid UI:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error applying grid settings:", error);
    return { success: false, error };
  }
}

/**
 * Apply a grid profile in stages to handle both AG-Grid 33+ and older versions.
 * Returns detailed result information including success/failure and stage.
 */
export const loadProfileInStages = (
  gridApi: any,
  columnApi: any, // For backward compatibility with AG-Grid < 33
  settings: GridSettings | undefined,
  columnState: any[] = [],
  filterModel: any = {},
  sortModel: any[] = []
): { success: boolean; error?: any; stage?: string } => {
  if (!gridApi) {
    console.error('Grid API not available for loading profile');
    return { success: false, error: 'Grid API not available', stage: 'initialization' };
  }

  console.log('Loading profile in stages...', {
    hasSettings: !!settings,
    settingsCount: settings ? Object.keys(settings).length : 0,
    columnStateCount: columnState?.length || 0,
    hasFilterModel: !!filterModel && Object.keys(filterModel || {}).length > 0,
    sortModelCount: sortModel?.length || 0
  });

  try {
    // Stage 1: Apply grid settings first
    if (settings && Object.keys(settings).length > 0) {
      console.log('Stage 1: Applying grid settings', { 
        settingsCount: Object.keys(settings).length,
        keySample: Object.keys(settings).slice(0, 5)
      });
      
      // Validate settings object to make sure it's a valid object
      if (typeof settings !== 'object') {
        console.error('Settings is not a valid object:', settings);
        return { success: false, error: 'Invalid settings format', stage: 'settings' };
      }
      
      try {
        const result = applyGridSettings(gridApi, settings, false);
        if (!result.success) {
          console.error('Failed to apply grid settings:', result.error || 'Unknown error');
          return { success: false, error: result.error || 'Unknown error applying settings', stage: 'settings' };
        }
      } catch (error) {
        console.error('Exception when applying grid settings:', error);
        return { success: false, error: error || 'Exception applying settings', stage: 'settings' };
      }
    } else {
      console.log('No grid settings to apply');
    }

    // Stage 2: Apply column state (may include column visibility, order, width, etc.)
    if (columnState && columnState.length > 0) {
      console.log('Stage 2: Applying column state', { 
        columnCount: columnState.length,
        sampleColumn: columnState[0]
      });
      
      try {
        // In AG-Grid 33+, use gridApi for applyColumnState
        if (gridApi.applyColumnState) {
          gridApi.applyColumnState({
            state: columnState,
            applyOrder: true  // Ensure column order is applied
          });
        } 
        // Backward compatibility with older AG-Grid versions
        else if (columnApi && columnApi.applyColumnState) {
          columnApi.applyColumnState({
            state: columnState,
            applyOrder: true
          });
        } else {
          console.warn('No method found to apply column state');
        }
      } catch (columnError) {
        console.error('Error applying column state:', columnError);
        return { success: false, error: columnError, stage: 'columnState' };
      }
    } else {
      console.log('No column state to apply');
    }

    // Stage 3: Apply filter model
    if (filterModel && Object.keys(filterModel).length > 0) {
      console.log('Stage 3: Applying filter model', { 
        filterCount: Object.keys(filterModel).length,
        filters: Object.keys(filterModel)
      });
      
      try {
        if (gridApi.setFilterModel) {
          gridApi.setFilterModel(filterModel);
        } else {
          console.warn('setFilterModel not available on gridApi');
        }
      } catch (filterError) {
        console.error('Error applying filter model:', filterError);
        // Continue anyway, as filter errors aren't critical
      }
    } else {
      console.log('No filter model to apply');
    }

    // Stage 4: Apply sort model
    if (sortModel && sortModel.length > 0) {
      console.log('Stage 4: Applying sort model', { 
        sortCount: sortModel.length,
        sortModel
      });
      
      try {
        // There are multiple ways to apply sort model depending on AG-Grid version
        if (gridApi.setSortModel) {
          // AG-Grid 33+ approach
          gridApi.setSortModel(sortModel);
        } else if (columnApi && columnApi.applyColumnState) {
          // Older AG-Grid approach
          // Convert sort model to column state format
          const sortColumnState = sortModel.map(item => ({
            colId: item.colId,
            sort: item.sort,
            sortIndex: item.sortIndex
          }));
          
          columnApi.applyColumnState({
            state: sortColumnState,
            defaultState: { sort: null }
          });
        } else {
          console.warn('No method found to apply sort model');
        }
      } catch (sortError) {
        console.error('Error applying sort model:', sortError);
        // Continue anyway, as sort errors aren't critical
      }
    } else {
      console.log('No sort model to apply');
    }

    // Stage 5: Final grid refresh
    console.log('Stage 5: Performing final grid refresh');
    try {
      if (gridApi.refreshCells) {
        gridApi.refreshCells({ force: true });
      }
      if (gridApi.refreshHeader) {
        gridApi.refreshHeader();
      }
    } catch (refreshError) {
      console.warn('Error during final refresh:', refreshError);
      // Continue anyway, as refresh errors aren't critical
    }

    console.log('Profile loading completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error loading profile:', error);
    return { success: false, error, stage: 'unknown' };
  }
};