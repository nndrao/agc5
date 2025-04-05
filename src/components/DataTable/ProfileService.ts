/**
 * ProfileService.ts
 * Class-based service for managing grid profiles with proper error handling and type safety.
 */

import { GridSettings } from "./Settings/types";
import { GridProfile } from "./ProfileManager/ProfileService";

export class ProfileService {
  private STORAGE_KEY = 'ag-grid-profiles';

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Generate a unique ID for profiles
   */
  private generateProfileId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Get all saved profiles from localStorage with proper error handling
   */
  async getProfiles(): Promise<GridProfile[]> {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn("localStorage not available, returning empty profiles");
        return [];
      }

      const profilesJson = localStorage.getItem(this.STORAGE_KEY);
      if (!profilesJson) {
        console.log("No profiles found in localStorage");

        // Create and return default profile if no profiles exist
        const defaultProfile = this.createDefaultProfile();
        this.saveProfiles([defaultProfile]);
        return [defaultProfile];
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

      // If no valid profiles found, create a default one
      if (validProfiles.length === 0) {
        const defaultProfile = this.createDefaultProfile();
        this.saveProfiles([defaultProfile]);
        return [defaultProfile];
      }

      return validProfiles;
    } catch (error) {
      console.error("Error loading profiles from localStorage:", error);

      // Create a default profile in case of error
      const defaultProfile = this.createDefaultProfile();
      try {
        this.saveProfiles([defaultProfile]);
      } catch (e) {
        console.error("Failed to save default profile:", e);
      }

      return [defaultProfile];
    }
  }

  /**
   * Save profiles to localStorage with error handling
   */
  async saveProfiles(profiles: GridProfile[]): Promise<boolean> {
    try {
      if (!this.isLocalStorageAvailable()) {
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

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableProfiles));
      return true;
    } catch (error) {
      console.error("Error saving profiles to localStorage:", error);
      return false;
    }
  }

  /**
   * Create a default profile with basic settings
   */
  createDefaultProfile(): GridProfile {
    const now = new Date().toISOString();

    // Import from defaultGridSettings would be better here
    const defaultSettings: any = {
      // Default settings would go here - simplified for brevity
      rowHeight: 48,
      headerHeight: 45,
      pagination: true,
      paginationPageSize: 100,
      domLayout: 'normal',
      animateRows: true,
      // Additional default settings would be added here
    };

    return {
      id: this.generateProfileId(),
      name: 'Default Profile',
      description: 'Default grid configuration',
      isDefault: true,
      settings: defaultSettings,
      columnState: [],
      filterModel: {},
      sortModel: [],
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Create a new profile with the current grid state
   */
  async createProfile(
    name: string,
    description: string,
    settings: GridSettings,
    columnState: any[],
    filterModel: any,
    sortModel: any[]
  ): Promise<GridProfile> {
    const now = new Date().toISOString();

    return {
      id: this.generateProfileId(),
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
  async updateProfile(
    profile: GridProfile,
    settings: GridSettings,
    columnState: any[],
    filterModel: any,
    sortModel: any[]
  ): Promise<GridProfile> {
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
   * Get the default profile from a list of profiles
   */
  getDefaultProfile(profiles: GridProfile[]): GridProfile | undefined {
    if (profiles.length === 0) return undefined;

    const defaultProfile = profiles.find(p => p.isDefault);
    return defaultProfile || profiles[0];
  }

  /**
   * Set a profile as the default
   */
  setProfileAsDefault(profiles: GridProfile[], profileId: string): GridProfile[] {
    return profiles.map(profile => ({
      ...profile,
      isDefault: profile.id === profileId
    }));
  }
}