/**
 * SettingsService.ts
 * Service for managing and applying grid settings
 */

import { GridApi } from 'ag-grid-community';
import { GridSettings, defaultGridSettings } from './Settings/types';

export class SettingsService {
  /**
   * Apply settings to the grid API
   */
  applySettingsToGrid(settings: GridSettings, gridApi: GridApi): boolean {
    try {
      if (!gridApi) {
        console.error('Cannot apply settings: Grid API is not available');
        return false;
      }
      
      // Create a settings map with valid ag-Grid properties
      const gridSettingsMap = this.createGridSettingsMap(settings);
      
      // Apply each valid setting to the grid API
      Object.entries(gridSettingsMap).forEach(([key, value]) => {
        // Skip undefined values
        if (value === undefined) return;
        
        // Use the setGridOption method in AG-Grid 33+
        try {
          gridApi.setGridOption(key, value);
        } catch (error) {
          console.warn(`Failed to set grid option: ${key}`, error);
        }
      });
      
      // Update default column definitions if they changed
      if (settings.defaultColDef || this.hasDefaultColDefChanges(settings)) {
        const updatedDefaultColDef = this.createDefaultColDef(settings);
        // Use gridApi instead of columnApi in AG-Grid 33+
        gridApi.setGridOption('defaultColDef', updatedDefaultColDef);
      }
      
      return true;
    } catch (error) {
      console.error('Error applying settings to grid:', error);
      return false;
    }
  }
  
  /**
   * Check if any default column definition settings have changed
   */
  private hasDefaultColDefChanges(settings: GridSettings): boolean {
    const defaultColDefProperties = [
      'defaultColEditable',
      'defaultColResizable',
      'defaultColSortable',
      'defaultColFilter',
      'defaultColFilterParams',
      'defaultColFlex',
      'defaultColMinWidth',
      'defaultColMaxWidth',
      'defaultColAutoHeight',
      'defaultColWrapText',
      'defaultColCellStyle',
      'defaultColSortingOrder',
      'defaultColUnSortIcon',
      'floatingFilter'
    ];
    
    // Check if any of the default column definition properties have changed
    return defaultColDefProperties.some(prop => 
      settings[prop as keyof GridSettings] !== defaultGridSettings[prop as keyof GridSettings]
    );
  }
  
  /**
   * Create a default column definition object from settings
   */
  private createDefaultColDef(settings: GridSettings): any {
    return {
      flex: settings.defaultColFlex || 1,
      minWidth: settings.defaultColMinWidth || 100,
      maxWidth: settings.defaultColMaxWidth || undefined,
      filter: settings.defaultColFilter !== undefined ? settings.defaultColFilter : true,
      filterParams: settings.defaultColFilterParams || undefined,
      editable: settings.defaultColEditable !== undefined ? settings.defaultColEditable : true,
      resizable: settings.defaultColResizable !== undefined ? settings.defaultColResizable : true,
      sortable: settings.defaultColSortable !== undefined ? settings.defaultColSortable : true,
      floatingFilter: settings.floatingFilter !== undefined ? settings.floatingFilter : false,
      enableRowGroup: settings.enableRowGroup !== undefined ? settings.enableRowGroup : true,
      enableValue: true,
      enablePivot: true,
      autoHeight: settings.defaultColAutoHeight || false,
      wrapText: settings.defaultColWrapText || false,
      cellStyle: settings.defaultColCellStyle || undefined,
      // In AG-Grid 33+, these properties should be in defaultColDef, not at grid level
      sortingOrder: settings.defaultColSortingOrder || settings.sortingOrder || ['asc', 'desc', null],
      unSortIcon: settings.defaultColUnSortIcon || settings.unSortIcon || false,
    };
  }
  
