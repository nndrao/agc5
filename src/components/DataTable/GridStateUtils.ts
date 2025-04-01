/**
 * GridStateUtils.ts
 * Utility functions for working with ag-Grid state
 */

import { GridApi } from 'ag-grid-community';
import { GridSettings } from './Settings/types';
import { SettingsService } from './SettingsService';

interface LoadProfileResult {
  success: boolean;
  stage?: 'settings' | 'columns' | 'filters' | 'sorting';
  error?: any;
}

/**
 * Utility class for managing grid state
 */
export class GridStateUtils {
  private settingsService: SettingsService;
  
  constructor() {
    this.settingsService = new SettingsService();
  }
  
  /**
   * Load a profile into the grid in stages
   */
  loadProfileInStages(
    gridApi: GridApi,
    settings: GridSettings,
    columnState: any[],
    filterModel: any,
    sortModel: any[]
  ): LoadProfileResult {
    try {
      // Stage 1: Apply settings
      const settingsApplied = this.applySettings(gridApi, settings);
      if (!settingsApplied.success) {
        return settingsApplied;
      }
      
      // Stage 2: Apply column state (if provided)
      if (columnState && columnState.length > 0) {
        const columnsApplied = this.applyColumnState(gridApi, columnState);
        if (!columnsApplied.success) {
          return columnsApplied;
        }
      }
      
      // Stage 3: Apply filter model (if provided)
      if (filterModel && Object.keys(filterModel).length > 0) {
        const filtersApplied = this.applyFilterModel(gridApi, filterModel);
        if (!filtersApplied.success) {
          return filtersApplied;
        }
      }
      
      // Stage 4: Apply sort model (if provided)
      if (sortModel && sortModel.length > 0) {
        const sortingApplied = this.applySortModel(gridApi, sortModel);
        if (!sortingApplied.success) {
          return sortingApplied;
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error loading profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Apply settings to the grid
   */
  private applySettings(
    gridApi: GridApi,
    settings: GridSettings
  ): LoadProfileResult {
    try {
      const success = this.settingsService.applySettingsToGrid(settings, gridApi);
      return { 
        success, 
        stage: 'settings',
        error: success ? undefined : 'Failed to apply settings'
      };
    } catch (error) {
      console.error('Error applying settings:', error);
      return { 
        success: false, 
        stage: 'settings', 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Apply column state to the grid
   */
  private applyColumnState(
    gridApi: GridApi,
    columnState: any[]
  ): LoadProfileResult {
    try {
      gridApi.applyColumnState({
        state: columnState,
        applyOrder: true
      });
      
      return { success: true, stage: 'columns' };
    } catch (error) {
      console.error('Error applying column state:', error);
      return { 
        success: false, 
        stage: 'columns', 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Apply filter model to the grid
   */
  private applyFilterModel(
    gridApi: GridApi,
    filterModel: any
  ): LoadProfileResult {
    try {
      gridApi.setFilterModel(filterModel);
      return { success: true, stage: 'filters' };
    } catch (error) {
      console.error('Error applying filter model:', error);
      return { 
        success: false, 
        stage: 'filters', 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Apply sort model to the grid
   */
  private applySortModel(
    gridApi: GridApi,
    sortModel: any[]
  ): LoadProfileResult {
    try {
      gridApi.setSortModel(sortModel);
      return { success: true, stage: 'sorting' };
    } catch (error) {
      console.error('Error applying sort model:', error);
      return { 
        success: false, 
        stage: 'sorting', 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Capture the current state of the grid
   */
  captureGridState(gridApi: GridApi): {
    columnState: any[];
    filterModel: any;
    sortModel: any[];
  } {
    const columnState = gridApi.getColumnState();
    const filterModel = gridApi.getFilterModel();
    const sortModel = gridApi.getSortModel();
    
    return {
      columnState,
      filterModel,
      sortModel
    };
  }
}

// Create and export a singleton instance for easier imports
export const gridStateUtils = new GridStateUtils(); 