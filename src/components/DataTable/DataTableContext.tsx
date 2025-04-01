/**
 * DataTableContext.tsx
 * Central context manager for all ag-Grid configurations and profiles
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GridApi } from 'ag-grid-community';
import { GridSettings } from './Settings/types';
import { defaultGridSettings } from './Settings/defaultSettings';
import { ProfileService } from './ProfileService';

// Define core types for the context
export interface GridProfile {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  settings: GridSettings;
  columnState: any[];       // Column widths, visibility, order, etc.
  filterModel?: any;        // Current filter state
  sortModel?: any[];        // Current sort state
  createdAt: string;
  updatedAt: string;
}

// State interface for the DataTable context
interface DataTableState {
  // Profile state
  profiles: GridProfile[];
  selectedProfileId: string | null;
  
  // Grid configuration state
  settings: GridSettings;
  columnState: any[];
  filterModel: any;
  sortModel: any[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;
}

// Initial state
const initialState: DataTableState = {
  profiles: [],
  selectedProfileId: null,
  settings: defaultGridSettings,
  columnState: [],
  filterModel: {},
  sortModel: [],
  isLoading: false,
  error: null,
  notification: null
};

// Action types
type ActionType =
  // Profile actions
  | { type: 'LOAD_PROFILES_START' }
  | { type: 'LOAD_PROFILES_SUCCESS'; payload: { profiles: GridProfile[]; defaultProfileId: string | null } }
  | { type: 'LOAD_PROFILES_ERROR'; payload: string }
  | { type: 'SELECT_PROFILE'; payload: string }
  | { type: 'CREATE_PROFILE'; payload: GridProfile }
  | { type: 'UPDATE_PROFILE'; payload: GridProfile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SET_DEFAULT_PROFILE'; payload: string }
  
  // Grid configuration actions
  | { type: 'UPDATE_SETTINGS'; payload: GridSettings }
  | { type: 'UPDATE_COLUMN_STATE'; payload: any[] }
  | { type: 'UPDATE_FILTER_MODEL'; payload: any }
  | { type: 'UPDATE_SORT_MODEL'; payload: any[] }
  | { type: 'APPLY_PROFILE'; payload: GridProfile }
  
  // UI actions
  | { type: 'SET_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info' | null; message: string } }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer function
const dataTableReducer = (state: DataTableState, action: ActionType): DataTableState => {
  switch (action.type) {
    // Profile actions
    case 'LOAD_PROFILES_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOAD_PROFILES_SUCCESS':
      return {
        ...state,
        profiles: action.payload.profiles,
        selectedProfileId: action.payload.defaultProfileId,
        isLoading: false
      };
    
    case 'LOAD_PROFILES_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    
    case 'SELECT_PROFILE':
      return {
        ...state,
        selectedProfileId: action.payload
      };
    
    case 'CREATE_PROFILE':
      return {
        ...state,
        profiles: [...state.profiles, action.payload],
        selectedProfileId: action.payload.id,
        notification: { type: 'success', message: 'Profile created successfully' }
      };
    
    case 'UPDATE_PROFILE': {
      const updatedProfiles = state.profiles.map(profile =>
        profile.id === action.payload.id ? action.payload : profile
      );
      
      return {
        ...state,
        profiles: updatedProfiles,
        notification: { type: 'success', message: 'Profile updated successfully' }
      };
    }
    
    case 'DELETE_PROFILE': {
      const updatedProfiles = state.profiles.filter(profile => profile.id !== action.payload);
      const defaultProfile = updatedProfiles.find(p => p.isDefault) || updatedProfiles[0];
      
      return {
        ...state,
        profiles: updatedProfiles,
        selectedProfileId: defaultProfile?.id || null,
        notification: { type: 'success', message: 'Profile deleted successfully' }
      };
    }
    
    case 'SET_DEFAULT_PROFILE': {
      const updatedProfiles = state.profiles.map(profile => ({
        ...profile,
        isDefault: profile.id === action.payload
      }));
      
      return {
        ...state,
        profiles: updatedProfiles,
        notification: { type: 'success', message: 'Default profile set successfully' }
      };
    }
    
    // Grid configuration actions
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload
      };
    
    case 'UPDATE_COLUMN_STATE':
      return {
        ...state,
        columnState: action.payload
      };
    
    case 'UPDATE_FILTER_MODEL':
      return {
        ...state,
        filterModel: action.payload
      };
    
    case 'UPDATE_SORT_MODEL':
      return {
        ...state,
        sortModel: action.payload
      };
    
    case 'APPLY_PROFILE': {
      const profile = action.payload;
      
      return {
        ...state,
        settings: profile.settings || defaultGridSettings,
        columnState: profile.columnState || [],
        filterModel: profile.filterModel || {},
        sortModel: profile.sortModel || [],
        selectedProfileId: profile.id
      };
    }
    
    // UI actions
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      };
    
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create the context
interface DataTableContextType extends DataTableState {
  // Profile methods
  loadProfiles: () => Promise<void>;
  selectProfile: (profileId: string) => void;
  createProfile: (name: string, description: string) => Promise<boolean>;
  updateCurrentProfile: () => Promise<boolean>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  setAsDefaultProfile: (profileId: string) => Promise<boolean>;
  
  // Grid state methods
  updateSettings: (settings: GridSettings) => void;
  updateColumnState: (columnState: any[]) => void;
  updateFilterModel: (filterModel: any) => void;
  updateSortModel: (sortModel: any[]) => void;
  applyProfile: (profileId: string, gridApi?: GridApi) => Promise<boolean>;
  
  // UI methods
  clearNotification: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// Create the context with a default value
const DataTableContext = createContext<DataTableContextType>({
  ...initialState,
  loadProfiles: async () => {},
  selectProfile: () => {},
  createProfile: async () => false,
  updateCurrentProfile: async () => false,
  deleteProfile: async () => false,
  setAsDefaultProfile: async () => false,
  updateSettings: () => {},
  updateColumnState: () => {},
  updateFilterModel: () => {},
  updateSortModel: () => {},
  applyProfile: async () => false,
  clearNotification: () => {},
  setError: () => {},
  clearError: () => {}
});

// Provider component
export function DataTableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataTableReducer, initialState);
  
  // Instantiate the profile service
  const profileService = new ProfileService();
  
  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
    
    // Auto-clear notifications after 5 seconds
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.notification]);
  
  /**
   * Load all profiles from storage
   */
  const loadProfiles = async () => {
    dispatch({ type: 'LOAD_PROFILES_START' });
    
    try {
      const profiles = await profileService.getProfiles();
      const defaultProfile = profiles.find(p => p.isDefault) || profiles[0];
      
      dispatch({
        type: 'LOAD_PROFILES_SUCCESS',
        payload: {
          profiles,
          defaultProfileId: defaultProfile?.id || null
        }
      });
      
      // If a default profile exists, apply it
      if (defaultProfile) {
        dispatch({ type: 'APPLY_PROFILE', payload: defaultProfile });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'LOAD_PROFILES_ERROR', payload: errorMessage });
    }
  };
  
  /**
   * Select a profile by ID (without applying it)
   */
  const selectProfile = (profileId: string) => {
    dispatch({ type: 'SELECT_PROFILE', payload: profileId });
  };
  
  /**
   * Create a new profile with current grid state
   */
  const createProfile = async (name: string, description: string): Promise<boolean> => {
    try {
      if (!name.trim()) {
        dispatch({ type: 'SET_ERROR', payload: 'Profile name is required' });
        return false;
      }
      
      // Check for duplicate name
      if (state.profiles.some(profile => profile.name.toLowerCase() === name.trim().toLowerCase())) {
        dispatch({ type: 'SET_ERROR', payload: 'A profile with this name already exists' });
        return false;
      }
      
      const newProfile = await profileService.createProfile(
        name,
        description,
        state.settings,
        state.columnState,
        state.filterModel,
        state.sortModel
      );
      
      dispatch({ type: 'CREATE_PROFILE', payload: newProfile });
      
      // Persist profiles
      await profileService.saveProfiles([...state.profiles, newProfile]);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };
  
  /**
   * Update the current profile with current grid state
   */
  const updateCurrentProfile = async (): Promise<boolean> => {
    try {
      if (!state.selectedProfileId) {
        dispatch({ type: 'SET_ERROR', payload: 'No profile selected' });
        return false;
      }
      
      const currentProfile = state.profiles.find(p => p.id === state.selectedProfileId);
      if (!currentProfile) {
        dispatch({ type: 'SET_ERROR', payload: 'Selected profile not found' });
        return false;
      }
      
      const updatedProfile = await profileService.updateProfile(
        currentProfile,
        state.settings,
        state.columnState,
        state.filterModel,
        state.sortModel
      );
      
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
      
      // Persist profiles
      const updatedProfiles = state.profiles.map(p => 
        p.id === state.selectedProfileId ? updatedProfile : p
      );
      
      await profileService.saveProfiles(updatedProfiles);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };
  
  /**
   * Delete a profile by ID
   */
  const deleteProfile = async (profileId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'DELETE_PROFILE', payload: profileId });
      
      // Persist profiles
      const updatedProfiles = state.profiles.filter(p => p.id !== profileId);
      await profileService.saveProfiles(updatedProfiles);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };
  
  /**
   * Set a profile as the default
   */
  const setAsDefaultProfile = async (profileId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_DEFAULT_PROFILE', payload: profileId });
      
      // Persist profiles
      const updatedProfiles = state.profiles.map(profile => ({
        ...profile,
        isDefault: profile.id === profileId
      }));
      
      await profileService.saveProfiles(updatedProfiles);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };
  
  /**
   * Update grid settings
   */
  const updateSettings = (settings: GridSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };
  
  /**
   * Update column state in context
   */
  const updateColumnState = (columnState: any[]) => {
    console.log('DATA TABLE CONTEXT: Updating column state with', columnState.length, 'columns');
    
    // Ensure the column state has all necessary properties before dispatching
    const enhancedColumnState = columnState.map(col => {
      // Make sure each column state entry has required fields
      return {
        ...col,
        colId: col.colId || col.field,
        width: col.width || undefined,
        hide: typeof col.hide === 'boolean' ? col.hide : false,
        pinned: col.pinned || null,
        sort: col.sort || null,
        sortIndex: col.sortIndex !== undefined ? col.sortIndex : null
      };
    });
    
    dispatch({ type: 'UPDATE_COLUMN_STATE', payload: enhancedColumnState });
    
    // Auto-update the profile if one is selected (optional for immediate persistence)
    // But skip if we're in the middle of applying column changes to avoid cycles
    if (state.selectedProfileId && !(window as any).__AG_GRID_APPLYING_COLUMN_CHANGES) {
      // Capture the current value of the flag for reference
      const isApplyingChanges = (window as any).__AG_GRID_APPLYING_COLUMN_CHANGES;
      console.log('Scheduling profile auto-save with isApplyingChanges =', isApplyingChanges);
      
      // Use a longer delay to ensure column settings dialog has finished its work
      setTimeout(() => {
        // Double-check the flag again just before saving, in case it changed during the timeout
        if ((window as any).__AG_GRID_APPLYING_COLUMN_CHANGES) {
          console.log('Cancelling auto-save because column changes are in progress');
          return;
        }
        
        updateCurrentProfile()
          .then(success => {
            if (success) {
              console.log('Auto-saved column state to profile', state.selectedProfileId);
            }
          })
          .catch(err => console.error('Failed to auto-save column state:', err));
      }, 2000); // Increased delay to ensure it happens after column changes are complete
    } else if ((window as any).__AG_GRID_APPLYING_COLUMN_CHANGES) {
      console.log('Skipping profile auto-save because column changes are in progress');
    }
  };
  
  /**
   * Update filter model
   */
  const updateFilterModel = (filterModel: any) => {
    dispatch({ type: 'UPDATE_FILTER_MODEL', payload: filterModel });
  };
  
  /**
   * Update sort model
   */
  const updateSortModel = (sortModel: any[]) => {
    dispatch({ type: 'UPDATE_SORT_MODEL', payload: sortModel });
  };
  
  /**
   * Apply a profile to the grid
   */
  const applyProfile = async (profileId: string, gridApi?: GridApi): Promise<boolean> => {
    try {
      const profile = state.profiles.find(p => p.id === profileId);
      if (!profile) {
        dispatch({ type: 'SET_ERROR', payload: 'Profile not found' });
        return false;
      }
      
      // Update context state
      dispatch({ type: 'APPLY_PROFILE', payload: profile });
      
      // If grid API is provided, apply the profile directly to the grid
      if (gridApi) {
        // Apply column state
        if (profile.columnState && profile.columnState.length > 0) {
          gridApi.applyColumnState({
            state: profile.columnState,
            applyOrder: true
          });
        }
        
        // Apply filter model
        if (profile.filterModel) {
          gridApi.setFilterModel(profile.filterModel);
        }
        
        // Apply sort model
        if (profile.sortModel && profile.sortModel.length > 0) {
          gridApi.setSortModel(profile.sortModel);
        }
        
        // Apply settings
        // This would ideally use a helper utility to map settings to grid properties
        // For simplicity, we assume that the settings are already in the format 
        // that the grid expects, but in a real implementation you'd use a mapper
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };
  
  /**
   * Clear notification
   */
  const clearNotification = () => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  };
  
  /**
   * Set error
   */
  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  
  /**
   * Clear error
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };
  
  // Create context value
  const contextValue: DataTableContextType = {
    ...state,
    loadProfiles,
    selectProfile,
    createProfile,
    updateCurrentProfile,
    deleteProfile,
    setAsDefaultProfile,
    updateSettings,
    updateColumnState,
    updateFilterModel,
    updateSortModel,
    applyProfile,
    clearNotification,
    setError,
    clearError
  };
  
  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}

// Custom hook for using the DataTable context
export function useDataTableContext() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within a DataTableProvider');
  }
  return context;
}

// Column settings hook
export function useColumnSettings() {
  const context = useDataTableContext();
  
  return {
    columnState: context.columnState,
    settings: context.settings,
    updateColumnState: context.updateColumnState,
    updateSettings: context.updateSettings
  };
}

// Profile management hook
export function useGridProfiles() {
  const context = useDataTableContext();
  
  return {
    profiles: context.profiles,
    selectedProfileId: context.selectedProfileId,
    loadProfile: context.applyProfile,
    saveCurrentProfile: context.updateCurrentProfile,
    createNewProfile: context.createProfile,
    deleteProfile: context.deleteProfile,
    setAsDefaultProfile: context.setAsDefaultProfile
  };
}

// Filtering hook
export function useFilterSettings() {
  const context = useDataTableContext();
  
  return {
    filterModel: context.filterModel,
    updateFilterModel: context.updateFilterModel
  };
}

// Sorting hook
export function useSortSettings() {
  const context = useDataTableContext();
  
  return {
    sortModel: context.sortModel,
    updateSortModel: context.updateSortModel
  };
}

// Grouping hook
export function useGroupSettings() {
  const context = useDataTableContext();
  
  // Extract grouping-related settings
  const { settings, updateSettings } = context;
  
  const updateGroupSettings = (groupSettings: Partial<typeof settings>) => {
    updateSettings({
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