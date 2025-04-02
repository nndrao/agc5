import type { GridSettings } from "./types";

// Default settings matching those in the GeneralSettingsDialog
export const defaultGridSettings: GridSettings = {
  // Display and Layout
  rowHeight: 48,
  headerHeight: 45,
  pivotHeaderHeight: 32,
  pivotGroupHeaderHeight: 32,
  floatingFiltersHeight: 32,
  suppressRowHoverHighlight: false,
  // Using valid property instead of suppressCellSelection
  suppressCellFocus: false,
  suppressRowClickSelection: false,
  suppressScrollOnNewData: false,
  suppressColumnVirtualisation: false,
  suppressRowVirtualisation: false,
  domLayout: 'normal',
  ensureDomOrder: false,
  alwaysShowVerticalScroll: false,
  // suppressBrowserResizeObserver is deprecated and has no effect
  enableRtl: false,
  suppressColumnMoveAnimation: false,

  // Data and State
  pagination: true,
  paginationPageSize: 100,
  // cacheBlockSize: 100, // Not applicable in clientSide row model
  // Use the new cellSelection property instead of deprecated range properties
  cellSelection: {
    handle: 'fill' // Enable both range and fill handles
  },
  // Keep deprecated properties for backward compatibility
  enableRangeSelection: true,
  enableRangeHandle: true,
  enableFillHandle: true,
  suppressRowDrag: false,
  suppressMovableColumns: false,
  // Using modern data update approach instead of immutableData/deltaRowDataMode
  resetRowDataOnUpdate: true,
  rowBuffer: 10,
  rowDragManaged: false,
  // Use valid asyncTransactionWaitMillis instead of batchUpdateWaitMillis
  asyncTransactionWaitMillis: 50,

  // Selection - use object format with type as required in AG-Grid 33+
  rowSelection: {
    type: 'multiRow',
    enableSelectionWithoutKeys: false, // Replaces rowMultiSelectWithClick
    enableClickSelection: true,        // !suppressRowClickSelection
    groupSelects: 'filteredDescendants', // Choose one of: 'children', 'descendants', 'filteredDescendants'
    copySelectedRows: true              // !suppressCopyRowsToClipboard
  },
  
  // Legacy property for backward compatibility with old API calls
  // This is better handled through rowSelection.enableSelectionWithoutKeys
  rowMultiSelectWithClick: false,

  // Editing
  editType: 'doubleClick',
  singleClickEdit: false,
  suppressClickEdit: false,
  // Using valid properties in AG-Grid 33+
  enterNavigatesVertically: true,
  enterNavigatesVerticallyAfterEdit: true,
  // Keep deprecated properties for backward compatibility
  enterMovesDown: true,
  enterMovesDownAfterEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 10,
  stopEditingWhenCellsLoseFocus: true,
  // tabNavigatesVertically is not valid in AG-Grid 33+

  // Filtering
  floatingFilter: false,
  suppressMenuHide: false,
  quickFilterText: '',
  cacheQuickFilter: true,

  // Appearance
  theme: 'ag-theme-quartz',
  animateRows: true,
  enableBrowserTooltips: false,
  suppressContextMenu: false,
  suppressCopyRowsToClipboard: false,
  suppressCopySingleCellRanges: false,
  clipboardDelimiter: '\t',
  enableCellTextSelection: true,
  // Using valid cell flashing properties instead of enableCellChangeFlash
  cellFlashDuration: 1000, // milliseconds
  cellFadeDuration: 500, // milliseconds
  // Keep deprecated property for backward compatibility
  enableCellChangeFlash: true,
  tooltipShowDelay: 1000,
  tooltipHideDelay: 10000,

  // Row Grouping
  groupDefaultExpanded: 0,
  groupDisplayType: 'groupRows',
  // Replace invalid properties with valid ones
  groupTotalRow: false, // Instead of groupIncludeFooter
  grandTotalRow: false, // Instead of groupIncludeTotalFooter
  // Keep deprecated properties for backward compatibility
  groupIncludeFooter: false,
  groupIncludeTotalFooter: false,
  showOpenedGroup: true,
  rowGroupPanelShow: 'always',
  // enableRowGroup is not valid at the grid level (it should be in colDef)
  enableRowGroup: true,
  suppressDragLeaveHidesColumns: false,

  // Sorting - with proper typing 
  sortingOrder: ['asc', 'desc', null] as Array<'asc' | 'desc' | null>, // Kept for backward compatibility
  multiSortKey: 'ctrl',
  accentedSort: false,
  unSortIcon: false,

  // Advanced Filtering
  excludeChildrenWhenTreeDataFiltering: false,
  
  // Export/Import
  suppressCsvExport: false,
  suppressExcelExport: false,
  
  // Column Controls
  autoSizePadding: 20,
  colResizeDefault: 'shift',
  maintainColumnOrder: true,
  
  // Advanced
  enableCharts: false,
  // Removed invalid properties:
  // suppressAriaColCount: false,
  // suppressAriaRowCount: false,
  
  // Default Column Definition
  defaultColEditable: true,
  defaultColResizable: true,
  defaultColSortable: true,
  defaultColFilter: true,
  defaultColFilterParams: {},
  defaultColFlex: 1,
  defaultColMinWidth: 100,
  defaultColMaxWidth: null,
  defaultColAutoHeight: false,
  defaultColWrapText: false,
  defaultColCellStyle: {},
  // Add sortingOrder to defaultColDef (moved from grid-level)
  defaultColSortingOrder: ['asc', 'desc', null] as Array<'asc' | 'desc' | null>,
  // Add unSortIcon to defaultColDef (moved from grid-level)
  defaultColUnSortIcon: false,
}; 