/**
 * ProfileService.ts
 * A robust service for managing AG-Grid 33+ profiles with proper error handling and type safety.
 */

import { GridSettings } from "../Settings/types";

// Storage key for all profiles
const STORAGE_KEY = 'ag-grid-profiles';

// Define a type-safe profile structure with only serializable data
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

/**
 * Check if localStorage is available and working
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error("LocalStorage is not available:", e);
    return false;
  }
}

/**
 * Get all saved profiles from localStorage with proper error handling
 */
export function getProfiles(): GridProfile[] {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("localStorage not available, returning empty profiles");
      return [];
    }

    const profilesJson = localStorage.getItem(STORAGE_KEY);
    if (!profilesJson) {
      console.log("No profiles found in localStorage");
      return [];
    }

    const parsedData = JSON.parse(profilesJson);
    if (!Array.isArray(parsedData)) {
      console.warn("Invalid profile data format in localStorage - not an array");
      return [];
    }

    // Validate the structure of each profile
    const validProfiles = parsedData.filter(profile => {
      return (
        profile &&
        typeof profile === 'object' &&
        typeof profile.id === 'string' &&
        typeof profile.name === 'string' &&
        profile.settings &&
        Array.isArray(profile.columnState)
      );
    });

    if (validProfiles.length !== parsedData.length) {
      console.warn(`Found ${parsedData.length - validProfiles.length} invalid profiles which were filtered out`);
    }

    return validProfiles;
  } catch (error) {
    console.error("Error loading profiles from localStorage:", error);
    return [];
  }
}

/**
 * Save profiles to localStorage with error handling
 */
export function saveProfiles(profiles: GridProfile[]): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("localStorage not available, profiles won't persist");
      return false;
    }

    // Ensure we only save serializable data
    const serializableProfiles = profiles.map(profile => ({
      ...profile,
      // Ensure dates are strings
      createdAt: typeof profile.createdAt === 'string' ? profile.createdAt : new Date().toISOString(),
      updatedAt: typeof profile.updatedAt === 'string' ? profile.updatedAt : new Date().toISOString(),
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableProfiles));
    return true;
  } catch (error) {
    console.error("Error saving profiles to localStorage:", error);
    return false;
  }
}

/**
 * Create a new profile with the current grid state
 */
export function createProfile(
  name: string,
  description: string,
  settings: GridSettings,
  columnState: any[],
  filterModel: any,
  sortModel: any[]
): GridProfile {
  const now = new Date().toISOString();
  
  return {
    id: generateProfileId(),
    name: name.trim(),
    description: description?.trim(),
    settings,
    columnState,
    filterModel,
    sortModel,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Update an existing profile with new state
 */
export function updateProfile(
  profile: GridProfile,
  settings: GridSettings,
  columnState: any[],
  filterModel: any,
  sortModel: any[]
): GridProfile {
  return {
    ...profile,
    settings,
    columnState,
    filterModel,
    sortModel,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Delete a profile and return updated profile list
 */
export function deleteProfile(profiles: GridProfile[], profileId: string): GridProfile[] {
  return profiles.filter(p => p.id !== profileId);
}

/**
 * Get the default profile or first profile if no default is set
 */
export function getDefaultProfile(profiles: GridProfile[]): GridProfile | undefined {
  if (profiles.length === 0) return undefined;
  
  const defaultProfile = profiles.find(p => p.isDefault);
  return defaultProfile || profiles[0];
}

/**
 * Set a profile as the default
 */
export function setProfileAsDefault(profiles: GridProfile[], profileId: string): GridProfile[] {
  return profiles.map(profile => ({
    ...profile,
    isDefault: profile.id === profileId
  }));
}

/**
 * Generate a unique ID for profiles
 */
export function generateProfileId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
}