  /**
   * Create a map of valid grid settings properties
   */
  private createGridSettingsMap(settings: GridSettings): Record<string, any> {
    return {
      // Display and Layout
      headerHeight: settings.headerHeight,
      rowHeight: settings.rowHeight,
      domLayout: settings.domLayout,
      suppressRowHoverHighlight: settings.suppressRowHoverHighlight,
      // Use suppressCellFocus instead of invalid suppressCellSelection
      suppressCellFocus: settings.suppressCellFocus !== undefined ? 
                       settings.suppressCellFocus : 
                       settings.suppressCellSelection,
      suppressScrollOnNewData: settings.suppressScrollOnNewData,
      // Skip properties that cannot be updated after initialization:
      // suppressColumnVirtualisation, suppressRowVirtualisation, ensureDomOrder
      alwaysShowVerticalScroll: settings.alwaysShowVerticalScroll,
      // Skip enableRtl (initial property that cannot be updated)
      suppressColumnMoveAnimation: settings.suppressColumnMoveAnimation,
      floatingFiltersHeight: settings.floatingFilter ? 35 : 0,
      
      // Data and State
      pagination: settings.pagination,
      paginationPageSize: settings.paginationPageSize,
      // Skip cacheBlockSize (not valid with clientSide row model)
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
      
      // Selection - convert deprecated string format to object format
      rowSelection: this.getValidRowSelection(settings.rowSelection),
      
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
      // Skip undoRedoCellEditing (initial property that cannot be updated)
      // Skip undoRedoCellEditingLimit (initial property that cannot be updated)
      // Skip stopEditingWhenCellsLoseFocus (initial property that cannot be updated)
      
      // Filtering
      suppressMenuHide: settings.suppressMenuHide,
      quickFilterText: settings.quickFilterText,
      // Skip cacheQuickFilter (initial property that cannot be updated)
      
      // Appearance
      animateRows: settings.animateRows,
      // Skip enableBrowserTooltips (initial property that cannot be updated)
      suppressContextMenu: settings.suppressContextMenu,
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
      // Skip enableRowGroup (should be in defaultColDef only)
      suppressDragLeaveHidesColumns: settings.suppressDragLeaveHidesColumns,
      
      // Sorting
      multiSortKey: settings.multiSortKey,
      accentedSort: settings.accentedSort,
      // Skip sortingOrder and unSortIcon (moved to defaultColDef)
      
      // Export/Import
      suppressCsvExport: settings.suppressCsvExport,
      suppressExcelExport: settings.suppressExcelExport,
      
      // Column Controls
      autoSizePadding: settings.autoSizePadding,
      colResizeDefault: settings.colResizeDefault,
      maintainColumnOrder: settings.maintainColumnOrder,
      
      // Advanced
      enableCharts: settings.enableCharts,
      // Skip invalid suppressAriaColCount and suppressAriaRowCount
      
      // Advanced Filtering
      excludeChildrenWhenTreeDataFiltering: settings.excludeChildrenWhenTreeDataFiltering,
    };
  }
  
  /**
   * Convert rowSelection to valid format
   */
  private getValidRowSelection(rowSelection: any): any {
    // If it's already a valid object with type, return it
    if (rowSelection && typeof rowSelection === 'object' && rowSelection.type) {
      return rowSelection;
    }
    
    // Handle legacy string values
    if (typeof rowSelection === 'string') {
      // Convert 'single'/'multiple' to 'singleRow'/'multiRow'
      const type = rowSelection === 'single' || rowSelection === 'singleRow' 
        ? 'singleRow' 
        : 'multiRow';
      
      return { type };
    }
    
    // Default to multi-row selection
    return { type: 'multiRow' };
  }
  
  /**
   * Validate settings object against default settings
   */
  validateSettings(settings: Partial<GridSettings>): GridSettings {
    // Create a new settings object with defaults for missing properties
    const validatedSettings = { ...defaultGridSettings };
    
    // Only copy valid properties from the input settings
    Object.keys(settings).forEach(key => {
      if (key in defaultGridSettings) {
        (validatedSettings as any)[key] = (settings as any)[key];
      }
    });
    
    return validatedSettings;
  }
  
  /**
   * Merge partial settings with existing settings
   */
  mergeSettings(currentSettings: GridSettings, partialSettings: Partial<GridSettings>): GridSettings {
    return {
      ...currentSettings,
      ...partialSettings
    };
  }
} 