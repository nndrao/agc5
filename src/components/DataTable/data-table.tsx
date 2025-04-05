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
import { ColumnSettingsDialog } from './ColumnSettings/ColumnSettingsDialog';
import { defaultGridSettings } from "./Settings/defaultSettings";
import { ProfileManagerUI } from "./ProfileManager/ProfileManagerUI.shadcn";
import { getSortModelFromColumnState } from "./ProfileManager/GridStateUtils";
import { NotificationManager } from "./NotificationManager";

import { ModuleRegistry, themeQuartz, GridReadyEvent } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Toaster, toast } from "sonner";
import { useGridStore } from './store/unifiedGridStore';
import { useProfileStore } from './store/profileStore';

// Set AG Grid license key
// Replace with your actual license key or use an environment variable
LicenseManager.setLicenseKey('your_license_key_here');

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
  return <DataTable {...props} />;
}

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  return <DataTableInner data={data} />;
}

// Define default column definitions
const defaultColumnDefs = [
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

function DataTableInner<TData, TValue>({ data }: { data: TData[] }) {
  // Access unified store
  const {
    gridApi,
    columnState,
    filterModel,
    sortModel,
    settings: gridSettings,
    isColumnSettingsOpen,
    isGeneralSettingsOpen,
    selectedProfileId,
    profiles,
    dialogSettings,

    setGridApi,
    setColumnState,
    setFilterModel,
    setSortModel,
    setSettings,
    setDialogSettings,
    setColumnSettingsOpen,
    setGeneralSettingsOpen,
    extractGridState,
    applyGridState,
    saveCurrentProfile,
    selectProfile
  } = useGridStore();

  // Access profile store
  const { updateCurrentProfile } = useProfileStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isApplyingColumnChanges, setApplyingColumnChanges] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = useState(monospacefonts[0]);
  const [gridTheme, setGridTheme] = useState(themeQuartz);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const [gridReady, setGridReady] = useState(false);

  // Add state for column definitions
  const [currentColumnDefs, setCurrentColumnDefs] = useState(defaultColumnDefs);

  // We now use the unified store for profile data

  // Helper function to load a profile by ID
  const loadProfileById = async (profileId: string, gridApi: any, showNotification: boolean = true) => {
    try {
      console.log(`Loading profile with ID: ${profileId}`);

      // Use the selectProfile function from the unified store
      selectProfile(profileId);

      // Find the profile in the profiles array
      const profile = profiles.find(p => p.id === profileId);

      if (!profile) {
        console.error(`Profile with ID ${profileId} not found`);
        throw new Error(`Profile with ID ${profileId} not found`);
      }

      console.log(`Profile loaded: ${profile.name}`);

      // Return the profile
      return profile;
    } catch (error) {
      console.error('Error loading profile:', error);
      throw error;
    }
  };

  // Watch for column settings dialog open/close
  useEffect(() => {
    if (isColumnSettingsOpen) {
      console.log('Column settings dialog opened - disabling auto column updates');
      console.log('Current column definitions (before dialog):', currentColumnDefs);
      // Only set if it's different to avoid loops
      if (isApplyingColumnChanges) {
        setApplyingColumnChanges(false);
      }
    } else {
      // When dialog closes, wait for any pending column changes to complete
      console.log('Column settings dialog closed - waiting for changes to complete');
      console.log('Current column definitions (after dialog):', currentColumnDefs);

      // Use a shorter delay since we're already waiting in the dialog
      const timeoutId = setTimeout(() => {
        console.log('Re-enabling auto column updates after changes complete');
        if (gridRef.current?.api) {
          const gridColumns = gridRef.current.api.getColumnDefs();
          console.log('Grid column definitions:', gridColumns);
        }
        // Commented out to prevent loops
        // setApplyingColumnChanges(true);
      }, 2000); // 2 seconds wait to allow state updates to complete

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [isColumnSettingsOpen, currentColumnDefs, isApplyingColumnChanges]); // Removed setApplyingColumnChanges from deps

  // Initialize grid settings from the selected profile
  // Using a ref to track if we've already loaded this profile
  const loadedProfileRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if conditions aren't met or if we've already loaded this profile
    if (!profiles.length || !selectedProfileId || !gridReady ||
        loadedProfileRef.current === selectedProfileId) {
      if (!gridReady) {
        console.log('Grid not ready yet, waiting before loading profile');
      } else if (!selectedProfileId) {
        console.log('No profile selected, using default grid settings');
      }
      return;
    }

    console.log('Grid is ready and a profile is selected, loading profile data...');

    // Update the ref to track this profile
    loadedProfileRef.current = selectedProfileId;

    // Use the context method to load the profile with the grid API
    if (gridRef.current?.api) {
      // Handle the Promise returned by loadProfileById
      (async () => {
        try {
          console.log('Loading profile with ID:', selectedProfileId);
          // Only show notification for user-initiated profile loads, not automatic ones
          const profile = await loadProfileById(selectedProfileId, gridRef.current?.api, false);
          if (profile) {
            console.log('Profile loaded successfully:', profile.name);

            // Update the gridSettings state with the profile settings
            if (profile.settings) {
              console.log('Updating gridSettings state from loaded profile');
              // Commented out to prevent loops
              // setSettings(profile.settings);
            }
          } else {
            console.error('Profile not found or could not be loaded');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error('Error loading profile:', errorMessage);
          // Don't show toast to prevent potential loops
          // toast.error('Error loading profile: ' + errorMessage);
        }
      })();
    } else {
      // Fallback to just selecting the profile without applying it
      const selectedProfile = profiles.find(p => p.id === selectedProfileId);
      if (selectedProfile?.settings) {
        console.log('Grid API not ready, only initializing settings state from profile:', selectedProfile.name);
        // Commented out to prevent loops
        // setSettings(selectedProfile.settings);
      }
    }
  }, [profiles, selectedProfileId, gridReady]); // Removed loadProfileById from deps

  // Helper function to validate rowSelection type
  const validateRowSelectionType = (rowSelection: any): boolean => {
    if (!rowSelection) return false;
    if (typeof rowSelection !== 'object') return false;
    if (!rowSelection.type) return false;  // Ensure type exists
    if (rowSelection.type !== 'singleRow' && rowSelection.type !== 'multiRow') return false;
    return true;
  };

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
      setSettings(prev => ({
        ...prev,
        rowSelection
      }));
    }
  }, []);

  // Ensure rowSelection is always a valid object
  const getValidRowSelection = (rowSelection: any) => {
    // Validate rowSelection first
    if (!validateRowSelectionType(rowSelection)) {
      // Return default valid rowSelection object
      return {
        type: 'multiRow',
        enableClickSelection: !gridSettings.suppressRowClickSelection,
        enableSelectionWithoutKeys: !!gridSettings.rowMultiSelectWithClick,
        groupSelects: 'descendants',
        copySelectedRows: !gridSettings.suppressCopyRowsToClipboard
      };
    }

    // Always return a properly formatted object with required type property
    return {
      type: (rowSelection?.type === 'singleRow' ? 'singleRow' : 'multiRow') as ('singleRow' | 'multiRow'),
      enableClickSelection: rowSelection?.enableClickSelection !== undefined
        ? rowSelection.enableClickSelection
        : !gridSettings.suppressRowClickSelection,
      enableSelectionWithoutKeys: rowSelection?.enableSelectionWithoutKeys !== undefined
        ? rowSelection.enableSelectionWithoutKeys
        : !!gridSettings.rowMultiSelectWithClick,
      groupSelects: rowSelection?.groupSelects || 'filteredDescendants',
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
    console.log("Grid Ready!");
    setGridReady(true);

    // Store the grid API in our unified store
    setGridApi(params.api);

    // In AG-Grid 33+, columnApi is merged into gridApi
    if (!params.api) {
      console.error("Grid API is undefined in onGridReady");
      return;
    }

    // Apply the current state from the store to the grid
    // This will apply column state, filter model, sort model, and settings
    console.log('Applying grid state from store to grid');
    applyGridState();

    console.log('Grid ready complete');
  };

  // Event handlers for grid events - use AG-Grid 33+ compatible event names
  // Note: We don't automatically update the store when grid state changes
  // The store is only updated when explicitly saving a profile
  const onColumnMoved = (event: any) => {
    console.log('Column moved - not automatically updating store');
    // We don't update the store here
  };

  const onFilterChanged = (event: any) => {
    console.log('Filter changed - not automatically updating store');
    // We don't update the store here
  };

  const onSortChanged = (event: any) => {
    console.log('Sort changed - not automatically updating store');
    // We don't update the store here
  };

  const handleApplySettings = (settings: any, preserveColumnSizes: boolean = false) => {
    console.log(`Applying grid settings (preserveColumnSizes=${preserveColumnSizes}):`, settings);

    // First update the settings in the store
    setSettings(settings);

    // Save the settings to the dialog settings in the store
    // This ensures that the dialog settings are updated when the user applies changes
    setDialogSettings({
      ...dialogSettings,
      generalSettings: settings
    });
    console.log('General settings saved to dialog settings in store');

    // Then apply the settings to the grid
    applyGridState();

    if (!gridRef.current || !gridRef.current.api) {
      console.warn('Grid API not available, cannot apply settings');
      return;
    }
  };

  // Handler for applying column settings changes
  const handleColumnSettingsApply = (updatedColumnDefs: any[]) => {
    console.log('Received updated column definitions from column settings dialog');
    console.log('Number of columns:', updatedColumnDefs.length);

    // Make sure we have valid column definitions
    if (!updatedColumnDefs || !Array.isArray(updatedColumnDefs) || updatedColumnDefs.length === 0) {
      console.error('Invalid column definitions received:', updatedColumnDefs);
      toast.error('Error updating column settings: Invalid column definitions');
      return;
    }

    // Debug the columns we're about to set
    updatedColumnDefs.forEach((col, index) => {
      console.log(`Column ${index}:`, col.field || col.colId, 'headerName:', col.headerName);
    });

    // Update the column definitions state
    setCurrentColumnDefs(updatedColumnDefs);
    console.log('Column definitions state updated');

    // Apply the changes to the AG-Grid instance
    if (gridRef.current?.api) {
      console.log('Applying column definitions to AG-Grid');
      // Set the flag to prevent infinite loops during column changes
      setApplyingColumnChanges(true);

      try {
        // Apply the column definitions to the grid using AG-Grid 33+ API
        gridRef.current.api.setGridOption('columnDefs', updatedColumnDefs);
        console.log('Column definitions applied to AG-Grid successfully');

        // Save the column definitions to the dialog settings in the store
        // This ensures that the dialog settings are updated when the user applies changes
        setDialogSettings({
          ...dialogSettings,
          columnSettings: {
            columnDefs: updatedColumnDefs
          }
        });
        console.log('Column settings saved to dialog settings in store');
      } catch (error) {
        console.error('Error applying column definitions to AG-Grid:', error);
      }

      // Reset the flag after a short delay
      setTimeout(() => {
        setApplyingColumnChanges(false);
      }, 100);
    } else {
      console.warn('Grid API not available, column definitions not applied to AG-Grid');
    }

    // If we have a profile selected, also save these changes to the profile
    if (selectedProfileId && gridRef.current?.api) {
      console.log('Saving column changes to profile:', selectedProfileId);
      // Get the current column state from the grid
      const currentColumnState = gridRef.current.api.getColumnState();

      // Save the settings to the profile
      saveSettingsToProfile(gridSettings, currentColumnState);
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
      // Include dialog settings to ensure they're saved to the profile
      updateCurrentProfile(
        mergedSettings,
        columnState,
        filterModel,
        sortModel,
        dialogSettings // Pass dialog settings to be saved in the profile
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
      // Move sortingOrder from grid-level to defaultColDef as per AG-Grid 33+ requirement
      sortingOrder: gridSettings.sortingOrder || gridSettings.defaultColSortingOrder || ['asc', 'desc', null],
      // Move unSortIcon from grid-level to defaultColDef as per AG-Grid 33+ requirement
      unSortIcon: gridSettings.unSortIcon || gridSettings.defaultColUnSortIcon || false,
      // In AG-Grid 33+, enableRowGroup must only be used at column level, not grid level
      enableRowGroup: gridSettings.enableRowGroup
    };

    // Use type assertion for the entire object to avoid specific property conflicts
    const gridOptions = {
      // Display and Layout
      headerHeight: gridSettings.headerHeight,
      rowHeight: gridSettings.rowHeight,
      domLayout: gridSettings.domLayout,
      suppressRowHoverHighlight: gridSettings.suppressRowHoverHighlight,
      columnHoverHighlight: gridSettings.columnHoverHighlight,
      suppressCellFocus: gridSettings.suppressCellFocus,
      suppressScrollOnNewData: gridSettings.suppressScrollOnNewData,
      alwaysShowVerticalScroll: gridSettings.alwaysShowVerticalScroll,
      suppressColumnMoveAnimation: gridSettings.suppressColumnMoveAnimation,
      floatingFiltersHeight: gridSettings.floatingFilter ? 35 : 0,

      // Accessibility settings
      suppressColumnVirtualisation: gridSettings.suppressColumnVirtualisation,
      suppressRowVirtualisation: gridSettings.suppressRowVirtualisation,
      ensureDomOrder: gridSettings.ensureDomOrder,

      // Overlay settings
      overlayNoRowsTemplate: gridSettings.overlayNoRowsTemplate || 'No rows to display',
      overlayLoadingTemplate: gridSettings.overlayLoadingTemplate || 'Loading...',

      // Row Model
      rowModelType: gridSettings.rowModelType || 'clientSide',
      serverSideStoreType: gridSettings.rowModelType === 'serverSide' ?
                          (gridSettings.serverSideStoreType || 'partial') :
                          undefined,

      // Data and State
      pagination: gridSettings.pagination,
      paginationPageSize: gridSettings.paginationPageSize,
      paginationAutoPageSize: gridSettings.paginationAutoPageSize,

      // Selection
      rowSelection: gridSettings.rowSelection || 'none',
      suppressRowClickSelection: gridSettings.suppressRowClickSelection,

      // Row Drag & Drop
      suppressRowDrag: gridSettings.suppressRowDrag,
      rowDragManaged: gridSettings.rowDragManaged,
      suppressMovableColumns: gridSettings.suppressMovableColumns,

      // Data Management
      resetRowDataOnUpdate: gridSettings.resetRowDataOnUpdate,
      rowBuffer: gridSettings.rowBuffer,
      asyncTransactionWaitMillis: gridSettings.asyncTransactionWaitMillis,
      suppressPropertyNamesCheck: gridSettings.suppressPropertyNamesCheck,

      // Clipboard
      enableClipboard: gridSettings.enableClipboard,
      clipboardDelimiter: gridSettings.clipboardDelimiter,
      suppressCopyRowsToClipboard: gridSettings.suppressCopyRowsToClipboard,
      suppressLastEmptyLineOnPaste: gridSettings.suppressLastEmptyLineOnPaste,

      // Editing
      editType: gridSettings.editType,
      singleClickEdit: gridSettings.singleClickEdit,
      suppressClickEdit: gridSettings.suppressClickEdit,
      enterNavigatesVertically: gridSettings.enterNavigatesVertically,
      enterNavigatesVerticallyAfterEdit: gridSettings.enterNavigatesVerticallyAfterEdit,
      stopEditingWhenCellsLoseFocus: gridSettings.stopEditingWhenCellsLoseFocus,

      // Filtering
      suppressMenuHide: gridSettings.suppressMenuHide,
      quickFilterText: gridSettings.quickFilterText,
      cacheQuickFilter: gridSettings.cacheQuickFilter,
      floatingFilter: gridSettings.floatingFilter,

      // Appearance
      animateRows: gridSettings.animateRows,
      enableBrowserTooltips: gridSettings.enableBrowserTooltips,
      suppressContextMenu: gridSettings.suppressContextMenu,
      enableCellTextSelection: gridSettings.enableCellTextSelection,
      cellFlashDuration: gridSettings.cellFlashDuration,
      cellFadeDuration: gridSettings.cellFadeDuration,
      tooltipShowDelay: gridSettings.tooltipShowDelay,
      tooltipHideDelay: gridSettings.tooltipHideDelay,

      // Row Grouping
      groupDefaultExpanded: gridSettings.groupDefaultExpanded,
      groupDisplayType: gridSettings.groupDisplayType,
      groupTotalRow: gridSettings.groupTotalRow,
      grandTotalRow: gridSettings.grandTotalRow,
      showOpenedGroup: gridSettings.showOpenedGroup,
      rowGroupPanelShow: gridSettings.rowGroupPanelShow,
      suppressDragLeaveHidesColumns: gridSettings.suppressDragLeaveHidesColumns,

      // Sorting
      multiSortKey: gridSettings.multiSortKey,
      accentedSort: gridSettings.accentedSort,
      unSortIcon: gridSettings.unSortIcon,

      // Localization
      locale: gridSettings.locale,

      // Export/Import
      suppressCsvExport: gridSettings.suppressCsvExport,
      suppressExcelExport: gridSettings.suppressExcelExport,

      // Column Controls
      autoSizePadding: gridSettings.autoSizePadding,
      colResizeDefault: gridSettings.colResizeDefault === 'shift' ? 'shift' : undefined,
      maintainColumnOrder: gridSettings.maintainColumnOrder,

      // Advanced
      enableCharts: gridSettings.enableCharts,
      excludeChildrenWhenTreeDataFiltering: gridSettings.excludeChildrenWhenTreeDataFiltering,
      // Removing invalid suppressAriaColCount and suppressAriaRowCount

      // Set the updated defaultColDef that includes sortingOrder
      defaultColDef: updatedDefaultColDef,
    } as any; // Cast the entire result to avoid TypeScript type issues

    return gridOptions;
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
  // Using a ref to track if we've already retried this profile
  const retriedProfileRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if conditions aren't met or if we've already retried this profile
    if (!gridReady || !selectedProfileId || !gridRef.current?.api ||
        retriedProfileRef.current === selectedProfileId) {
      return;
    }

    // Check if profile settings are already applied - if not, try again
    const currentSettings = gridRef.current.api.getGridOption('domLayout');
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);

    if (selectedProfile?.settings &&
        selectedProfile.settings.domLayout !== currentSettings) {

      console.log('Detected settings mismatch, retrying profile load:', {
        profileDomLayout: selectedProfile.settings.domLayout,
        currentDomLayout: currentSettings
      });

      // Update the ref to track this retry
      retriedProfileRef.current = selectedProfileId;

      // Try loading again with a small delay
      const timeoutId = setTimeout(() => {
        (async () => {
          try {
            console.log('Retrying profile load for ID:', selectedProfileId);
            // Don't show notification for retry profile loads
            const profile = await loadProfileById(selectedProfileId, gridRef.current?.api, false);
            if (profile) {
              console.log('Profile successfully loaded on retry:', profile.name);

              // Update the gridSettings state with the profile settings
              if (profile.settings) {
                console.log('Updating gridSettings state from profile loaded on retry');
                // Commented out to prevent loops
                // setSettings(profile.settings);
              }
            } else {
              console.error('Profile not found or could not be loaded on retry');
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('Error in retry profile load:', errorMessage);
            // Don't show toast to prevent potential loops
            // toast.error('Error loading profile on retry: ' + errorMessage);
          }
        })();
      }, 100);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [gridReady, selectedProfileId, profiles]); // Removed loadProfileById from deps

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

  // We don't need column resize event handlers
  // Column state is only saved when explicitly saving a profile

  // We don't need grid size change event handlers either
  // Column state is only saved when explicitly saving a profile

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
                <DropdownMenuItem onClick={() => {
                  // Only open column settings if grid is ready
                  if (gridRef.current?.api) {
                    setColumnSettingsOpen(true);
                  } else {
                    console.warn('Grid API not ready yet, cannot open column settings');
                  }
                }}>
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
        columnDefs={currentColumnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        sideBar={true}
        onGridReady={onGridReady}
        // We don't automatically update the store when grid state changes
        // The store is only updated when explicitly saving a profile
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
      open={isColumnSettingsOpen}
      onOpenChange={setColumnSettingsOpen}
      gridApi={gridRef.current?.api}
      onApplySettings={handleColumnSettingsApply}
    />
  </div>
);
}
