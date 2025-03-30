import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MonitorSmartphone,
  Database,
  MousePointer2,
  Edit3,
  Filter,
  Palette,
  FolderKanban,
  ArrowDownWideNarrow,
  Settings2,
  Save,
  X,
  Download,
  Columns as ColumnsIcon,
  BarChart4,
  TableProperties
} from "lucide-react";
import { useState, useEffect } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import {
  DisplaySection,
  DataSection,
  SelectionSection,
  EditingSection,
  FilteringSection,
  AppearanceSection,
  GroupingSection,
  SortingSection,
  ExportSection,
  ColumnControlSection,
  AdvancedSection,
  DefaultColumnSection,
} from "./sections";
import type { GridSettings } from "./types";
import { cn } from "@/lib/utils";

const sections = [
  { id: 'display', icon: MonitorSmartphone, label: 'Display & Layout', description: 'Configure visual layout and display options' },
  { id: 'data', icon: Database, label: 'Data & State', description: 'Manage data handling and state persistence' },
  { id: 'selection', icon: MousePointer2, label: 'Selection', description: 'Set up row and cell selection behavior' },
  { id: 'editing', icon: Edit3, label: 'Editing', description: 'Configure cell editing and validation' },
  { id: 'filtering', icon: Filter, label: 'Filtering', description: 'Customize filtering and search options' },
  { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Adjust visual styling and themes' },
  { id: 'grouping', icon: FolderKanban, label: 'Row Grouping', description: 'Set up row grouping and aggregation' },
  { id: 'sorting', icon: ArrowDownWideNarrow, label: 'Sorting', description: 'Configure sorting behavior and options' },
  { id: 'defaultcol', icon: TableProperties, label: 'Default Columns', description: 'Set default properties for all columns' },
  { id: 'export', icon: Download, label: 'Export/Import', description: 'Configure data export and import options' },
  { id: 'columns', icon: ColumnsIcon, label: 'Column Controls', description: 'Configure column behavior and sizing' },
  { id: 'advanced', icon: BarChart4, label: 'Advanced', description: 'Configure advanced and enterprise features' },
];

interface GeneralSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySettings?: (settings: GridSettings) => void;
  currentSettings?: GridSettings;
}

export function GeneralSettingsDialog({ 
  open, 
  onOpenChange,
  onApplySettings,
  currentSettings
}: GeneralSettingsDialogProps) {
  const [activeSection, setActiveSection] = useState('display');
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState<GridSettings>({
    // Display and Layout
    rowHeight: 48,
    headerHeight: 45,
    pivotHeaderHeight: 32,
    pivotGroupHeaderHeight: 32,
    floatingFiltersHeight: 32,
    suppressRowHoverHighlight: false,
    suppressCellFocus: false,
    suppressRowClickSelection: false,
    suppressScrollOnNewData: false,
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
    domLayout: 'normal',
    ensureDomOrder: false,
    alwaysShowVerticalScroll: false,
    enableRtl: false,
    suppressColumnMoveAnimation: false,

    // Data and State
    pagination: true,
    paginationPageSize: 100,
    cellSelection: {
      handle: 'fill'
    },
    enableRangeSelection: true,
    enableRangeHandle: true,
    enableFillHandle: true,
    suppressRowDrag: false,
    suppressMovableColumns: false,
    resetRowDataOnUpdate: true,
    immutableData: false,
    rowBuffer: 10,
    rowDragManaged: false,
    asyncTransactionWaitMillis: 50,
    batchUpdateWaitMillis: 50,

    // Selection - use object format as recommended in AG-Grid 33+
    rowSelection: {
      type: 'multiRow',
      enableSelectionWithoutKeys: false,
      enableClickSelection: true,
      groupSelects: 'filteredDescendants',
      copySelectedRows: true
    },
    rowMultiSelectWithClick: false,

    // Editing
    editType: 'doubleClick',
    singleClickEdit: false,
    suppressClickEdit: false,
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    enterMovesDown: true,
    enterMovesDownAfterEdit: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 10,
    stopEditingWhenCellsLoseFocus: true,

    // Filtering
    floatingFilter: true,
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
    cellFlashDuration: 1000,
    cellFadeDuration: 500,
    enableCellChangeFlash: true,
    tooltipShowDelay: 1000,
    tooltipHideDelay: 10000,

    // Row Grouping
    groupDefaultExpanded: 0,
    groupDisplayType: 'groupRows',
    groupTotalRow: false,
    grandTotalRow: false,
    groupIncludeFooter: false,
    groupIncludeTotalFooter: false,
    showOpenedGroup: true,
    rowGroupPanelShow: 'always',
    enableRowGroup: true,
    suppressDragLeaveHidesColumns: false,

    // Sorting
    sortingOrder: ['asc', 'desc', null] as ('asc' | 'desc' | null)[],
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
    defaultColSortingOrder: ['asc', 'desc', null] as ('asc' | 'desc' | null)[],
    defaultColUnSortIcon: false,
  });

  useEffect(() => {
    if (currentSettings) {
      console.log('currentSettings prop changed, updating dialog settings:', {
        rowHeight: currentSettings.rowHeight,
        headerHeight: currentSettings.headerHeight,
        domLayout: currentSettings.domLayout,
        floatingFilter: currentSettings.floatingFilter,
        settingsCount: Object.keys(currentSettings).length
      });
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Reset hasChanges and update settings when dialog opens
  useEffect(() => {
    if (open && currentSettings) {
      console.log('GeneralSettingsDialog opened, initializing with current settings:', {
        rowHeight: currentSettings.rowHeight,
        headerHeight: currentSettings.headerHeight,
        domLayout: currentSettings.domLayout,
        floatingFilter: currentSettings.floatingFilter,
        settingsCount: Object.keys(currentSettings).length
      });
      setSettings(currentSettings);
      setHasChanges(false);
    }
  }, [open, currentSettings]);

  const handleSettingChange = <K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleApply = () => {
    console.log('Saving and applying settings to grid and current profile...');
    onApplySettings?.(settings);
    setHasChanges(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      // TODO: Show confirmation dialog
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        // Reset back to current settings when closing without saving
        if (currentSettings) {
          setSettings(currentSettings);
        }
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'display':
        return <DisplaySection settings={settings} onSettingChange={handleSettingChange} />;
      case 'data':
        return <DataSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'selection':
        return <SelectionSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'editing':
        return <EditingSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'filtering':
        return <FilteringSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'appearance':
        return <AppearanceSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'grouping':
        return <GroupingSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'sorting':
        return <SortingSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'defaultcol':
        return <DefaultColumnSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'export':
        return <ExportSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'columns':
        return <ColumnControlSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'advanced':
        return <AdvancedSection settings={settings} onSettingChange={handleSettingChange} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[900px] p-0 backdrop-blur-sm">
        <DialogHeader className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border-b dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <DialogTitle className="text-[14px] font-semibold text-foreground">
                {currentSection?.label || 'Grid Settings'}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex h-[600px] rounded-lg overflow-hidden border-0">
          <SettingsSidebar
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 flex flex-col">
            {/* Content */}
            <ScrollArea className="flex-1 min-h-0 bg-white dark:bg-gray-900">
              <div className="p-5 text-[14px]">
                {renderSectionContent()}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between py-3 px-4 border-t dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:bg-gray-800 dark:bg-none shadow-sm">
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-[14px] py-0 px-2 rounded-md">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  size="sm"
                  className="text-[14px]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApply}
                  size="sm"
                  disabled={!hasChanges}
                  className="text-[14px] bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-3 w-3" />
                  Save & Apply to Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}