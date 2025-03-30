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
  isSaving: boolean;
  isDeleting: boolean;
  isCreating: boolean;
  isSettingDefault: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;
  
  // Functions
  loadProfiles: () => void;
  selectProfile: (profileId: string) => GridProfile | null;
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
  isSaving: false,
  isDeleting: false,
  isCreating: false,
  isSettingDefault: false,
  error: null,
  notification: null,
  
  loadProfiles: () => {},
  selectProfile: () => null,
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSettingDefault, setIsSettingDefault] = useState<boolean>(false);
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
      setIsCreating(true);
      
      if (!name.trim()) {
        setError('Profile name is required');
        setIsCreating(false);
        return false;
      }
      
      // Check for duplicate name
      if (profiles.some(profile => profile.name.toLowerCase() === name.trim().toLowerCase())) {
        setError('A profile with this name already exists');
        setIsCreating(false);
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
      
      setIsCreating(false);
      return true;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile');
      setIsCreating(false);
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
      setIsSaving(true);
      
      if (!selectedProfileId) {
        setError('No profile selected');
        setIsSaving(false);
        return false;
      }
      
      const currentProfile = profiles.find(p => p.id === selectedProfileId);
      if (!currentProfile) {
        setError('Selected profile not found');
        setIsSaving(false);
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
      
      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setIsSaving(false);
      return false;
    }
  };

  // Remove a profile
  const removeProfile = (profileId: string): boolean => {
    try {
      setIsDeleting(true);
      
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
      
      setIsDeleting(false);
      return true;
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile');
      setIsDeleting(false);
      return false;
    }
  };

  // Set a profile as the default
  const setAsDefaultProfile = (profileId: string): boolean => {
    try {
      setIsSettingDefault(true);
      
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
      
      setIsSettingDefault(false);
      return true;
    } catch (err) {
      console.error('Error setting default profile:', err);
      setError('Failed to set default profile');
      setIsSettingDefault(false);
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
    isSaving,
    isDeleting,
    isCreating,
    isSettingDefault,
    error,
    notification,
    
    loadProfiles,
    selectProfile,
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