/**
 * ProfileContext.tsx
 * React context for managing profile state across components
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GridProfile, getProfiles, saveProfiles, createProfile, updateProfile, deleteProfile, getDefaultProfile } from './ProfileService';
import { GridSettings } from '../Settings/types';

// Define the context type
interface ProfileContextType {
  // Profile state
  profiles: GridProfile[];
  selectedProfileId: string | null;
  isLoading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;
  
  // Functions
  loadProfiles: () => void;
  selectProfile: (profileId: string) => GridProfile | null;
  loadProfileById: (profileId: string, gridApi?: any) => Promise<GridProfile | null>;
  createNewProfile: (name: string, description: string, settings: GridSettings, columnState: any[], filterModel: any, sortModel: any[]) => boolean;
  updateCurrentProfile: (settings: GridSettings, columnState: any[], filterModel: any, sortModel: any[]) => boolean;
  removeProfile: (profileId: string) => boolean;
  setAsDefaultProfile: (profileId: string) => boolean;
  clearNotification: () => void;
}

// Create the context with default values
const ProfileContext = createContext<ProfileContextType>({
  profiles: [],
  selectedProfileId: null,
  isLoading: false,
  error: null,
  notification: null,
  
  loadProfiles: () => {},
  selectProfile: () => null,
  loadProfileById: () => Promise.resolve(null),
  createNewProfile: () => false,
  updateCurrentProfile: () => false,
  removeProfile: () => false,
  setAsDefaultProfile: () => false,
  clearNotification: () => {},
});

// Provider component to wrap around components that need access to profile state
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<GridProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info' | null; message: string } | null>(null);

  // Load profiles when the component mounts
  useEffect(() => {
    loadProfiles();
  }, []);

  // Clear notification after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load profiles from localStorage
  const loadProfiles = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedProfiles = getProfiles();
      setProfiles(loadedProfiles);
      
      // Set selected profile to default or first profile
      if (loadedProfiles.length > 0) {
        const defaultProfile = getDefaultProfile(loadedProfiles);
        if (defaultProfile) {
          setSelectedProfileId(defaultProfile.id);
        }
      } else {
        setSelectedProfileId(null);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Failed to load profiles');
      setIsLoading(false);
    }
  };

  // Select a profile by ID
  const selectProfile = (profileId: string): GridProfile | null => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfileId(profileId);
      return profile;
    }
    return null;
  };

  // Load a profile by ID, optionally applying it to a grid
  const loadProfileById = async (profileId: string, gridApi?: any): Promise<GridProfile | null> => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfileId(profileId);
      
      // If a grid API is provided, apply the profile
      if (gridApi) {
        console.log(`Directly applying profile to grid: ${profile.name}`);
        try {
          // Import GridStateUtils dynamically to avoid circular dependencies
          // using import() instead of require()
          const GridStateUtils = await import('./GridStateUtils');
          
          const result = GridStateUtils.loadProfileInStages(
            gridApi,
            gridApi, // For AG-Grid 33+ compatibility
            profile.settings || {},
            profile.columnState || [],
            profile.filterModel || {},
            profile.sortModel || []
          );
          
          if (!result.success) {
            const errorMessage = result.error 
              ? (typeof result.error === 'object' ? JSON.stringify(result.error) : result.error.toString())
              : 'Unknown error loading profile';
            console.error(`Error loading profile at stage ${result.stage || 'unknown'}: ${errorMessage}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('Failed to apply profile to grid:', errorMessage);
        }
      }
      
      return profile;
    }
    return null;
  };

  // Create a new profile
  const createNewProfile = (
    name: string, 
    description: string, 
    settings: GridSettings, 
    columnState: any[], 
    filterModel: any, 
    sortModel: any[]
  ): boolean => {
    try {
      if (!name.trim()) {
        setError('Profile name is required');
        return false;
      }
      
      // Check for duplicate name
      if (profiles.some(profile => profile.name.toLowerCase() === name.trim().toLowerCase())) {
        setError('A profile with this name already exists');
        return false;
      }
      
      const newProfile = createProfile(
        name,
        description,
        settings,
        columnState,
        filterModel,
        sortModel
      );
      
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setSelectedProfileId(newProfile.id);
      
      const saved = saveProfiles(updatedProfiles);
      if (saved) {
        setNotification({ type: 'success', message: 'Profile created successfully' });
      } else {
        setNotification({ type: 'info', message: 'Profile created but could not be saved to storage' });
      }
      
      return true;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile');
      return false;
    }
  };

  // Update the current profile
  const updateCurrentProfile = (
    settings: GridSettings, 
    columnState: any[], 
    filterModel: any, 
    sortModel: any[]
  ): boolean => {
    try {
      if (!selectedProfileId) {
        setError('No profile selected');
        return false;
      }
      
      const currentProfile = profiles.find(p => p.id === selectedProfileId);
      if (!currentProfile) {
        setError('Selected profile not found');
        return false;
      }
      
      const updatedProfile = updateProfile(
        currentProfile,
        settings,
        columnState,
        filterModel,
        sortModel
      );
      
      const updatedProfiles = profiles.map(p => 
        p.id === selectedProfileId ? updatedProfile : p
      );
      
      setProfiles(updatedProfiles);
      
      const saved = saveProfiles(updatedProfiles);
      if (saved) {
        setNotification({ type: 'success', message: 'Profile updated successfully' });
      } else {
        setNotification({ type: 'info', message: 'Profile updated but could not be saved to storage' });
      }
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    }
  };

  // Remove a profile
  const removeProfile = (profileId: string): boolean => {
    try {
      const updatedProfiles = deleteProfile(profiles, profileId);
      
      // If we're deleting the selected profile, select another one
      if (selectedProfileId === profileId) {
        const defaultProfile = getDefaultProfile(updatedProfiles);
        setSelectedProfileId(defaultProfile?.id || null);
      }
      
      setProfiles(updatedProfiles);
      
      const saved = saveProfiles(updatedProfiles);
      if (saved) {
        setNotification({ type: 'success', message: 'Profile deleted successfully' });
      } else {
        setNotification({ type: 'info', message: 'Profile deleted but could not be saved to storage' });
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile');
      return false;
    }
  };

  // Set a profile as the default
  const setAsDefaultProfile = (profileId: string): boolean => {
    try {
      const updatedProfiles = profiles.map(profile => ({
        ...profile,
        isDefault: profile.id === profileId
      }));
      
      setProfiles(updatedProfiles);
      
      const saved = saveProfiles(updatedProfiles);
      if (saved) {
        setNotification({ type: 'success', message: 'Default profile set successfully' });
      } else {
        setNotification({ type: 'info', message: 'Default profile set but could not be saved to storage' });
      }
      
      return true;
    } catch (err) {
      console.error('Error setting default profile:', err);
      setError('Failed to set default profile');
      return false;
    }
  };

  // Clear any notification
  const clearNotification = () => {
    setNotification(null);
  };

  // Create the context value object
  const contextValue: ProfileContextType = {
    profiles,
    selectedProfileId,
    isLoading,
    error,
    notification,
    
    loadProfiles,
    selectProfile,
    loadProfileById,
    createNewProfile,
    updateCurrentProfile,
    removeProfile,
    setAsDefaultProfile,
    clearNotification,
  };

  // Provide the context to children
  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

// Custom hook for using the profile context
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}