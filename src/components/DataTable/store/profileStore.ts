/**
 * Profile store for AG-Grid
 * Manages profiles using Zustand instead of React Context
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GridSettings } from '../Settings/types';
import {
  GridProfile,
  getProfiles,
  saveProfiles,
  createProfile as createProfileService,
  updateProfile as updateProfileService,
  deleteProfile as deleteProfileService,
  getDefaultProfile
} from '../ProfileManager/ProfileService';

interface ProfileState {
  // Profile state
  profiles: GridProfile[];
  selectedProfileId: string | null;
  isLoading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;

  // Actions
  loadProfiles: () => Promise<void>;
  selectProfile: (profileId: string) => void;
  loadProfileById: (profileId: string, gridApi?: any, showNotification?: boolean) => Promise<GridProfile | null>;
  createNewProfile: (
    name: string,
    description: string,
    settings: GridSettings,
    columnState: any[],
    filterModel: any,
    sortModel: any[]
  ) => boolean;
  updateCurrentProfile: (
    settings: GridSettings,
    columnState: any[],
    filterModel: any,
    sortModel: any[],
    dialogSettings?: any
  ) => boolean;
  removeProfile: (profileId: string) => boolean;
  setAsDefaultProfile: (profileId: string) => boolean;
  clearNotification: () => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      // Initial state
      profiles: [],
      selectedProfileId: null,
      isLoading: true,
      error: null,
      notification: null,

      // Load profiles from storage
      loadProfiles: async () => {
        set({ isLoading: true, error: null });

        try {
          const loadedProfiles = getProfiles();

          if (loadedProfiles.length === 0) {
            set({
              profiles: [],
              selectedProfileId: null,
              isLoading: false
            });
            return;
          }

          // Find default profile
          const defaultProfile = getDefaultProfile(loadedProfiles);

          set({
            profiles: loadedProfiles,
            selectedProfileId: defaultProfile?.id || loadedProfiles[0].id,
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading profiles:', error);
          set({
            error: 'Failed to load profiles',
            isLoading: false
          });
        }
      },

      // Select a profile
      selectProfile: (profileId) => {
        set({ selectedProfileId: profileId });
      },

      // Load a profile by ID
      loadProfileById: async (profileId, gridApi, showNotification = true) => {
        const { profiles } = get();
        const profile = profiles.find(p => p.id === profileId);

        if (!profile) {
          // Only set error without notification for automatic loads
          if (!showNotification) {
            set({ error: 'Profile not found' });
          } else {
            // Only show notification for user-initiated loads
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
          }
          return null;
        }

        // If a grid API is provided, apply the profile
        if (gridApi) {
          console.log(`Directly applying profile to grid: ${profile.name}`);
          try {
            // Apply settings
            if (profile.settings) {
              // Apply settings that can be updated after initialization
              if (profile.settings.headerHeight !== undefined) {
                gridApi.setHeaderHeight(profile.settings.headerHeight);
              }

              if (profile.settings.rowHeight !== undefined) {
                gridApi.setRowHeight(profile.settings.rowHeight);
              }

              // Pagination
              if (profile.settings.pagination !== undefined) {
                gridApi.setPagination(profile.settings.pagination);
              }

              if (profile.settings.paginationPageSize !== undefined) {
                gridApi.setPaginationPageSize(profile.settings.paginationPageSize);
              }
            }

            // Apply column state
            if (profile.columnState && profile.columnState.length > 0) {
              gridApi.applyColumnState({
                state: profile.columnState,
                applyOrder: true
              });
            }

            // Apply filter model
            if (profile.filterModel && Object.keys(profile.filterModel).length > 0) {
              gridApi.setFilterModel(profile.filterModel);
            }

            // Apply sort model
            if (profile.sortModel && profile.sortModel.length > 0) {
              gridApi.setSortModel(profile.sortModel);
            }

            // Refresh the grid
            gridApi.refreshCells({ force: true });
            gridApi.refreshHeader();
          } catch (error) {
            console.error('Failed to apply profile to grid:', error);
            // Only set error without notification for automatic loads
            if (!showNotification) {
              set({ error: 'Failed to apply profile to grid' });
            } else {
              // Only show notification for user-initiated loads
              set({
                error: 'Failed to apply profile to grid',
                notification: { type: 'error', message: 'Failed to apply profile to grid' }
              });
            }
          }
        }

        console.log(`Setting profile ${profile.name} with showNotification=${showNotification}`);

        // Only set the selectedProfileId without notification for automatic loads
        if (!showNotification) {
          set({ selectedProfileId: profileId });
        } else {
          // Only show notification for user-initiated loads
          set({
            selectedProfileId: profileId,
            notification: { type: 'success', message: `Profile "${profile.name}" loaded successfully` }
          });
        }

        return profile;
      },

      // Create a new profile
      createNewProfile: (
        name,
        description,
        settings,
        columnState,
        filterModel,
        sortModel
      ) => {
        try {
          if (!name.trim()) {
            set({
              error: 'Profile name is required',
              notification: { type: 'error', message: 'Profile name is required' }
            });
            return false;
          }

          const { profiles } = get();

          // Check for duplicate name
          if (profiles.some(profile => profile.name.toLowerCase() === name.trim().toLowerCase())) {
            set({
              error: 'A profile with this name already exists',
              notification: { type: 'error', message: 'A profile with this name already exists' }
            });
            return false;
          }

          const newProfile = createProfileService(
            name,
            description,
            settings,
            columnState,
            filterModel,
            sortModel
          );

          const updatedProfiles = [...profiles, newProfile];

          // Save to localStorage
          const saveResult = saveProfiles(updatedProfiles);

          set({
            profiles: updatedProfiles,
            selectedProfileId: newProfile.id,
            notification: {
              type: 'success',
              message: saveResult
                ? 'Profile created successfully'
                : 'Profile created but could not be saved to storage'
            }
          });

          return true;
        } catch (error) {
          console.error('Error creating profile:', error);
          set({
            error: 'Failed to create profile',
            notification: { type: 'error', message: 'Failed to create profile' }
          });
          return false;
        }
      },

      // Update the current profile
      updateCurrentProfile: (
        settings,
        columnState,
        filterModel,
        sortModel,
        dialogSettings
      ) => {
        try {
          const { selectedProfileId, profiles } = get();

          if (!selectedProfileId) {
            set({
              error: 'No profile selected',
              notification: { type: 'error', message: 'No profile selected' }
            });
            return false;
          }

          const currentProfile = profiles.find(p => p.id === selectedProfileId);
          if (!currentProfile) {
            set({
              error: 'Selected profile not found',
              notification: { type: 'error', message: 'Selected profile not found' }
            });
            return false;
          }

          const updatedProfile = updateProfileService(
            currentProfile,
            settings,
            columnState,
            filterModel,
            sortModel,
            dialogSettings // Pass dialog settings to be saved in the profile
          );

          const updatedProfiles = profiles.map(p =>
            p.id === selectedProfileId ? updatedProfile : p
          );

          // Save to localStorage
          const saveResult = saveProfiles(updatedProfiles);

          set({
            profiles: updatedProfiles,
            notification: {
              type: 'success',
              message: saveResult
                ? `Profile "${updatedProfile.name}" updated successfully`
                : `Profile updated but could not be saved to storage`
            }
          });

          return true;
        } catch (error) {
          console.error('Error updating profile:', error);
          set({
            error: 'Failed to update profile',
            notification: { type: 'error', message: 'Failed to update profile' }
          });
          return false;
        }
      },

      // Remove a profile
      removeProfile: (profileId) => {
        try {
          const { profiles, selectedProfileId } = get();

          // Prevent removing the last profile
          if (profiles.length <= 1) {
            set({
              error: 'Cannot remove the last profile',
              notification: { type: 'error', message: 'Cannot remove the last profile' }
            });
            return false;
          }

          const profileToRemove = profiles.find(p => p.id === profileId);
          if (!profileToRemove) {
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
            return false;
          }

          const updatedProfiles = deleteProfileService(profiles, profileId);

          // If removing the selected profile, select another one
          let newSelectedProfileId = selectedProfileId;
          if (selectedProfileId === profileId) {
            // Find default profile or first available
            const defaultProfile = updatedProfiles.find(p => p.isDefault) || updatedProfiles[0];
            newSelectedProfileId = defaultProfile.id;
          }

          // Save to localStorage
          const saveResult = saveProfiles(updatedProfiles);

          set({
            profiles: updatedProfiles,
            selectedProfileId: newSelectedProfileId,
            notification: {
              type: 'success',
              message: saveResult
                ? `Profile "${profileToRemove.name}" removed successfully`
                : `Profile removed but could not be saved to storage`
            }
          });

          return true;
        } catch (error) {
          console.error('Error removing profile:', error);
          set({
            error: 'Failed to remove profile',
            notification: { type: 'error', message: 'Failed to remove profile' }
          });
          return false;
        }
      },

      // Set a profile as default
      setAsDefaultProfile: (profileId) => {
        try {
          const { profiles } = get();

          const profileToSetAsDefault = profiles.find(p => p.id === profileId);
          if (!profileToSetAsDefault) {
            set({
              error: 'Profile not found',
              notification: { type: 'error', message: 'Profile not found' }
            });
            return false;
          }

          // Update all profiles
          const updatedProfiles = profiles.map(p => ({
            ...p,
            isDefault: p.id === profileId
          }));

          // Save to localStorage
          const saveResult = saveProfiles(updatedProfiles);

          set({
            profiles: updatedProfiles,
            notification: {
              type: 'success',
              message: saveResult
                ? `Profile "${profileToSetAsDefault.name}" set as default`
                : `Profile set as default but could not be saved to storage`
            }
          });

          return true;
        } catch (error) {
          console.error('Error setting default profile:', error);
          set({
            error: 'Failed to set default profile',
            notification: { type: 'error', message: 'Failed to set default profile' }
          });
          return false;
        }
      },

      // Clear notification
      clearNotification: () => {
        set({ notification: null });
      }
    }),
    { name: 'profile-store' }
  )
);
