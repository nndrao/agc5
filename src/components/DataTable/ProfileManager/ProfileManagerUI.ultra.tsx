/**
 * ProfileManagerUI.ultra.tsx
 * An ultra-simplified version of the ProfileManagerUI component with no UI library components
 */
import React, { useState } from 'react';
import { useGridStore } from '../store/unifiedGridStore';
import { toast } from 'sonner';

interface ProfileManagerUIProps {
  gridRef: React.RefObject<any>;
}

export function ProfileManagerUI({ gridRef }: ProfileManagerUIProps) {
  // Access the unified store
  const profiles = useGridStore(state => state.profiles);
  const selectedProfileId = useGridStore(state => state.selectedProfileId);
  const isLoading = useGridStore(state => state.isLoading);
  const error = useGridStore(state => state.error);

  // Store actions
  const selectProfile = useGridStore(state => state.selectProfile);
  const createProfile = useGridStore(state => state.createProfile);
  const saveCurrentProfile = useGridStore(state => state.saveCurrentProfile);
  const deleteProfile = useGridStore(state => state.deleteProfile);
  const setDefaultProfile = useGridStore(state => state.setDefaultProfile);
  const extractGridState = useGridStore(state => state.extractGridState);

  // Local state
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');

  // Display errors
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle profile selection
  const handleProfileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = event.target.value;
    if (profileId === selectedProfileId) {
      console.log(`Profile ${profileId} is already selected, skipping`);
      return;
    }
    
    console.log(`Loading profile with ID: ${profileId}`);
    try {
      selectProfile(profileId);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  // Save current state to profile
  const handleSaveProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    console.log(`Saving profile with ID: ${selectedProfileId}`);

    try {
      // First extract the current grid state
      extractGridState();
      
      // Then save the current profile
      saveCurrentProfile();
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  // Handle profile creation
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast.error('Profile name is required');
      return;
    }

    // First extract the current grid state
    extractGridState();
    
    // Then create the profile
    try {
      createProfile(newProfileName, newProfileDescription);
      
      // Reset form and close dialog
      setNewProfileName('');
      setNewProfileDescription('');
      setIsNewProfileDialogOpen(false);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    try {
      deleteProfile(selectedProfileId);
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  // Handle setting default profile
  const handleSetDefaultProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    try {
      setDefaultProfile(selectedProfileId);
    } catch (error) {
      console.error('Error setting default profile:', error);
      toast.error('Failed to set default profile');
    }
  };

  // Get the selected profile
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  // Render the UI with plain HTML elements
  return (
    <div className="flex items-center space-x-2 p-2">
      {/* Profile Selector - Using a native select */}
      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm"
        value={selectedProfileId || ""}
        onChange={handleProfileSelect}
        disabled={isLoading || profiles.length === 0}
      >
        <option value="" disabled>
          {isLoading ? "Loading profiles..." : "Select a profile"}
        </option>
        {profiles.map(profile => (
          <option key={profile.id} value={profile.id}>
            {profile.name} {profile.isDefault ? '(Default)' : ''}
          </option>
        ))}
      </select>

      {/* Save Profile Button */}
      <button
        className="h-9 w-9 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
        onClick={handleSaveProfile}
        disabled={!selectedProfileId || isLoading}
        title="Save current settings"
      >
        💾
      </button>

      {/* New Profile Button */}
      <button
        className="h-9 w-9 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
        onClick={() => setIsNewProfileDialogOpen(true)}
        disabled={isLoading}
        title="Create new profile"
      >
        ➕
      </button>

      {/* Profile Menu */}
      <div className="relative">
        <button
          className="h-9 w-9 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
          disabled={!selectedProfileId || isLoading}
          title="Profile options"
          onClick={() => {
            // Simple dropdown menu
            const menu = document.getElementById('profile-menu');
            if (menu) {
              menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }
          }}
        >
          ⋮
        </button>
        
        <div 
          id="profile-menu" 
          className="absolute right-0 mt-1 w-48 rounded-md border border-gray-300 bg-white shadow-lg" 
          style={{ display: 'none' }}
        >
          <div className="py-1">
            <button
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={handleSetDefaultProfile}
            >
              ⭐ Set as default
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={handleDeleteProfile}
            >
              🗑️ Delete profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile name display */}
      {selectedProfile && (
        <div className="ml-2 text-sm font-medium">
          {selectedProfile.name}
          {selectedProfile.isDefault && (
            <span className="ml-1 text-xs text-yellow-500">(Default)</span>
          )}
        </div>
      )}

      {/* New Profile Dialog */}
      {isNewProfileDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Create New Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Profile Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Description (Optional)</label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={newProfileDescription}
                  onChange={(e) => setNewProfileDescription(e.target.value)}
                  placeholder="Enter profile description"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
                onClick={() => setIsNewProfileDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
                onClick={handleCreateProfile}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
