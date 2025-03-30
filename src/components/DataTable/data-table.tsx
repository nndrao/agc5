import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Type,
  Check,
  ChevronsUpDown,
  Settings,
  Copy,
  FileInput,
  FileOutput,
  Keyboard,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Sliders,
  Columns,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GeneralSettingsDialog } from "./Settings/GeneralSettingsDialog";
import { ColumnSettingsDialog } from "./Settings/ColumnSettings/ColumnSettingsDialog";
import { defaultGridSettings } from "./Settings/defaultSettings";
import { ProfileProvider, ProfileManagerUI } from "./ProfileManager";

import { ModuleRegistry, themeQuartz, GridReadyEvent } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Toaster } from "sonner";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const monospacefonts = [
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { name: "Fira Code", value: "'Fira Code', monospace" },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
  { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
];

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
}

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = useState(monospacefonts[0]);
  const [gridTheme, setGridTheme] = useState(themeQuartz);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const [gridReady, setGridReady] = useState(false);
  // Store the current grid settings
  const [gridSettings, setGridSettings] = useState(defaultGridSettings);

  useEffect(() => {
    setDarkMode(currentTheme === "dark");
    updateGridTheme(selectedFont.value);
  }, [currentTheme, selectedFont]);
  
  // Effect for when grid is ready
  useEffect(() => {
    // This effect can be used for initializing grid when API is available
  }, [gridReady]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  function setDarkMode(enabled: boolean) {
    document.body.dataset.agThemeMode = enabled ? "dark" : "light";
  }

  function updateGridTheme(fontFamily: string) {
    const newTheme = themeQuartz
      .withParams(
        {
          accentColor: "#8AAAA7",
          backgroundColor: "#F7F7F7",
          borderColor: "#23202029",
          browserColorScheme: "light",
          buttonBorderRadius: 2,
          cellTextColor: "#000000",
          checkboxBorderRadius: 2,
          columnBorder: true,
          fontFamily: fontFamily,
          fontSize: 14,
          headerBackgroundColor: "#EFEFEFD6",
          headerFontFamily: fontFamily,
          headerFontSize: 14,
          headerFontWeight: 500,
          iconButtonBorderRadius: 1,
          iconSize: 12,
          inputBorderRadius: 2,
          oddRowBackgroundColor: "#EEF1F1E8",
          spacing: 6,
          wrapperBorderRadius: 2,
        },
        "light"
      )
      .withParams(
        {
          accentColor: "#8AAAA7",
          backgroundColor: "#1f2836",
          borderRadius: 2,
          checkboxBorderRadius: 2,
          fontFamily: fontFamily,
          browserColorScheme: "dark",
          chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor",
          },
          columnBorder: true,
          fontSize: 14,
          foregroundColor: "#FFF",
          headerFontFamily: fontFamily,
          headerFontSize: 14,
          iconSize: 12,
          inputBorderRadius: 2,
          oddRowBackgroundColor: "#2A2E35",
          spacing: 6,
          wrapperBorderRadius: 2,
        },
        "dark"
      );
    setGridTheme(newTheme);
  }

  const rowData = (() => {
    const rowData: any[] = [];
    for (let i = 0; i < 10; i++) {
      rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
      rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
      rowData.push({
        make: "Porsche",
        model: "Boxster",
        price: 72000 + i * 1000,
      });
    }
    return rowData;
  })();

  const columnDefs = [
    { 
      field: "make",
      headerName: "Make",
      filter: true,
      sortable: true,
      resizable: true,
    }, 
    { 
      field: "model",
      headerName: "Model",
      filter: true,
      sortable: true,
      resizable: true,
    }, 
    { 
      field: "price",
      headerName: "Price",
      filter: true,
      sortable: true,
      resizable: true,
      valueFormatter: (params: any) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    }
  ];

  // Create enhanced defaultColDef based on settings
  const defaultColDef = {
    flex: gridSettings.defaultColFlex || 1,
    minWidth: gridSettings.defaultColMinWidth || 100,
    maxWidth: gridSettings.defaultColMaxWidth || undefined,
    filter: gridSettings.defaultColFilter !== undefined ? gridSettings.defaultColFilter : true,
    filterParams: undefined,
    editable: gridSettings.defaultColEditable !== undefined ? gridSettings.defaultColEditable : true,
    resizable: gridSettings.defaultColResizable !== undefined ? gridSettings.defaultColResizable : true,
    sortable: gridSettings.defaultColSortable !== undefined ? gridSettings.defaultColSortable : true,
    floatingFilter: gridSettings.floatingFilter !== undefined ? gridSettings.floatingFilter : false,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    autoHeight: gridSettings.defaultColAutoHeight || false,
    wrapText: gridSettings.defaultColWrapText || false,
    cellStyle: undefined,
  };

  const onGridReady = (params: GridReadyEvent) => {
    // Get access to grid APIs
    const columnApi = (params as any).columnApi;
    
    // Store grid APIs directly
    if (gridRef.current) {
      // Store grid API references
      gridRef.current.api = params.api;
      (gridRef.current as any).columnApi = columnApi;
    }
    
    setGridReady(true);
  };

  const handleApplySettings = (settings: any, preserveColumnSizes: boolean = false) => {
    console.log(`Applying grid settings (preserveColumnSizes=${preserveColumnSizes}):`, settings);
    
    // Update the stored settings
    setGridSettings(settings);
    
    if (!gridRef.current || !gridRef.current.api) {
      console.warn('Grid API not available, cannot apply settings');
      return;
    }
    
    const gridApi = gridRef.current.api;
    const columnApi = (gridRef.current as any).columnApi;
    
    // Capture current column state to preserve column widths and other properties
    const currentColumnState = columnApi ? columnApi.getColumnState() : [];
    if (preserveColumnSizes) {
      logColumnWidths(columnApi, 'Column widths before applying settings (will be preserved)');
    }
    
    // Create a settings map to apply
    const gridSettingsMap: Record<string, any> = {
      // Display and Layout
      headerHeight: settings.headerHeight,
      rowHeight: settings.rowHeight,
      domLayout: settings.domLayout,
      suppressRowHoverHighlight: settings.suppressRowHoverHighlight,
      suppressCellSelection: settings.suppressCellSelection,
      suppressRowClickSelection: settings.suppressRowClickSelection,
      suppressScrollOnNewData: settings.suppressScrollOnNewData,
      suppressColumnVirtualisation: settings.suppressColumnVirtualisation,
      suppressRowVirtualisation: settings.suppressRowVirtualisation,
      ensureDomOrder: settings.ensureDomOrder,
      alwaysShowVerticalScroll: settings.alwaysShowVerticalScroll,
      suppressBrowserResizeObserver: settings.suppressBrowserResizeObserver,
      enableRtl: settings.enableRtl,
      suppressColumnMoveAnimation: settings.suppressColumnMoveAnimation,
      floatingFiltersHeight: settings.floatingFilter ? 35 : 0,
      
      // Data and State
      pagination: settings.pagination,
      paginationPageSize: settings.paginationPageSize,
      cacheBlockSize: settings.cacheBlockSize,
      enableRangeSelection: settings.enableRangeSelection,
      enableRangeHandle: settings.enableRangeHandle,
      enableFillHandle: settings.enableFillHandle,
      suppressRowDrag: settings.suppressRowDrag,
      suppressMovableColumns: settings.suppressMovableColumns,
      immutableData: settings.immutableData,
      deltaRowDataMode: settings.deltaRowDataMode,
      rowBuffer: settings.rowBuffer,
      rowDragManaged: settings.rowDragManaged,
      batchUpdateWaitMillis: settings.batchUpdateWaitMillis,
      
      // Selection
      rowSelection: settings.rowSelection,
      rowMultiSelectWithClick: settings.rowMultiSelectWithClick,
      rowDeselection: settings.rowDeselection,
      suppressRowDeselection: settings.suppressRowDeselection,
      groupSelectsChildren: settings.groupSelectsChildren,
      groupSelectsFiltered: settings.groupSelectsFiltered,
      
      // Editing
      editType: settings.editType,
      singleClickEdit: settings.singleClickEdit,
      suppressClickEdit: settings.suppressClickEdit,
      enterMovesDown: settings.enterMovesDown,
      enterMovesDownAfterEdit: settings.enterMovesDownAfterEdit,
      undoRedoCellEditing: settings.undoRedoCellEditing,
      undoRedoCellEditingLimit: settings.undoRedoCellEditingLimit,
      stopEditingWhenCellsLoseFocus: settings.stopEditingWhenCellsLoseFocus,
      enterNavigatesVertically: settings.enterNavigatesVertically, 
      tabNavigatesVertically: settings.tabNavigatesVertically,
      
      // Filtering
      suppressMenuHide: settings.suppressMenuHide,
      quickFilterText: settings.quickFilterText,
      cacheQuickFilter: settings.cacheQuickFilter,
      
      // Appearance
      animateRows: settings.animateRows,
      enableBrowserTooltips: settings.enableBrowserTooltips,
      suppressContextMenu: settings.suppressContextMenu,
      suppressCopyRowsToClipboard: settings.suppressCopyRowsToClipboard,
      suppressCopySingleCellRanges: settings.suppressCopySingleCellRanges,
      enableCellTextSelection: settings.enableCellTextSelection,
      enableCellChangeFlash: settings.enableCellChangeFlash,
      tooltipShowDelay: settings.tooltipShowDelay,
      tooltipHideDelay: settings.tooltipHideDelay,
      
      // Row Grouping
      groupDefaultExpanded: settings.groupDefaultExpanded,
      groupDisplayType: settings.groupDisplayType,
      groupIncludeFooter: settings.groupIncludeFooter,
      groupIncludeTotalFooter: settings.groupIncludeTotalFooter,
      showOpenedGroup: settings.showOpenedGroup,
      rowGroupPanelShow: settings.rowGroupPanelShow,
      enableRowGroup: settings.enableRowGroup,
      suppressDragLeaveHidesColumns: settings.suppressDragLeaveHidesColumns,
      
      // Sorting
      multiSortKey: settings.multiSortKey,
      accentedSort: settings.accentedSort,
      unSortIcon: settings.unSortIcon,
      
      // Export/Import
      suppressCsvExport: settings.suppressCsvExport,
      suppressExcelExport: settings.suppressExcelExport,
      
      // Column Controls
      autoSizePadding: settings.autoSizePadding,
      colResizeDefault: settings.colResizeDefault,
      maintainColumnOrder: settings.maintainColumnOrder,
      
      // Advanced
      enableCharts: settings.enableCharts,
      suppressAriaColCount: settings.suppressAriaColCount,
      suppressAriaRowCount: settings.suppressAriaRowCount,
      
      // Advanced Filtering  
      excludeChildrenWhenTreeDataFiltering: settings.excludeChildrenWhenTreeDataFiltering
    };
    
    // Apply each setting using setGridOption for maximum compatibility
    Object.entries(gridSettingsMap).forEach(([key, value]) => {
      // Skip settings that affect column widths if preserveColumnSizes is true
      if (preserveColumnSizes && 
          ['defaultColDef', 'columnDefs', 'sideBar', 'autoSizePadding'].includes(key)) {
        console.log(`Skipping ${key} to preserve column widths`);
        return;
      }
      
      try {
        if (value !== undefined) {
          console.log(`Setting grid option: ${key} = ${value}`);
          (gridApi as any).setGridOption(key as any, value);
        }
      } catch (error) {
        console.warn(`Failed to set grid option: ${key}`, error);
        
        // Try alternative methods for specific properties if setGridOption fails
        try {
          if (key === 'headerHeight' && (gridApi as any).setHeaderHeight) {
            (gridApi as any).setHeaderHeight(value);
          } else if (key === 'paginationPageSize' && (gridApi as any).paginationSetPageSize) {
            (gridApi as any).paginationSetPageSize(value);
          } else if (key === 'domLayout' && (gridApi as any).setDomLayout) {
            (gridApi as any).setDomLayout(value);
          } else if (key === 'animateRows' && (gridApi as any).setAnimateRows) {
            (gridApi as any).setAnimateRows(value);
          } else if (key === 'editType') {
            // Special handling for edit type - this might need different properties in different versions
            if ((gridApi as any).setGridOption) {
              try {
                // Try different property names that might exist in AG Grid
                (gridApi as any).setGridOption('editType' as any, value);
              } catch (e1) {
                try { 
                  (gridApi as any).setGridOption('cellEditingType' as any, value); 
                } catch (e2) {
                  console.warn('Could not set edit type with any property name');
                }
              }
            }
          }
        } catch (fallbackError) {
          console.warn(`Fallback method failed for: ${key}`, fallbackError);
        }
      }
    });
    
    // Special case for sortingOrder which is an array
    if (settings.sortingOrder && Array.isArray(settings.sortingOrder)) {
      try {
        (gridApi as any).setGridOption('sortingOrder' as any, settings.sortingOrder);
      } catch (error) {
        console.warn('Failed to set sortingOrder', error);
      }
    }
    
    // Special handling for edit type settings
    try {
      // Handle edit type specifically
      if (settings.editType) {
        console.log(`Configuring edit type: ${settings.editType}`);
        
        // Different AG Grid versions might need different configurations
        if (settings.editType === 'fullRow') {
          (gridApi as any).setGridOption('editType' as any, 'fullRow');
        } else if (settings.editType === 'singleClick') {
          (gridApi as any).setGridOption('editType' as any, 'singleClick');
          (gridApi as any).setGridOption('singleClickEdit' as any, true);
        } else if (settings.editType === 'doubleClick') {
          (gridApi as any).setGridOption('editType' as any, 'doubleClick');
          (gridApi as any).setGridOption('singleClickEdit' as any, false);
        }
      }
    } catch (editTypeError) {
      console.warn('Failed to configure edit type settings', editTypeError);
    }
    
    // Handle floating filters (must be done at both grid and column level)
    try {
      // Set the floating filters height (required at grid level)
      if (settings.floatingFilter) {
        (gridApi as any).setGridOption('floatingFiltersHeight', 35); // Default height for floating filters
      } else {
        (gridApi as any).setGridOption('floatingFiltersHeight', 0); // Hide when disabled
      }
    } catch (filterError) {
      console.warn('Failed to set floating filter height', filterError);
    }
    
    // Update default column definitions for editing settings
    try {
      // Copy existing defaultColDef
      const updatedDefaultColDef = { ...defaultColDef };
      
      // Apply non-width related settings
      updatedDefaultColDef.editable = settings.defaultColEditable;
      updatedDefaultColDef.resizable = settings.defaultColResizable;
      updatedDefaultColDef.sortable = settings.defaultColSortable;
      updatedDefaultColDef.filter = settings.defaultColFilter;
      updatedDefaultColDef.filterParams = settings.defaultColFilterParams;
      updatedDefaultColDef.autoHeight = settings.defaultColAutoHeight;
      updatedDefaultColDef.wrapText = settings.defaultColWrapText;
      updatedDefaultColDef.cellStyle = settings.defaultColCellStyle;
      updatedDefaultColDef.floatingFilter = settings.floatingFilter;
      
      // Only apply width-related settings if we are not preserving column sizes
      if (!preserveColumnSizes) {
        updatedDefaultColDef.flex = settings.defaultColFlex;
        updatedDefaultColDef.minWidth = settings.defaultColMinWidth;
        updatedDefaultColDef.maxWidth = settings.defaultColMaxWidth;
      }
      
      // Update the defaultColDef
      (gridApi as any).setGridOption('defaultColDef', updatedDefaultColDef);
      console.log('Updated defaultColDef with settings' + 
                  (preserveColumnSizes ? ' (width properties preserved)' : ''));
      
      // Just refresh cells without updating column defs
      setTimeout(() => {
        if ((gridApi as any).refreshCells) {
          (gridApi as any).refreshCells({ force: true });
        }
      }, 50);
    } catch (defColDefError) {
      console.warn('Failed to update defaultColDef with settings', defColDefError);
    }
    
    // Refresh the grid UI but preserve column state if needed
    try {
      // Important: For filters to refresh properly, we need these specific methods
      if ((gridApi as any).refreshHeader) (gridApi as any).refreshHeader();
      
      // For floating filters specifically, we need to trigger a header refresh
      if (settings.floatingFilter) {
        try {
          (gridApi as any).refreshHeader();
        } catch (headerError) {
          console.warn('Error refreshing header components:', headerError);
        }
      }
      
      if ((gridApi as any).redrawRows) (gridApi as any).redrawRows();
      
      // Restore column state to preserve widths if requested
      if (preserveColumnSizes && columnApi && currentColumnState.length > 0) {
        console.log('Restoring column state after applying settings to preserve widths');
        columnApi.applyColumnState({
          state: currentColumnState,
          applyOrder: true
        });
        
        // Log final column widths
        logColumnWidths(columnApi, 'Column widths after restoring column state');
      }
      
      console.log('Grid settings applied successfully' + 
                  (preserveColumnSizes ? ' with width preservation' : ''));
    } catch (error) {
      console.warn('Error refreshing grid after settings applied', error);
    }
  };

  // Create a map of grid options from the defaultGridSettings
  const getGridOptionsFromSettings = () => {
    // Use type assertion for the entire object to avoid specific property conflicts
    return {
      // Display and Layout
      headerHeight: gridSettings.headerHeight,
      rowHeight: gridSettings.rowHeight,
      domLayout: gridSettings.domLayout,
      suppressRowHoverHighlight: gridSettings.suppressRowHoverHighlight,
      suppressCellSelection: gridSettings.suppressCellSelection,
      suppressRowClickSelection: gridSettings.suppressRowClickSelection,
      suppressScrollOnNewData: gridSettings.suppressScrollOnNewData,
      suppressColumnVirtualisation: gridSettings.suppressColumnVirtualisation,
      suppressRowVirtualisation: gridSettings.suppressRowVirtualisation,
      ensureDomOrder: gridSettings.ensureDomOrder,
      alwaysShowVerticalScroll: gridSettings.alwaysShowVerticalScroll,
      suppressBrowserResizeObserver: gridSettings.suppressBrowserResizeObserver,
      enableRtl: gridSettings.enableRtl,
      suppressColumnMoveAnimation: gridSettings.suppressColumnMoveAnimation,
      floatingFiltersHeight: gridSettings.floatingFilter ? 35 : 0,
      
      // Data and State
      pagination: gridSettings.pagination,
      paginationPageSize: gridSettings.paginationPageSize,
      cacheBlockSize: gridSettings.cacheBlockSize,
      enableRangeSelection: gridSettings.enableRangeSelection,
      enableRangeHandle: gridSettings.enableRangeHandle,
      enableFillHandle: gridSettings.enableFillHandle,
      suppressRowDrag: gridSettings.suppressRowDrag,
      suppressMovableColumns: gridSettings.suppressMovableColumns,
      immutableData: gridSettings.immutableData,
      deltaRowDataMode: gridSettings.deltaRowDataMode,
      rowBuffer: gridSettings.rowBuffer,
      rowDragManaged: gridSettings.rowDragManaged,
      batchUpdateWaitMillis: gridSettings.batchUpdateWaitMillis,
      
      // Selection
      rowSelection: gridSettings.rowSelection,
      rowMultiSelectWithClick: gridSettings.rowMultiSelectWithClick,
      rowDeselection: gridSettings.rowDeselection,
      suppressRowDeselection: gridSettings.suppressRowDeselection,
      groupSelectsChildren: gridSettings.groupSelectsChildren,
      groupSelectsFiltered: gridSettings.groupSelectsFiltered,
      
      // Editing
      editType: gridSettings.editType,
      singleClickEdit: gridSettings.singleClickEdit,
      suppressClickEdit: gridSettings.suppressClickEdit,
      enterMovesDown: gridSettings.enterMovesDown,
      enterMovesDownAfterEdit: gridSettings.enterMovesDownAfterEdit,
      undoRedoCellEditing: gridSettings.undoRedoCellEditing,
      undoRedoCellEditingLimit: gridSettings.undoRedoCellEditingLimit,
      stopEditingWhenCellsLoseFocus: gridSettings.stopEditingWhenCellsLoseFocus,
      enterNavigatesVertically: gridSettings.enterNavigatesVertically, 
      tabNavigatesVertically: gridSettings.tabNavigatesVertically,
      
      // Filtering
      suppressMenuHide: gridSettings.suppressMenuHide,
      quickFilterText: gridSettings.quickFilterText,
      cacheQuickFilter: gridSettings.cacheQuickFilter,
      
      // Appearance
      animateRows: gridSettings.animateRows,
      enableBrowserTooltips: gridSettings.enableBrowserTooltips,
      suppressContextMenu: gridSettings.suppressContextMenu,
      suppressCopyRowsToClipboard: gridSettings.suppressCopyRowsToClipboard,
      suppressCopySingleCellRanges: gridSettings.suppressCopySingleCellRanges,
      enableCellTextSelection: gridSettings.enableCellTextSelection,
      enableCellChangeFlash: gridSettings.enableCellChangeFlash,
      tooltipShowDelay: gridSettings.tooltipShowDelay,
      tooltipHideDelay: gridSettings.tooltipHideDelay,
      
      // Row Grouping
      groupDefaultExpanded: gridSettings.groupDefaultExpanded,
      groupDisplayType: gridSettings.groupDisplayType,
      groupIncludeFooter: gridSettings.groupIncludeFooter,
      groupIncludeTotalFooter: gridSettings.groupIncludeTotalFooter,
      showOpenedGroup: gridSettings.showOpenedGroup,
      rowGroupPanelShow: gridSettings.rowGroupPanelShow,
      enableRowGroup: gridSettings.enableRowGroup,
      suppressDragLeaveHidesColumns: gridSettings.suppressDragLeaveHidesColumns,
      
      // Sorting
      sortingOrder: gridSettings.sortingOrder,
      multiSortKey: gridSettings.multiSortKey,
      accentedSort: gridSettings.accentedSort,
      unSortIcon: gridSettings.unSortIcon,
      
      // Export/Import
      suppressCsvExport: gridSettings.suppressCsvExport,
      suppressExcelExport: gridSettings.suppressExcelExport,
      
      // Column Controls
      autoSizePadding: gridSettings.autoSizePadding,
      // Ensure colResizeDefault is only 'shift' if used
      colResizeDefault: gridSettings.colResizeDefault === 'shift' ? 'shift' : undefined,
      maintainColumnOrder: gridSettings.maintainColumnOrder,
      
      // Advanced
      enableCharts: gridSettings.enableCharts,
      suppressAriaColCount: gridSettings.suppressAriaColCount,
      suppressAriaRowCount: gridSettings.suppressAriaRowCount,
      
      // Advanced Filtering
      excludeChildrenWhenTreeDataFiltering: gridSettings.excludeChildrenWhenTreeDataFiltering,
    } as any; // Cast the entire result to avoid TypeScript type issues
  };

  // Debug helper to log column width changes
  const logColumnWidths = (columnApi: any, message: string) => {
    if (!columnApi) return;
    
    try {
      const columnState = columnApi.getColumnState();
      const widthInfo = columnState.map((col: any) => ({
        colId: col.colId,
        width: col.width,
        flex: col.flex
      }));
      console.log(`${message}:`, widthInfo);
    } catch (e) {
      console.error('Failed to log column widths:', e);
    }
  };

  return (
    <ProfileProvider>
      <div className="flex h-full flex-col rounded-md border bg-card">
        {/* Toast notifications for profile actions */}
        <Toaster position="top-right" />
        
        {/* Main Toolbar */}
        <div className="flex flex-col border-b bg-gray-50/50 dark:bg-gray-800/50">
          {/* Upper Toolbar */}
          <div className="flex h-[60px] items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              {/* Profile Management Controls */}
              <ProfileManagerUI 
                gridRef={gridRef} 
                gridSettings={gridSettings} 
                onProfileLoaded={(settings) => setGridSettings(settings)}
                autoLoadDefaultProfile={gridReady}
              />
            </div>

          <div className="flex items-center space-x-2">
            {/* Font Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  <Type className="mr-2 h-4 w-4" />
                  {selectedFont.name}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command value={selectedFont.value} shouldFilter={false}>
                  <CommandInput placeholder="Search font..." />
                  <CommandEmpty>No font found.</CommandEmpty>
                  <CommandGroup>
                    {monospacefonts.map((font) => (
                      <CommandItem
                        key={font.value}
                        value={font.name.toLowerCase()}
                        onSelect={() => {
                          setSelectedFont(font);
                          document.documentElement.style.setProperty('--ag-font-family', font.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFont.value === font.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-8" />

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Sliders className="mr-2 h-4 w-4" />
                    <span>General Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setColumnSettingsOpen(true)}>
                    <Columns className="mr-2 h-4 w-4" />
                    <span>Column Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Layout</span>
                    <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileInput className="mr-2 h-4 w-4" />
                    <span>Import Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileOutput className="mr-2 h-4 w-4" />
                    <span>Export Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard Shortcuts</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-quartz flex-1">
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
          {...getGridOptionsFromSettings()}
        />
      </div>

      <GeneralSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onApplySettings={(settings) => handleApplySettings(settings, false)}
        initialSettings={gridSettings}
      />

      <ColumnSettingsDialog
        open={columnSettingsOpen}
        onOpenChange={setColumnSettingsOpen}
        gridRef={gridRef}
        fallbackColumnDefs={columnDefs}
      />
    </div>
  </ProfileProvider>
);
}
