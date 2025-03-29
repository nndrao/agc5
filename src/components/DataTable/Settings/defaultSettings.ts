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
  suppressCellSelection: false,
  suppressRowClickSelection: false,
  suppressScrollOnNewData: false,
  suppressColumnVirtualisation: false,
  suppressRowVirtualisation: false,
  domLayout: 'normal',
  ensureDomOrder: false,
  alwaysShowVerticalScroll: false,
  suppressBrowserResizeObserver: false,
  enableRtl: false,
  suppressColumnMoveAnimation: false,

  // Data and State
  pagination: true,
  paginationPageSize: 100,
  cacheBlockSize: 100,
  enableRangeSelection: true,
  enableRangeHandle: true,
  enableFillHandle: true,
  suppressRowDrag: false,
  suppressMovableColumns: false,
  immutableData: false,
  deltaRowDataMode: false,
  rowBuffer: 10,
  rowDragManaged: false,
  batchUpdateWaitMillis: 50,

  // Selection
  rowSelection: 'multiple',
  rowMultiSelectWithClick: false,
  rowDeselection: true,
  suppressRowDeselection: false,
  groupSelectsChildren: true,
  groupSelectsFiltered: true,

  // Editing
  editType: 'doubleClick',
  singleClickEdit: false,
  suppressClickEdit: false,
  enterMovesDown: true,
  enterMovesDownAfterEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 10,
  stopEditingWhenCellsLoseFocus: true,
  enterNavigatesVertically: true,
  tabNavigatesVertically: false,

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
  enableCellChangeFlash: true,
  tooltipShowDelay: 1000,
  tooltipHideDelay: 10000,

  // Row Grouping
  groupDefaultExpanded: 0,
  groupDisplayType: 'groupRows',
  groupIncludeFooter: false,
  groupIncludeTotalFooter: false,
  showOpenedGroup: true,
  rowGroupPanelShow: 'always',
  enableRowGroup: true,
  suppressDragLeaveHidesColumns: false,

  // Sorting
  sortingOrder: ['asc', 'desc', null],
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
  suppressAriaColCount: false,
  suppressAriaRowCount: false,
  
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
}; 