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
import { useProfileContext } from "./ProfileManager/ProfileContext";
import { getSortModelFromColumnState } from "./ProfileManager/GridStateUtils";

import { ModuleRegistry, themeQuartz, GridReadyEvent } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Toaster, toast } from "sonner";

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

export function DataTableWithProfiles<TData, TValue>(props: DataTableProps<TData, TValue>) {
  return (
    <ProfileProvider>
      <DataTable {...props} />
    </ProfileProvider>
  );
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
  
  // Access the profile context to get profile data
  const { 
    profiles, 
    selectedProfileId, 
    selectProfile,
    isLoading: profilesLoading,
    loadProfileById,
    updateCurrentProfile
  } = useProfileContext();

  // Initialize grid settings from the selected profile
  useEffect(() => {
    if (profiles.length > 0 && selectedProfileId && gridReady) {
      console.log('Grid is ready and a profile is selected, loading profile data...');
      
      // Use the context method to load the profile with the grid API
      if (gridRef.current?.api) {
        // Handle the Promise returned by loadProfileById
        (async () => {
          try {
            console.log('Loading profile with ID:', selectedProfileId);
            const profile = await loadProfileById(selectedProfileId, gridRef.current?.api);
            if (profile) {
              console.log('Profile loaded successfully:', profile.name);
              
              // Update the gridSettings state with the profile settings
              if (profile.settings) {
                console.log('Updating gridSettings state from loaded profile');
                setGridSettings(profile.settings);
              }
            } else {
              console.error('Profile not found or could not be loaded');
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('Error loading profile:', errorMessage);
            toast.error('Error loading profile: ' + errorMessage);
          }
        })();
      } else {
        // Fallback to just selecting the profile without applying it
        const selectedProfile = profiles.find(p => p.id === selectedProfileId);
        if (selectedProfile?.settings) {
          console.log('Grid API not ready, only initializing settings state from profile:', selectedProfile.name);
          setGridSettings(selectedProfile.settings);
        }
      }
    } else if (!gridReady) {
      console.log('Grid not ready yet, waiting before loading profile');
    } else {
      console.log('No profile selected, using default grid settings');
    }
  }, [profiles, selectedProfileId, gridReady, loadProfileById]);
  
  // Ensure rowSelection is properly initialized
  useEffect(() => {
    // Check if rowSelection is valid
    const rowSelectionValid = validateRowSelectionType(gridSettings.rowSelection);
    
    if (!rowSelectionValid) {
      console.warn('Invalid rowSelection detected:', gridSettings.rowSelection);
      
      // Handle different invalid cases
      let rowSelection: { 
        type: 'singleRow' | 'multiRow'; 
        enableClickSelection?: boolean; 
        enableSelectionWithoutKeys?: boolean;
        groupSelects?: 'children' | 'descendants' | 'filteredDescendants';
        copySelectedRows?: boolean;
      };
      
      if (!gridSettings.rowSelection) {
        // Handle undefined or null case
        console.log('Creating default rowSelection object (undefined case)');
        rowSelection = {
          type: 'multiRow',
          enableClickSelection: !gridSettings.suppressRowClickSelection,
          enableSelectionWithoutKeys: !!gridSettings.rowMultiSelectWithClick,
          groupSelects: 'descendants',
          copySelectedRows: !gridSettings.suppressCopyRowsToClipboard
        };
      } else if (typeof gridSettings.rowSelection === 'string') {
        // Handle string case (old-style rowSelection)
        console.log('Converting string rowSelection to object:', gridSettings.rowSelection);
        rowSelection = {
          type: gridSettings.rowSelection === 'single' ? 'singleRow' : 'multiRow',
          enableClickSelection: !gridSettings.suppressRowClickSelection,
          enableSelectionWithoutKeys: !!gridSettings.rowMultiSelectWithClick,
          groupSelects: 'descendants',
          copySelectedRows: !gridSettings.suppressCopyRowsToClipboard
        };
      } else if (typeof gridSettings.rowSelection === 'object') {
        // Handle object case but with missing or invalid type
        console.log('Fixing rowSelection object with invalid type');
        rowSelection = {
          ...gridSettings.rowSelection as any,
          type: 'multiRow' as const, // Default to multiRow
        };
      } else {
        // Fallback for any other case
        console.log('Creating fallback rowSelection object');
        rowSelection = {
          type: 'multiRow',
          enableClickSelection: !gridSettings.suppressRowClickSelection,
          enableSelectionWithoutKeys: !!gridSettings.rowMultiSelectWithClick,
          groupSelects: 'descendants',
          copySelectedRows: !gridSettings.suppressCopyRowsToClipboard
        };
      }
      
      // Update grid settings with fixed rowSelection
      console.log('Setting corrected rowSelection:', rowSelection);
      setGridSettings(prev => ({
        ...prev,
        rowSelection
      }));
    }
  }, []);

  // Ensure rowSelection is always a valid object
  const getValidRowSelection = (rowSelection: any) => {
    if (validateRowSelectionType(rowSelection)) {
      return rowSelection;
    }
    
    // Create a default rowSelection object
    return {
      type: 'multiRow' as const,  // Default to multiRow
      enableClickSelection: rowSelection?.enableClickSelection !== undefined 
        ? rowSelection.enableClickSelection 
        : !gridSettings.suppressRowClickSelection,
      enableSelectionWithoutKeys: rowSelection?.enableSelectionWithoutKeys !== undefined 
        ? rowSelection.enableSelectionWithoutKeys 
        : !!gridSettings.rowMultiSelectWithClick,
      groupSelects: rowSelection?.groupSelects || 'descendants',
      copySelectedRows: rowSelection?.copySelectedRows !== undefined 
        ? rowSelection.copySelectedRows 
        : !gridSettings.suppressCopyRowsToClipboard
    };
  };

  useEffect(() => {
    setDarkMode(currentTheme === "dark");
    updateGridTheme(selectedFont.value);
  }, [currentTheme, selectedFont]);

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
    // Use AG-Grid 33+ themeQuartz.withParams() approach for theme customization
    // This is the recommended way to customize themes in AG-Grid 33+
    const lightThemeParams = {
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
    };
    
    const darkThemeParams = {
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
    };
    
    // Create a new theme with both light and dark mode parameters
    const newTheme = themeQuartz
      .withParams(lightThemeParams, "light")
      .withParams(darkThemeParams, "dark");
      
    setGridTheme(newTheme);
    
    // Also apply CSS variables for AG-Grid 33+ recommended approach
    // This provides more flexibility and better performance
    document.documentElement.style.setProperty('--ag-font-family', fontFamily);
    
    // Apply other custom CSS variables that match our theme settings
    if (currentTheme === 'dark') {
      document.documentElement.style.setProperty('--ag-background-color', darkThemeParams.backgroundColor);
      document.documentElement.style.setProperty('--ag-header-background-color', '#2d3748');
      document.documentElement.style.setProperty('--ag-odd-row-background-color', darkThemeParams.oddRowBackgroundColor);
    } else {
      document.documentElement.style.setProperty('--ag-background-color', lightThemeParams.backgroundColor);
      document.documentElement.style.setProperty('--ag-header-background-color', lightThemeParams.headerBackgroundColor);
      document.documentElement.style.setProperty('--ag-odd-row-background-color', lightThemeParams.oddRowBackgroundColor);
    }
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
    // Use enableRowGroup from gridSettings (it's a column-level property, not grid-level)
    enableValue: true,
    enableRowGroup: gridSettings.enableRowGroup !== undefined ? gridSettings.enableRowGroup : true,
    enablePivot: true,
    autoHeight: gridSettings.defaultColAutoHeight || false,
    wrapText: gridSettings.defaultColWrapText || false,
    cellStyle: undefined,
    // In AG-Grid 33+, sortingOrder should be in defaultColDef, not at grid level
    sortingOrder: gridSettings.defaultColSortingOrder || gridSettings.sortingOrder || ['asc', 'desc', null],
    // In AG-Grid 33+, unSortIcon should be in defaultColDef, not at grid level
    unSortIcon: gridSettings.defaultColUnSortIcon || gridSettings.unSortIcon || false,
  };

  const onGridReady = (params: GridReadyEvent) => {
    console.log('Grid is ready', params);
    console.log('Grid API available:', !!params.api);
    
    // In AG-Grid 33+, column API methods are now part of the main grid API
    // We don't need to access columnApi separately
    
    // Store grid API directly
    if (gridRef.current) {
      console.log('Setting API on gridRef');
      gridRef.current.api = params.api;
      
      // For compatibility with any code that might still reference columnApi
      // Just point columnApi to the same gridApi
      (gridRef.current as any).columnApi = params.api;
      
      // Log a message that will help confirm API access
      console.log('API stored in gridRef. Test access:', {
        apiAccessible: !!gridRef.current.api,
        apiMethods: Object.keys(gridRef.current.api).slice(0, 5), // Log a few methods to confirm API shape
      });
    }
    
    setGridReady(true);
    
    // Load the selected profile if it exists
    if (selectedProfileId) {
      console.log('Grid ready and profile selected, loading profile:', selectedProfileId);
      
      (async () => {
        try {
          console.log('Loading profile from onGridReady with ID:', selectedProfileId);
          const profile = await loadProfileById(selectedProfileId, params.api);
          if (profile) {
            console.log('Profile loaded from onGridReady:', profile.name);
            
            // Update the gridSettings state with the profile settings
            if (profile.settings) {
              console.log('Updating gridSettings state from profile loaded in onGridReady');
              setGridSettings(profile.settings);
            }
          } else {
            console.error('Profile not found or could not be loaded from onGridReady');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error('Error loading profile from onGridReady:', errorMessage);
          toast.error('Error loading profile: ' + errorMessage);
        }
      })();
    } else {
      console.log('Grid ready but no profile selected');
    }
  };

  const handleApplySettings = (settings: any, preserveColumnSizes: boolean = false) => {
    console.log(`Applying grid settings (preserveColumnSizes=${preserveColumnSizes}):`, settings);
    
    // Create a merged settings object that combines the current settings with the new ones
    // This ensures we don't lose settings that aren't explicitly provided
    const mergedSettings = {
      ...gridSettings,  // Start with all current settings
      ...settings       // Override with the new settings
    };
    
    // Update the stored settings with the merged settings
    setGridSettings(mergedSettings);
    
    if (!gridRef.current || !gridRef.current.api) {
      console.warn('Grid API not available, cannot apply settings');
      return;
    }
    
    const gridApi = gridRef.current.api;
    
    // Capture current column state to preserve column widths and other properties
    // In AG-Grid 33+, use gridApi for column state operations
    const currentColumnState = gridApi.getColumnState ? gridApi.getColumnState() : [];
    if (preserveColumnSizes) {
      logColumnWidths(gridApi, 'Column widths before applying settings (will be preserved)');
    }
    
    // Create a settings map to apply
    const gridSettingsMap: Record<string, any> = {
      // Display and Layout
      headerHeight: settings.headerHeight,
      rowHeight: settings.rowHeight,
      domLayout: settings.domLayout,
      suppressRowHoverHighlight: settings.suppressRowHoverHighlight,
      // Use suppressCellFocus instead of invalid suppressCellSelection
      suppressCellFocus: settings.suppressCellFocus !== undefined ? 
                       settings.suppressCellFocus : 
                       settings.suppressCellSelection,
      // Note: suppressRowClickSelection is now handled via rowSelection.enableClickSelection
      suppressScrollOnNewData: settings.suppressScrollOnNewData,
      // suppressColumnVirtualisation is an initial property that cannot be updated
      // suppressRowVirtualisation is an initial property that cannot be updated
      // ensureDomOrder is an initial property that cannot be updated
      alwaysShowVerticalScroll: settings.alwaysShowVerticalScroll,
      // Removed: suppressBrowserResizeObserver (deprecated with no effect)
      // enableRtl is an initial property that cannot be updated
      suppressColumnMoveAnimation: settings.suppressColumnMoveAnimation,
      floatingFiltersHeight: settings.floatingFilter ? 35 : 0,
      
      // Data and State
      pagination: settings.pagination,
      paginationPageSize: settings.paginationPageSize,
      // Removed: cacheBlockSize (not valid with clientSide row model)
      // Use cellSelection instead of deprecated enableRangeSelection properties
      cellSelection: settings.cellSelection || {
        handle: settings.enableFillHandle ? 'fill' : 
               (settings.enableRangeHandle ? 'range' : true)
      },
      suppressRowDrag: settings.suppressRowDrag,
      suppressMovableColumns: settings.suppressMovableColumns,
      // Use resetRowDataOnUpdate instead of invalid immutableData/deltaRowDataMode
      resetRowDataOnUpdate: settings.resetRowDataOnUpdate !== undefined ?
                          settings.resetRowDataOnUpdate :
                          !settings.immutableData,
      rowBuffer: settings.rowBuffer,
      rowDragManaged: settings.rowDragManaged,
      // Use asyncTransactionWaitMillis instead of invalid batchUpdateWaitMillis
      asyncTransactionWaitMillis: settings.asyncTransactionWaitMillis !== undefined ?
                                settings.asyncTransactionWaitMillis :
                                settings.batchUpdateWaitMillis,
      
      // Selection - only set valid properties in AG-Grid 33+
      // rowSelection is set directly on the component
      // rowMultiSelectWithClick is handled via rowSelection.enableSelectionWithoutKeys
      
      // Editing
      editType: settings.editType,
      singleClickEdit: settings.singleClickEdit,
      suppressClickEdit: settings.suppressClickEdit,
      // Use valid navigation properties
      enterNavigatesVertically: settings.enterNavigatesVertically !== undefined ? 
                              settings.enterNavigatesVertically : 
                              settings.enterMovesDown,
      enterNavigatesVerticallyAfterEdit: settings.enterNavigatesVerticallyAfterEdit !== undefined ? 
                                      settings.enterNavigatesVerticallyAfterEdit : 
                                      settings.enterMovesDownAfterEdit,
      // undoRedoCellEditing is an initial property that cannot be updated
      // Removed: undoRedoCellEditingLimit (initial property that cannot be updated)
      // Removed: stopEditingWhenCellsLoseFocus (initial property that cannot be updated)
      // Removed: tabNavigatesVertically (invalid property)
      
      // Filtering
      suppressMenuHide: settings.suppressMenuHide,
      quickFilterText: settings.quickFilterText,
      // Removed: cacheQuickFilter (initial property that cannot be updated)
      
      // Appearance
      animateRows: settings.animateRows,
      // Removed: enableBrowserTooltips (initial property that cannot be updated)
      suppressContextMenu: settings.suppressContextMenu,
      // Note: suppressCopyRowsToClipboard/suppressCopySingleCellRanges handled via rowSelection
      enableCellTextSelection: settings.enableCellTextSelection,
      // Use valid flash properties instead of invalid enableCellChangeFlash
      cellFlashDuration: settings.cellFlashDuration !== undefined ? 
                      settings.cellFlashDuration : 
                      (settings.enableCellChangeFlash ? 1000 : 0),
      cellFadeDuration: settings.cellFadeDuration !== undefined ? 
                      settings.cellFadeDuration : 
                      (settings.enableCellChangeFlash ? 500 : 0),
      tooltipShowDelay: settings.tooltipShowDelay,
      tooltipHideDelay: settings.tooltipHideDelay,
      
      // Row Grouping
      groupDefaultExpanded: settings.groupDefaultExpanded,
      groupDisplayType: settings.groupDisplayType,
      // Use valid properties instead of invalid groupIncludeFooter/groupIncludeTotalFooter
      groupTotalRow: settings.groupTotalRow !== undefined ? 
                  settings.groupTotalRow : 
                  settings.groupIncludeFooter,
      grandTotalRow: settings.grandTotalRow !== undefined ? 
                  settings.grandTotalRow : 
                  settings.groupIncludeTotalFooter,
      showOpenedGroup: settings.showOpenedGroup,
      rowGroupPanelShow: settings.rowGroupPanelShow,
      // Removed: enableRowGroup (not valid at grid level, should be in defaultColDef)
      suppressDragLeaveHidesColumns: settings.suppressDragLeaveHidesColumns,
      
      // Sorting
      multiSortKey: settings.multiSortKey,
      accentedSort: settings.accentedSort,
      // Note: unSortIcon moved to defaultColDef
      
      // Export/Import
      suppressCsvExport: settings.suppressCsvExport,
      suppressExcelExport: settings.suppressExcelExport,
      
      // Column Controls
      autoSizePadding: settings.autoSizePadding,
      colResizeDefault: settings.colResizeDefault,
      maintainColumnOrder: settings.maintainColumnOrder,
      
      // Advanced
      enableCharts: settings.enableCharts,
      // Removed: suppressAriaColCount and suppressAriaRowCount (invalid properties)
      
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
    
    // Note: sortingOrder at grid level is deprecated in AG-Grid 33+, 
    // Instead we move it to defaultColDef.sortingOrder (handled in the defaultColDef section below)
    
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
      
      // AG-Grid 33+: Move sortingOrder to defaultColDef
      updatedDefaultColDef.sortingOrder = settings.defaultColSortingOrder || 
                                        settings.sortingOrder || 
                                        ['asc', 'desc', null];
                                        
      // AG-Grid 33+: Move unSortIcon to defaultColDef
      updatedDefaultColDef.unSortIcon = settings.defaultColUnSortIcon || 
                                      settings.unSortIcon || 
                                      false;
      
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
      if (preserveColumnSizes && gridApi && currentColumnState.length > 0) {
        console.log('Restoring column state after applying settings to preserve widths');
        gridApi.applyColumnState({
          state: currentColumnState,
          applyOrder: true
        });
        
        // Log final column widths
        logColumnWidths(gridApi, 'Column widths after restoring column state');
      }
      
      console.log('Grid settings applied successfully' + 
                  (preserveColumnSizes ? ' with width preservation' : ''));

      // Auto-save the updated settings to the current profile
      const filterModel = gridApi.getFilterModel ? gridApi.getFilterModel() : {};
      const sortModel = getSortModelFromColumnState(currentColumnState);
      
      // Use the merged settings when saving to the profile
      saveSettingsToProfile(mergedSettings, currentColumnState);
    } catch (error) {
      console.warn('Error refreshing grid after settings applied', error);
    }
  };

  // Helper function to save settings to the current profile
  const saveSettingsToProfile = (settings: any, columnState: any[]) => {
    if (!gridRef.current || !gridRef.current.api) {
      console.warn('Grid API not available, cannot save settings to profile');
      return;
    }

    // Only save to profile if one is selected
    if (!selectedProfileId) {
      console.log('No profile selected, settings not saved to profile');
      return;
    }

    try {
      const gridApi = gridRef.current.api;
      
      // Get current filter model
      const filterModel = gridApi.getFilterModel ? gridApi.getFilterModel() : {};
      
      // Get sort model from column state
      const sortModel = columnState
        .filter(col => col.sort !== null && col.sort !== undefined)
        .map(col => ({
          colId: col.colId,
          sort: col.sort,
          sortIndex: col.sortIndex
        }));
      
      // Get the current profile to preserve any existing settings
      const currentProfile = profiles.find(p => p.id === selectedProfileId);
      if (!currentProfile) {
        console.warn('Selected profile not found, cannot save settings');
        return;
      }
      
      // Merge current profile settings with new settings
      const mergedSettings = {
        ...currentProfile.settings,  // Start with all existing settings
        ...settings                  // Override with any new settings
      };
      
      console.log('Auto-saving settings to profile:', {
        profileId: selectedProfileId,
        settingsCount: Object.keys(mergedSettings).length,
        columnStateCount: columnState.length,
        hasFilterModel: !!filterModel,
        sortModelCount: sortModel.length
      });
      
      // Use the updateCurrentProfile function directly
      updateCurrentProfile(
        mergedSettings,
        columnState,
        filterModel,
        sortModel
      );
    } catch (error) {
      console.error('Error saving settings to profile:', error);
    }
  };

  // Create a map of grid options from the defaultGridSettings
  const getGridOptionsFromSettings = () => {
    // Create updated defaultColDef with sortingOrder
    const updatedDefaultColDef = {
      ...defaultColDef,
      // Move sortingOrder from grid-level to defaultColDef as per AG-Grid 33+ recommendation
      sortingOrder: gridSettings.sortingOrder || gridSettings.defaultColSortingOrder || ['asc', 'desc', null],
      // Move unSortIcon from grid-level to defaultColDef as per AG-Grid 33+ recommendation
      unSortIcon: gridSettings.unSortIcon || gridSettings.defaultColUnSortIcon || false,
      // In AG-Grid 33+, enableRowGroup should only be used at column level, not grid level
      enableRowGroup: gridSettings.enableRowGroup
    };
    
    // Use type assertion for the entire object to avoid specific property conflicts
    const gridOptions = {
      // Display and Layout
      headerHeight: gridSettings.headerHeight,
      rowHeight: gridSettings.rowHeight,
      domLayout: gridSettings.domLayout,
      suppressRowHoverHighlight: gridSettings.suppressRowHoverHighlight,
      // Use valid suppressCellFocus instead of invalid suppressCellSelection
      suppressCellFocus: gridSettings.suppressCellFocus !== undefined ? 
                        gridSettings.suppressCellFocus :
                        gridSettings.suppressCellSelection,
      // Using separate rowSelection object for selection settings
      suppressScrollOnNewData: gridSettings.suppressScrollOnNewData,
      // These are initial properties that cannot be changed after initialization
      // suppressColumnVirtualisation, suppressRowVirtualisation, ensureDomOrder should only be set on initial mount
      alwaysShowVerticalScroll: gridSettings.alwaysShowVerticalScroll,
      // enableRtl is an initial property that cannot be changed after initialization
      suppressColumnMoveAnimation: gridSettings.suppressColumnMoveAnimation,
      floatingFiltersHeight: gridSettings.floatingFilter ? 35 : 0,
      
      // Data and State
      pagination: gridSettings.pagination,
      paginationPageSize: gridSettings.paginationPageSize,
      // Remove cacheBlockSize (not valid with clientSide row model)
      // Using cellSelection on component props directly
      suppressRowDrag: gridSettings.suppressRowDrag,
      suppressMovableColumns: gridSettings.suppressMovableColumns,
      // Use resetRowDataOnUpdate instead of invalid immutableData/deltaRowDataMode
      resetRowDataOnUpdate: gridSettings.resetRowDataOnUpdate !== undefined ?
                          gridSettings.resetRowDataOnUpdate :
                          !gridSettings.immutableData,
      rowBuffer: gridSettings.rowBuffer,
      rowDragManaged: gridSettings.rowDragManaged,
      // Use asyncTransactionWaitMillis (handled via component props)
      
      // Editing
      editType: gridSettings.editType,
      singleClickEdit: gridSettings.singleClickEdit,
      suppressClickEdit: gridSettings.suppressClickEdit,
      // Using enterNavigatesVertically and enterNavigatesVerticallyAfterEdit directly in component props
      // undoRedoCellEditing is an initial property that should be set only at initialization
      // Initial properties that can't be updated are handled in component props
      
      // Filtering
      suppressMenuHide: gridSettings.suppressMenuHide,
      quickFilterText: gridSettings.quickFilterText,
      // cacheQuickFilter is an initial property handled in component props
      
      // Appearance
      animateRows: gridSettings.animateRows,
      // enableBrowserTooltips is an initial property handled in component props
      suppressContextMenu: gridSettings.suppressContextMenu,
      // Using rowSelection object for copy settings
      enableCellTextSelection: gridSettings.enableCellTextSelection,
      // Cell flash properties handled in component props
      tooltipShowDelay: gridSettings.tooltipShowDelay,
      tooltipHideDelay: gridSettings.tooltipHideDelay,
      
      // Row Grouping
      groupDefaultExpanded: gridSettings.groupDefaultExpanded,
      groupDisplayType: gridSettings.groupDisplayType,
      // Using groupTotalRow and grandTotalRow directly in component props
      showOpenedGroup: gridSettings.showOpenedGroup,
      rowGroupPanelShow: gridSettings.rowGroupPanelShow,
      // removing invalid enableRowGroup (should be in defaultColDef only)
      suppressDragLeaveHidesColumns: gridSettings.suppressDragLeaveHidesColumns,
      
      // Sorting
      multiSortKey: gridSettings.multiSortKey,
      accentedSort: gridSettings.accentedSort,
      // unSortIcon is moved to defaultColDef
      
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
      // Removing invalid suppressAriaColCount and suppressAriaRowCount
      
      // Advanced Filtering
      excludeChildrenWhenTreeDataFiltering: gridSettings.excludeChildrenWhenTreeDataFiltering,
      
      // Set the updated defaultColDef that includes sortingOrder
      defaultColDef: updatedDefaultColDef,
    } as any; // Cast the entire result to avoid TypeScript type issues
    
    return gridOptions;
  };

  // Helper function to validate rowSelection type
  const validateRowSelectionType = (rowSelection: any): boolean => {
    if (!rowSelection) return false;
    if (typeof rowSelection !== 'object') return false;
    if (!rowSelection.type) return false;  // Ensure type exists
    if (rowSelection.type !== 'singleRow' && rowSelection.type !== 'multiRow') return false;
    return true;
  };

  // Debug helper to log column width changes
  const logColumnWidths = (gridApi: any, message: string) => {
    if (!gridApi) return;
    
    try {
      // In AG-Grid 33+, use gridApi.getColumnState()
      const columnState = gridApi.getColumnState ? gridApi.getColumnState() : [];
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

  // Debug logging for rowSelection
  useEffect(() => {
    if (validateRowSelectionType(gridSettings.rowSelection)) {
      console.log('DataTable rowSelection is valid:', gridSettings.rowSelection);
    } else {
      console.warn('DataTable rowSelection is INVALID:', 
        typeof gridSettings.rowSelection === 'object' 
          ? JSON.stringify(gridSettings.rowSelection)
          : gridSettings.rowSelection
      );
      
      // Check specific issues with the rowSelection
      if (!gridSettings.rowSelection) {
        console.warn('rowSelection is null or undefined');
      } else if (typeof gridSettings.rowSelection !== 'object') {
        console.warn('rowSelection is not an object, it is a:', typeof gridSettings.rowSelection);
      } else if (!gridSettings.rowSelection.type) {
        console.warn('rowSelection object is missing "type" property');
      } else if (gridSettings.rowSelection.type !== 'singleRow' && gridSettings.rowSelection.type !== 'multiRow') {
        console.warn('rowSelection.type has invalid value:', gridSettings.rowSelection.type);
      }
      
      console.log('Will use fallback rowSelection:', getValidRowSelection(gridSettings.rowSelection));
    }
  }, [gridSettings.rowSelection]);

  // Add a retry mechanism for initial profile loading
  useEffect(() => {
    if (gridReady && selectedProfileId && gridRef.current?.api) {
      // Check if profile settings are already applied - if not, try again
      const currentSettings = gridRef.current.api.getGridOption('domLayout');
      const selectedProfile = profiles.find(p => p.id === selectedProfileId);
      
      if (selectedProfile?.settings && 
          selectedProfile.settings.domLayout !== currentSettings) {
        
        console.log('Detected settings mismatch, retrying profile load:', {
          profileDomLayout: selectedProfile.settings.domLayout,
          currentDomLayout: currentSettings
        });
        
        // Try loading again with a small delay
        setTimeout(() => {
          (async () => {
            try {
              console.log('Retrying profile load for ID:', selectedProfileId);
              const profile = await loadProfileById(selectedProfileId, gridRef.current?.api);
              if (profile) {
                console.log('Profile successfully loaded on retry:', profile.name);
                
                // Update the gridSettings state with the profile settings
                if (profile.settings) {
                  console.log('Updating gridSettings state from profile loaded on retry');
                  setGridSettings(profile.settings);
                }
              } else {
                console.error('Profile not found or could not be loaded on retry');
              }
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              console.error('Error in retry profile load:', errorMessage);
              toast.error('Error loading profile on retry: ' + errorMessage);
            }
          })();
        }, 100);
      }
    }
  }, [gridReady, selectedProfileId, profiles, loadProfileById]);

  // Debug logging for grid settings changes
  useEffect(() => {
    console.log('gridSettings changed in DataTable:', {
      rowHeight: gridSettings.rowHeight,
      headerHeight: gridSettings.headerHeight,
      domLayout: gridSettings.domLayout,
      floatingFilter: gridSettings.floatingFilter,
      settingsCount: Object.keys(gridSettings).length
    });
  }, [gridSettings]);

  return (
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
              onSettingsChange={setGridSettings}
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
                <DropdownMenuItem onClick={() => {
                  console.log('Opening General Settings with gridSettings:', {
                    rowHeight: gridSettings.rowHeight,
                    headerHeight: gridSettings.headerHeight,
                    domLayout: gridSettings.domLayout,
                    floatingFilter: gridSettings.floatingFilter,
                    settingsCount: Object.keys(gridSettings).length
                  });
                  setSettingsOpen(true);
                }}>
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
        // Use rowSelection object format to avoid deprecation warnings
        rowSelection={getValidRowSelection(gridSettings.rowSelection)}
        // For flash effects - use proper duration properties instead of enableCellChangeFlash
        cellFlashDuration={gridSettings.cellFlashDuration !== undefined 
          ? gridSettings.cellFlashDuration 
          : (gridSettings.enableCellChangeFlash ? 1000 : 0)}
        cellFadeDuration={gridSettings.cellFadeDuration !== undefined 
          ? gridSettings.cellFadeDuration 
          : (gridSettings.enableCellChangeFlash ? 500 : 0)}
        // Use valid grouping options
        groupTotalRow={gridSettings.groupTotalRow !== undefined 
          ? gridSettings.groupTotalRow 
          : gridSettings.groupIncludeFooter}
        grandTotalRow={gridSettings.grandTotalRow !== undefined 
          ? gridSettings.grandTotalRow 
          : gridSettings.groupIncludeTotalFooter}
        // Use proper navigation properties
        enterNavigatesVertically={gridSettings.enterNavigatesVertically !== undefined 
          ? gridSettings.enterNavigatesVertically 
          : gridSettings.enterMovesDown}
        enterNavigatesVerticallyAfterEdit={gridSettings.enterNavigatesVerticallyAfterEdit !== undefined 
          ? gridSettings.enterNavigatesVerticallyAfterEdit 
          : gridSettings.enterMovesDownAfterEdit}
        // Initial properties that should be set only once at initialization
        undoRedoCellEditingLimit={gridSettings.undoRedoCellEditingLimit}
        stopEditingWhenCellsLoseFocus={gridSettings.stopEditingWhenCellsLoseFocus}
        cacheQuickFilter={gridSettings.cacheQuickFilter}
        enableBrowserTooltips={gridSettings.enableBrowserTooltips}
        // Use cellSelection instead of deprecated range properties
        cellSelection={gridSettings.cellSelection || {
          handle: gridSettings.enableFillHandle ? 'fill' : 
                (gridSettings.enableRangeHandle ? 'range' : true)
        }}
        // Use async transaction wait millis instead of batch update wait millis
        asyncTransactionWaitMillis={gridSettings.asyncTransactionWaitMillis !== undefined 
          ? gridSettings.asyncTransactionWaitMillis 
          : gridSettings.batchUpdateWaitMillis}
        // Use cell focus property
        suppressCellFocus={gridSettings.suppressCellFocus !== undefined 
          ? gridSettings.suppressCellFocus 
          : gridSettings.suppressCellSelection}
        // Use the getGridOptionsFromSettings function which handles all other options
        {...getGridOptionsFromSettings()}
      />
    </div>

    <GeneralSettingsDialog
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      onApplySettings={(settings) => handleApplySettings(settings, false)}
      currentSettings={gridSettings}
    />

    <ColumnSettingsDialog
      open={columnSettingsOpen}
      onOpenChange={setColumnSettingsOpen}
      gridRef={gridRef}
      fallbackColumnDefs={columnDefs}
    />
  </div>
);
}
