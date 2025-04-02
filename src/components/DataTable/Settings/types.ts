export interface GridSettings {
  // Display and Layout
  rowHeight: number;
  headerHeight: number;
  pivotHeaderHeight: number;
  pivotGroupHeaderHeight: number;
  floatingFiltersHeight: number;
  suppressRowHoverHighlight: boolean;
  // Invalid in AG-Grid 33+ - use suppressCellFocus or cellSelection property instead
  suppressCellSelection?: boolean;
  // Deprecated since v32.2
  suppressRowClickSelection?: boolean;
  suppressScrollOnNewData: boolean;
  suppressColumnVirtualisation: boolean;
  suppressRowVirtualisation: boolean;
  domLayout: 'normal' | 'autoHeight' | 'print';
  ensureDomOrder: boolean;
  alwaysShowVerticalScroll: boolean;
  // Deprecated since v32.2
  suppressBrowserResizeObserver?: boolean;
  enableRtl: boolean;
  suppressColumnMoveAnimation: boolean;
  // Valid replacement for suppressCellSelection
  suppressCellFocus?: boolean;
  
  // Data and State
  pagination: boolean;
  paginationPageSize: number;
  // Not valid with clientSide row model
  cacheBlockSize?: number;
  // Cell Selection - deprecated properties
  enableRangeSelection?: boolean; // Deprecated since v32.2, use cellSelection
  enableRangeHandle?: boolean;    // Deprecated since v32.2, use cellSelection.handle
  enableFillHandle?: boolean;     // Deprecated since v32.2, use cellSelection.handle
  // New cell selection property
  cellSelection?: boolean | {
    handle?: boolean | 'range' | 'fill';
  };
  suppressRowDrag: boolean;
  suppressMovableColumns: boolean;
  // Invalid in AG-Grid 33+ - use getRowId and transaction APIs instead
  immutableData?: boolean;
  // Invalid in AG-Grid 33+ - use resetRowDataOnUpdate instead
  deltaRowDataMode?: boolean;
  // Valid replacements for immutableData/deltaRowDataMode
  resetRowDataOnUpdate?: boolean;
  rowBuffer: number;
  rowDragManaged: boolean;
  // Invalid in AG-Grid 33+, use asyncTransactionWaitMillis instead
  batchUpdateWaitMillis?: number;
  // Valid replacement for batchUpdateWaitMillis
  asyncTransactionWaitMillis?: number;
  // Row ID function for optimizing updates (replaces immutableData pattern)
  getRowId?: Function;

  // Selection
  // In AG-Grid 33+, rowSelection should be an object with a type property
  rowSelection: {
    type: 'singleRow' | 'multiRow';
    enableClickSelection?: boolean;
    enableSelectionWithoutKeys?: boolean;
    groupSelects?: 'children' | 'descendants' | 'filteredDescendants';
    copySelectedRows?: boolean;
  } | 'singleRow' | 'multiRow' | 'single' | 'multiple'; // Legacy string support for backward compatibility
  // Legacy property kept for backward compatibility
  rowMultiSelectWithClick?: boolean;

  // Editing
  editType: 'fullRow' | 'singleClick' | 'doubleClick';
  singleClickEdit: boolean;
  suppressClickEdit: boolean;
  // Deprecated/invalid properties
  enterMovesDown?: boolean; // Invalid in AG-Grid 33+, use enterNavigatesVertically
  enterMovesDownAfterEdit?: boolean; // Invalid in AG-Grid 33+, use enterNavigatesVerticallyAfterEdit
  // Valid replacements
  enterNavigatesVertically: boolean;
  enterNavigatesVerticallyAfterEdit?: boolean;
  undoRedoCellEditing: boolean;
  undoRedoCellEditingLimit: number;
  stopEditingWhenCellsLoseFocus: boolean;
  // Invalid in AG-Grid 33+
  tabNavigatesVertically?: boolean; // Use tabToNextCell callback instead

  // Filtering
  suppressMenuHide: boolean;
  quickFilterText: string;
  cacheQuickFilter: boolean;

  // Appearance
  theme: string;
  animateRows: boolean;
  enableBrowserTooltips: boolean;
  suppressContextMenu: boolean;
  // Deprecated clipboard properties kept for backward compatibility
  suppressCopyRowsToClipboard?: boolean;
  suppressCopySingleCellRanges?: boolean;
  clipboardDelimiter: string;
  enableCellTextSelection: boolean;
  // Invalid in AG-Grid 33+
  enableCellChangeFlash?: boolean;
  // Valid cell flash properties for AG-Grid 33+
  cellFlashDuration?: number;
  cellFadeDuration?: number;
  tooltipShowDelay: number;
  tooltipHideDelay: number;

  // Row Grouping
  groupDefaultExpanded: number;
  groupDisplayType: 'singleColumn' | 'multipleColumns' | 'groupRows' | 'custom';
  // These are invalid properties in AG-Grid 33+ - use groupTotalRow and grandTotalRow instead
  groupIncludeFooter?: boolean;
  groupIncludeTotalFooter?: boolean;
  // Valid AG-Grid 33+ properties
  groupTotalRow?: boolean;
  grandTotalRow?: boolean;
  showOpenedGroup: boolean;
  rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never';
  // This is an invalid grid-level property - it should be in colDef instead
  enableRowGroup?: boolean;
  suppressDragLeaveHidesColumns: boolean;

  // Sorting
  // Deprecated - sortingOrder is now part of defaultColDef
  sortingOrder?: Array<'asc' | 'desc' | null>;
  multiSortKey: string;
  accentedSort: boolean;
  // Deprecated - unSortIcon is now part of defaultColDef
  unSortIcon?: boolean;

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
  // These are invalid properties in AG-Grid 33+
  suppressAriaColCount?: boolean;
  suppressAriaRowCount?: boolean;
  
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
  defaultColSortingOrder?: Array<'asc' | 'desc' | null>; // For sortingOrder which is now in defaultColDef
  defaultColUnSortIcon?: boolean;    // For unSortIcon which is now in defaultColDef
  floatingFilter: boolean;
}

export interface SettingsSectionProps {
  settings: GridSettings;
  onSettingChange: <K extends keyof GridSettings>(key: K, value: GridSettings[K]) => void;
}