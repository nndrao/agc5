/**
 * Unified Grid Store for AG-Grid
 * Single source of truth for all grid state, settings, and profiles
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { defaultGridSettings } from '../Settings/defaultSettings';

interface GridState {
  // AG-Grid API reference (not persisted)
  gridApi: any | null;

  // AG-Grid state
  columnState: any[];
  filterModel: any;
  sortModel: any[];

  // AG-Grid settings
  settings: {
    rowHeight: number;
    headerHeight: number;
    pagination: boolean;
    paginationPageSize: number;
    domLayout: string;
    // ... other AG-Grid settings
    [key: string]: any;
  };

  // Dialog settings
  dialogSettings: {
    // General settings dialog
    generalSettings: {
      // ... settings specific to the general settings dialog
      [key: string]: any;
    };

    // Column settings dialog
    columnSettings: {
      // ... settings specific to the column settings dialog
      [key: string]: any;
    };
  };

  // Profile management
  profiles: Array<{
    id: string;
    name: string;
    description?: string;
    isDefault?: boolean;
    columnState: any[];
    filterModel: any;
    sortModel: any[];
    settings: any;
    dialogSettings: any;
    createdAt: string;
    updatedAt: string;
  }>;
  selectedProfileId: string | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;
  isGeneralSettingsOpen: boolean;
  isColumnSettingsOpen: boolean;
  selectedColumnId: string | null;
}

interface GridActions {
  // Grid API
  setGridApi: (api: any) => void;

  // Update grid state (only called explicitly, never automatically)
  setColumnState: (state: any[]) => void;
  setFilterModel: (model: any) => void;
  setSortModel: (model: any[]) => void;
  setSettings: (settings: any) => void;

  // Extract current state from AG-Grid (used when saving profiles)
  extractGridState: () => {
    columnState: any[];
    filterModel: any;
    sortModel: any[];
    settings: any;
  };

  // Apply state to AG-Grid (used when loading profiles)
  applyGridState: () => void;

  // Dialog settings
  setGeneralSettings: (settings: any) => void;
  setColumnSettings: (settings: any) => void;

  // Dialog visibility
  setGeneralSettingsOpen: (open: boolean) => void;
  setColumnSettingsOpen: (open: boolean) => void;
  setSelectedColumnId: (id: string | null) => void;

  // Profile management
  loadProfiles: () => void;
  selectProfile: (profileId: string) => void;
  createProfile: (name: string, description?: string) => void;
  saveCurrentProfile: () => void;
  deleteProfile: (profileId: string) => void;
  setDefaultProfile: (profileId: string) => void;

  // Notifications
  setNotification: (notification: { type: 'success' | 'error' | 'info'; message: string }) => void;
  clearNotification: () => void;
}

export const useGridStore = create<GridState & GridActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        gridApi: null,
        columnState: [],
        filterModel: {},
        sortModel: [],
        settings: {
          ...defaultGridSettings,
        },
        dialogSettings: {
          generalSettings: {},
          columnSettings: {},
        },
        profiles: [],
        selectedProfileId: null,
        isLoading: false,
        error: null,
        notification: null,
        isGeneralSettingsOpen: false,
        isColumnSettingsOpen: false,
        selectedColumnId: null,

        // Grid API
        setGridApi: (api) => set({ gridApi: api }),

        // Update grid state (only called explicitly)
        setColumnState: (state) => set({ columnState: state }),
        setFilterModel: (model) => set({ filterModel: model }),
        setSortModel: (model) => set({ sortModel: model }),
        setSettings: (settings) => set({
          settings: { ...get().settings, ...settings }
        }),

        // Extract current state from AG-Grid
        extractGridState: () => {
          const { gridApi } = get();
          if (!gridApi) {
            console.warn('Cannot extract grid state: gridApi is null');
            return {
              columnState: [],
              filterModel: {},
              sortModel: [],
              settings: {}
            };
          }

          console.log('Extracting grid state from AG-Grid');

          // Get the latest column state from the grid
          const columnState = gridApi.getColumnState();

          // Log column state for debugging
          console.log('Extracted column state:');
          columnState.forEach((col: any) => {
            console.log(`Column ${col.colId}: width=${col.width}, flex=${col.flex}`);
          });

          // Use AG-Grid 33+ compatible API calls
          return {
            columnState: columnState,
            filterModel: gridApi.getGridOption('filterModel') || {},
            sortModel: gridApi.getGridOption('sortModel') || [],
            settings: {
              // Extract current settings from gridApi using getGridOption
              rowHeight: gridApi.getGridOption('rowHeight'),
              headerHeight: gridApi.getGridOption('headerHeight'),
              pagination: gridApi.getGridOption('pagination'),
              paginationPageSize: gridApi.getGridOption('paginationPageSize'),
              domLayout: gridApi.getGridOption('domLayout'),
              // ... other settings
            }
          };
        },

        // Apply state to AG-Grid
        applyGridState: () => {
          const { gridApi, columnState, filterModel, sortModel, settings, dialogSettings } = get();
          if (!gridApi) {
            console.warn('Cannot apply grid state: gridApi is null');
            return;
          }

          console.log('Applying grid state to AG-Grid');

          // Apply dialog settings if available
          if (dialogSettings) {
            console.log('Applying dialog settings:', dialogSettings);

            // Apply column settings if available
            if (dialogSettings.columnSettings && dialogSettings.columnSettings.columnDefs) {
              console.log('Applying column definitions from dialog settings');
              gridApi.setGridOption('columnDefs', dialogSettings.columnSettings.columnDefs);
            }

            // Apply general settings if available
            if (dialogSettings.generalSettings) {
              console.log('Applying general settings from dialog settings');
              // Apply each general setting individually
              Object.entries(dialogSettings.generalSettings).forEach(([key, value]) => {
                gridApi.setGridOption(key, value);
              });
            }
          }

          // Apply settings using setGridOption for AG-Grid 33+ compatibility
          if (settings.rowHeight) gridApi.setGridOption('rowHeight', settings.rowHeight);
          if (settings.headerHeight) gridApi.setGridOption('headerHeight', settings.headerHeight);
          if (settings.pagination !== undefined) gridApi.setGridOption('pagination', settings.pagination);
          if (settings.paginationPageSize) gridApi.setGridOption('paginationPageSize', settings.paginationPageSize);
          if (settings.domLayout) gridApi.setGridOption('domLayout', settings.domLayout);
          // ... apply other settings

          // Apply column state
          if (columnState && columnState.length > 0) {
            gridApi.applyColumnState({
              state: columnState,
              applyOrder: true
            });
          }

          // Apply filter model - use setGridOption for AG-Grid 33+ compatibility
          if (filterModel && Object.keys(filterModel).length > 0) {
            gridApi.setGridOption('filterModel', filterModel);
          }

          // Apply sort model - use setGridOption for AG-Grid 33+ compatibility
          if (sortModel && sortModel.length > 0) {
            gridApi.setGridOption('sortModel', sortModel);
          }

          // Refresh the grid - use API methods that are available in AG-Grid 33+
          if (typeof gridApi.refreshCells === 'function') {
            gridApi.refreshCells({ force: true });
          }
          if (typeof gridApi.refreshHeader === 'function') {
            gridApi.refreshHeader();
          }
        },

        // Dialog settings
        setGeneralSettings: (settings) => set({
          dialogSettings: {
            ...get().dialogSettings,
            generalSettings: {
              ...get().dialogSettings.generalSettings,
              ...settings
            }
          }
        }),

        setColumnSettings: (settings) => set({
          dialogSettings: {
            ...get().dialogSettings,
            columnSettings: {
              ...get().dialogSettings.columnSettings,
              ...settings
            }
          }
        }),

        // Dialog visibility
        setGeneralSettingsOpen: (open) => set({ isGeneralSettingsOpen: open }),
        setColumnSettingsOpen: (open) => set({ isColumnSettingsOpen: open }),
        setSelectedColumnId: (id) => set({ selectedColumnId: id }),

        // Profile management
        loadProfiles: () => {
          set({ isLoading: true });

          try {
            // Load profiles from localStorage
            const profilesJson = localStorage.getItem('ag-grid-profiles');
            if (!profilesJson) {
              set({
                profiles: [],
                selectedProfileId: null,
                isLoading: false
              });
              return;
            }

            const profiles = JSON.parse(profilesJson);

            // Find default profile
            const defaultProfile = profiles.find(p => p.isDefault) || profiles[0];

            set({
              profiles,
              selectedProfileId: defaultProfile?.id || null,
              isLoading: false
            });

            // If a default profile exists, load it
            if (defaultProfile) {
              // Update store with profile data
              set({
                columnState: defaultProfile.columnState || [],
                filterModel: defaultProfile.filterModel || {},
                sortModel: defaultProfile.sortModel || [],
                settings: { ...get().settings, ...defaultProfile.settings },
                dialogSettings: { ...get().dialogSettings, ...defaultProfile.dialogSettings }
              });

              // Apply to grid if API is available
              const { gridApi } = get();
              if (gridApi) {
                get().applyGridState();
              }
            }
          } catch (error) {
            console.error('Error loading profiles:', error);
            set({
              error: 'Failed to load profiles',
              isLoading: false,
              notification: { type: 'error', message: 'Failed to load profiles' }
            });
          }
        },

        selectProfile: (profileId) => {
          const { profiles } = get();
          const profile = profiles.find(p => p.id === profileId);

          if (!profile) {
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
            return;
          }

          console.log(`Selecting profile: ${profile.name}`);

          // Clear existing state and set new state from profile
          set({
            selectedProfileId: profileId,
            columnState: profile.columnState || [],
            filterModel: profile.filterModel || {},
            sortModel: profile.sortModel || [],
            settings: { ...get().settings, ...profile.settings },
            dialogSettings: { ...get().dialogSettings, ...profile.dialogSettings },
            notification: { type: 'success', message: `Profile "${profile.name}" loaded` }
          });

          // Apply to grid if API is available
          const { gridApi } = get();
          if (gridApi) {
            get().applyGridState();
          }
        },

        createProfile: (name, description) => {
          if (!name.trim()) {
            set({
              error: 'Profile name is required',
              notification: { type: 'error', message: 'Profile name is required' }
            });
            return;
          }

          const { profiles } = get();

          // Check for duplicate name
          if (profiles.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
            set({
              error: 'A profile with this name already exists',
              notification: { type: 'error', message: 'A profile with this name already exists' }
            });
            return;
          }

          // Extract current grid state
          const gridState = get().extractGridState();
          const { dialogSettings } = get();

          // Create new profile
          const now = new Date().toISOString();
          const newProfile = {
            id: uuidv4(),
            name: name.trim(),
            description: description?.trim(),
            isDefault: profiles.length === 0, // First profile is default
            columnState: gridState.columnState,
            filterModel: gridState.filterModel,
            sortModel: gridState.sortModel,
            settings: gridState.settings,
            dialogSettings,
            createdAt: now,
            updatedAt: now
          };

          const updatedProfiles = [...profiles, newProfile];

          // Save to localStorage
          try {
            localStorage.setItem('ag-grid-profiles', JSON.stringify(updatedProfiles));

            set({
              profiles: updatedProfiles,
              selectedProfileId: newProfile.id,
              notification: { type: 'success', message: `Profile "${newProfile.name}" created` }
            });
          } catch (error) {
            console.error('Error saving profiles:', error);
            set({
              error: 'Failed to save profile',
              notification: { type: 'error', message: 'Failed to save profile' }
            });
          }
        },

        saveCurrentProfile: () => {
          const { selectedProfileId, profiles, gridApi } = get();

          if (!selectedProfileId) {
            set({
              error: 'No profile selected',
              notification: { type: 'error', message: 'No profile selected' }
            });
            return;
          }

          const currentProfile = profiles.find(p => p.id === selectedProfileId);
          if (!currentProfile) {
            set({
              error: 'Selected profile not found',
              notification: { type: 'error', message: 'Selected profile not found' }
            });
            return;
          }

          if (!gridApi) {
            set({
              error: 'Grid API not available',
              notification: { type: 'error', message: 'Grid API not available' }
            });
            return;
          }

          // Extract current grid state
          const gridState = get().extractGridState();
          const { dialogSettings } = get();

          console.log('Saving current profile with extracted grid state');
          console.log('Column state being saved:');
          gridState.columnState.forEach((col: any) => {
            console.log(`Column ${col.colId}: width=${col.width}, flex=${col.flex}`);
          });

          // Update profile
          const updatedProfile = {
            ...currentProfile,
            columnState: gridState.columnState,
            filterModel: gridState.filterModel,
            sortModel: gridState.sortModel,
            settings: { ...currentProfile.settings, ...gridState.settings },
            dialogSettings,
            updatedAt: new Date().toISOString()
          };

          const updatedProfiles = profiles.map(p =>
            p.id === selectedProfileId ? updatedProfile : p
          );

          // Save to localStorage
          try {
            localStorage.setItem('ag-grid-profiles', JSON.stringify(updatedProfiles));

            set({
              profiles: updatedProfiles,
              notification: { type: 'success', message: `Profile "${updatedProfile.name}" updated` }
            });

            console.log(`Profile "${updatedProfile.name}" saved successfully`);
          } catch (error) {
            console.error('Error saving profiles:', error);
            set({
              error: 'Failed to update profile',
              notification: { type: 'error', message: 'Failed to update profile' }
            });
          }
        },

        deleteProfile: (profileId) => {
          const { profiles, selectedProfileId } = get();

          // Prevent removing the last profile
          if (profiles.length <= 1) {
            set({
              error: 'Cannot remove the last profile',
              notification: { type: 'error', message: 'Cannot remove the last profile' }
            });
            return;
          }

          const profileToRemove = profiles.find(p => p.id === profileId);
          if (!profileToRemove) {
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
            return;
          }

          const updatedProfiles = profiles.filter(p => p.id !== profileId);

          // If removing the selected profile, select another one
          let newSelectedProfileId = selectedProfileId;
          if (selectedProfileId === profileId) {
            // Find default profile or first available
            const defaultProfile = updatedProfiles.find(p => p.isDefault) || updatedProfiles[0];
            newSelectedProfileId = defaultProfile.id;
          }

          // Save to localStorage
          try {
            localStorage.setItem('ag-grid-profiles', JSON.stringify(updatedProfiles));

            set({
              profiles: updatedProfiles,
              selectedProfileId: newSelectedProfileId,
              notification: { type: 'success', message: `Profile "${profileToRemove.name}" removed` }
            });

            // If we changed the selected profile, load it
            if (newSelectedProfileId !== selectedProfileId) {
              get().selectProfile(newSelectedProfileId);
            }
          } catch (error) {
            console.error('Error saving profiles:', error);
            set({
              error: 'Failed to remove profile',
              notification: { type: 'error', message: 'Failed to remove profile' }
            });
          }
        },

        setDefaultProfile: (profileId) => {
          const { profiles } = get();

          const profileToSetAsDefault = profiles.find(p => p.id === profileId);
          if (!profileToSetAsDefault) {
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
            return;
          }

          // Update all profiles
          const updatedProfiles = profiles.map(p => ({
            ...p,
            isDefault: p.id === profileId
          }));

          // Save to localStorage
          try {
            localStorage.setItem('ag-grid-profiles', JSON.stringify(updatedProfiles));

            set({
              profiles: updatedProfiles,
              notification: { type: 'success', message: `Profile "${profileToSetAsDefault.name}" set as default` }
            });
          } catch (error) {
            console.error('Error saving profiles:', error);
            set({
              error: 'Failed to set default profile',
              notification: { type: 'error', message: 'Failed to set default profile' }
            });
          }
        },

        // Notifications
        setNotification: (notification) => {
          // Only set notification if it's different from the current one
          const currentNotification = get().notification;
          if (!currentNotification ||
              currentNotification.message !== notification.message ||
              currentNotification.type !== notification.type) {
            set({ notification });
          }
        },
        clearNotification: () => {
          // Only clear if there's a notification to clear
          if (get().notification) {
            set({ notification: null });
          }
        }
      }),
      {
        name: 'grid-store',
        // Only persist profiles to avoid issues with serializing complex objects
        partialize: (state) => ({
          profiles: state.profiles,
          selectedProfileId: state.selectedProfileId
        })
      }
    )
  )
);
