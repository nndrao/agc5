/**
 * DataTableContext.tsx
 * Central context manager for all ag-Grid configurations and profiles
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GridApi, FilterModel, GridOptions, ColGroupDef, ColDef, Theme } from 'ag-grid-community';
import { ExtendedColumnState } from './ColumnSettings/types';
import { themeQuartz } from 'ag-grid-community';

interface GridSettings {
  // Theme settings
  theme?: Theme;
  // Grid specific settings
  rowHeight?: number;
  headerHeight?: number;
  pivotHeaderHeight?: number;
  pivotGroupHeaderHeight?: number;
  groupDefaultExpanded?: number;
  groupDisplayType?: 'singleColumn' | 'multipleColumns';
  groupTotalRow?: 'top' | 'bottom';
  grandTotalRow?: 'top' | 'bottom';
  showOpenedGroup?: boolean;
  rowGroupPanelShow?: 'never' | 'always' | 'onlyWhenGrouping';
  // Column settings
  defaultColDef?: Partial<ColDef>;
  columnDefs?: (ColDef | ColGroupDef)[];
  // Additional grid options
  [key: string]: unknown;
}

interface GridProfile {
  id: string;
  name: string;
  description?: string;
  settings: GridSettings;
  columnState: ExtendedColumnState[];
  filterModel: FilterModel;
  sortModel: { colId: string; sort: 'asc' | 'desc' | null }[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DataTableState {
  gridApi: GridApi | null;
  columnState: ExtendedColumnState[];
  filterModel: FilterModel;
  sortModel: { colId: string; sort: 'asc' | 'desc' | null }[];
  settings: GridSettings;
  profiles: GridProfile[];
  selectedProfileId: string | null;
  isLoading: boolean;
  error: string | null;
}

type DataTableAction =
  | { type: 'SET_GRID_API'; payload: GridApi }
  | { type: 'UPDATE_COLUMN_STATE'; payload: ExtendedColumnState[] }
  | { type: 'UPDATE_FILTER_MODEL'; payload: FilterModel }
  | { type: 'UPDATE_SORT_MODEL'; payload: { colId: string; sort: 'asc' | 'desc' | null }[] }
  | { type: 'UPDATE_SETTINGS'; payload: GridSettings }
  | { type: 'LOAD_PROFILES_START' }
  | { type: 'LOAD_PROFILES_SUCCESS'; payload: GridProfile[] }
  | { type: 'LOAD_PROFILES_ERROR'; payload: string }
  | { type: 'SELECT_PROFILE'; payload: string }
  | { type: 'APPLY_PROFILE'; payload: GridProfile }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Create theme with default parameters
const defaultTheme = themeQuartz.withParams(
  {
    accentColor: '#8AAAA7',
    backgroundColor: '#F7F7F7',
    borderColor: '#23202029',
    browserColorScheme: 'light',
    buttonBorderRadius: 2,
    cellTextColor: '#000000',
    checkboxBorderRadius: 2,
    columnBorder: true,
    fontFamily: {
      googleFont: 'Inter',
    },
    fontSize: 14,
    headerBackgroundColor: '#EFEFEFD6',
    headerFontFamily: {
      googleFont: 'Inter',
    },
    headerFontSize: 14,
    headerFontWeight: 500,
    iconButtonBorderRadius: 1,
    iconSize: 12,
    inputBorderRadius: 2,
    oddRowBackgroundColor: '#EEF1F1E8',
    spacing: 6,
    wrapperBorderRadius: 2,
  },
  'light'
);

const initialState: DataTableState = {
  gridApi: null,
  columnState: [],
  filterModel: {},
  sortModel: [],
  settings: {
    theme: defaultTheme,
    rowHeight: 40,
    headerHeight: 40,
    pivotHeaderHeight: 40,
    pivotGroupHeaderHeight: 40,
    groupDefaultExpanded: 1,
    groupDisplayType: 'singleColumn',
    groupTotalRow: 'bottom',
    grandTotalRow: 'bottom',
    showOpenedGroup: true,
    rowGroupPanelShow: 'onlyWhenGrouping',
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      filter: true,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
    },
  },
  profiles: [],
  selectedProfileId: null,
  isLoading: false,
  error: null,
};

const DataTableContext = createContext<{
  state: DataTableState;
  updateColumnState: (columnState: ExtendedColumnState[]) => void;
  updateFilterModel: (filterModel: FilterModel) => void;
  updateSortModel: (sortModel: { colId: string; sort: 'asc' | 'desc' | null }[]) => void;
  updateSettings: (settings: GridSettings) => void;
  loadProfiles: () => Promise<void>;
  selectProfile: (profileId: string) => void;
  createProfile: (name: string, description?: string) => Promise<boolean>;
  updateCurrentProfile: () => Promise<boolean>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  setAsDefaultProfile: (profileId: string) => Promise<boolean>;
  applyProfile: (profileId: string, gridApi?: GridApi) => Promise<boolean>;
  setError: (error: string) => void;
  clearError: () => void;
} | undefined>(undefined);

function dataTableReducer(state: DataTableState, action: DataTableAction): DataTableState {
  switch (action.type) {
    case 'SET_GRID_API':
      return { ...state, gridApi: action.payload };
    case 'UPDATE_COLUMN_STATE':
      return { ...state, columnState: action.payload };
    case 'UPDATE_FILTER_MODEL':
      return { ...state, filterModel: action.payload };
    case 'UPDATE_SORT_MODEL':
      return { ...state, sortModel: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    case 'LOAD_PROFILES_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_PROFILES_SUCCESS':
      return { ...state, isLoading: false, profiles: action.payload };
    case 'LOAD_PROFILES_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SELECT_PROFILE':
      return { ...state, selectedProfileId: action.payload };
    case 'APPLY_PROFILE':
      return {
        ...state,
        settings: action.payload.settings,
        columnState: action.payload.columnState,
        filterModel: action.payload.filterModel,
        sortModel: action.payload.sortModel,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function DataTableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataTableReducer, initialState);

  const updateColumnState = (columnState: ExtendedColumnState[]) => {
    dispatch({ type: 'UPDATE_COLUMN_STATE', payload: columnState });
  };

  const updateFilterModel = (filterModel: FilterModel) => {
    dispatch({ type: 'UPDATE_FILTER_MODEL', payload: filterModel });
  };

  const updateSortModel = (sortModel: { colId: string; sort: 'asc' | 'desc' | null }[]) => {
    dispatch({ type: 'UPDATE_SORT_MODEL', payload: sortModel });
  };

  const updateSettings = (settings: GridSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const loadProfiles = async () => {
    dispatch({ type: 'LOAD_PROFILES_START' });
    try {
      // Implementation here
      dispatch({ type: 'LOAD_PROFILES_SUCCESS', payload: [] });
    } catch (error) {
      dispatch({ type: 'LOAD_PROFILES_ERROR', payload: 'Failed to load profiles' });
    }
  };

  const selectProfile = (profileId: string) => {
    dispatch({ type: 'SELECT_PROFILE', payload: profileId });
  };

  const createProfile = async (name: string, description?: string): Promise<boolean> => {
    // Implementation here
    return true;
  };

  const updateCurrentProfile = async (): Promise<boolean> => {
    // Implementation here
    return true;
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    // Implementation here
    return true;
  };

  const setAsDefaultProfile = async (profileId: string): Promise<boolean> => {
    // Implementation here
    return true;
  };

  const applyProfile = async (profileId: string, gridApi?: GridApi): Promise<boolean> => {
    // Implementation here
    return true;
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <DataTableContext.Provider
      value={{
        state,
        updateColumnState,
        updateFilterModel,
        updateSortModel,
        updateSettings,
        loadProfiles,
        selectProfile,
        createProfile,
        updateCurrentProfile,
        deleteProfile,
        setAsDefaultProfile,
        applyProfile,
        setError,
        clearError,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTable() {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context;
}

// Column settings hook
export function useColumnSettings() {
  const context = useDataTable();
  
  return {
    columnState: context.state.columnState,
    settings: context.state.settings,
    updateColumnState: context.updateColumnState,
    updateSettings: context.updateSettings
  };
}

// Profile management hook
export function useGridProfiles() {
  const context = useDataTable();
  
  return {
    profiles: context.state.profiles,
    selectedProfileId: context.state.selectedProfileId,
    loadProfile: context.applyProfile,
    saveCurrentProfile: context.updateCurrentProfile,
    createNewProfile: context.createProfile,
    deleteProfile: context.deleteProfile,
    setAsDefaultProfile: context.setAsDefaultProfile
  };
}

// Filtering hook
export function useFilterSettings() {
  const context = useDataTable();
  
  return {
    filterModel: context.state.filterModel,
    updateFilterModel: context.updateFilterModel
  };
}

// Sorting hook
export function useSortSettings() {
  const context = useDataTable();
  
  return {
    sortModel: context.state.sortModel,
    updateSortModel: context.updateSortModel
  };
}

// Grouping hook
export function useGroupSettings() {
  const context = useDataTable();
  
  // Extract grouping-related settings from state
  const { settings } = context.state;
  
  const updateGroupSettings = (groupSettings: Partial<typeof settings>) => {
    context.updateSettings({
      ...settings,
      ...groupSettings
    });
  };
  
  return {
    groupSettings: {
      groupDefaultExpanded: settings.groupDefaultExpanded,
      groupDisplayType: settings.groupDisplayType,
      groupTotalRow: settings.groupTotalRow,
      grandTotalRow: settings.grandTotalRow,
      showOpenedGroup: settings.showOpenedGroup,
      rowGroupPanelShow: settings.rowGroupPanelShow,
    },
    updateGroupSettings
  };
} 