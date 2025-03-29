export interface GridSettings {
  // Display and Layout
  rowHeight: number;
  headerHeight: number;
  pivotHeaderHeight: number;
  pivotGroupHeaderHeight: number;
  floatingFiltersHeight: number;
  suppressRowHoverHighlight: boolean;
  suppressCellSelection: boolean;
  suppressRowClickSelection: boolean;
  suppressScrollOnNewData: boolean;
  suppressColumnVirtualisation: boolean;
  suppressRowVirtualisation: boolean;
  domLayout: 'normal' | 'autoHeight' | 'print';
  ensureDomOrder: boolean;
  alwaysShowVerticalScroll: boolean;
  suppressBrowserResizeObserver: boolean;
  enableRtl: boolean;
  suppressColumnMoveAnimation: boolean;
  
  // Data and State
  pagination: boolean;
  paginationPageSize: number;
  cacheBlockSize: number;
  enableRangeSelection: boolean;
  enableRangeHandle: boolean;
  enableFillHandle: boolean;
  suppressRowDrag: boolean;
  suppressMovableColumns: boolean;
  immutableData: boolean;
  deltaRowDataMode: boolean;
  rowBuffer: number;
  rowDragManaged: boolean;
  batchUpdateWaitMillis: number;

  // Selection
  rowSelection: 'single' | 'multiple';
  rowMultiSelectWithClick: boolean;
  rowDeselection: boolean;
  suppressRowDeselection: boolean;
  groupSelectsChildren: boolean;
  groupSelectsFiltered: boolean;

  // Editing
  editType: 'fullRow' | 'singleClick' | 'doubleClick';
  singleClickEdit: boolean;
  suppressClickEdit: boolean;
  enterMovesDown: boolean;
  enterMovesDownAfterEdit: boolean;
  undoRedoCellEditing: boolean;
  undoRedoCellEditingLimit: number;
  stopEditingWhenCellsLoseFocus: boolean;
  enterNavigatesVertically: boolean;
  tabNavigatesVertically: boolean;

  // Filtering
  suppressMenuHide: boolean;
  quickFilterText: string;
  cacheQuickFilter: boolean;

  // Appearance
  theme: string;
  animateRows: boolean;
  enableBrowserTooltips: boolean;
  suppressContextMenu: boolean;
  suppressCopyRowsToClipboard: boolean;
  suppressCopySingleCellRanges: boolean;
  clipboardDelimiter: string;
  enableCellTextSelection: boolean;
  enableCellChangeFlash: boolean;
  tooltipShowDelay: number;
  tooltipHideDelay: number;

  // Row Grouping
  groupDefaultExpanded: number;
  groupDisplayType: 'singleColumn' | 'multipleColumns' | 'groupRows' | 'custom';
  groupIncludeFooter: boolean;
  groupIncludeTotalFooter: boolean;
  showOpenedGroup: boolean;
  rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never';
  enableRowGroup: boolean;
  suppressDragLeaveHidesColumns: boolean;

  // Sorting
  sortingOrder: string[];
  multiSortKey: string;
  accentedSort: boolean;
  unSortIcon: boolean;

  // Advanced Filtering
  excludeChildrenWhenTreeDataFiltering: boolean;
  
  // Export/Import
  suppressCsvExport: boolean;
  suppressExcelExport: boolean;
  
  // Column Controls
  autoSizePadding: number;
  colResizeDefault: 'shift' | 'previousAndNext';
  maintainColumnOrder: boolean;
  
  // Advanced
  enableCharts: boolean;
  suppressAriaColCount: boolean;
  suppressAriaRowCount: boolean;
  
  // Default Column Definition
  defaultColEditable: boolean;
  defaultColResizable: boolean;
  defaultColSortable: boolean;
  defaultColFilter: boolean;
  defaultColFilterParams: object;
  defaultColFlex: number;
  defaultColMinWidth: number;
  defaultColMaxWidth: number | null;
  defaultColAutoHeight: boolean;
  defaultColWrapText: boolean;
  defaultColCellStyle: object;
  floatingFilter: boolean;
}

export interface SettingsSectionProps {
  settings: GridSettings;
  onSettingChange: <K extends keyof GridSettings>(key: K, value: GridSettings[K]) => void;
}