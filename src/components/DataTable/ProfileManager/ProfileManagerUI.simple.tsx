/**
 * ProfileManagerUI.simple.tsx
 * A simplified version of the ProfileManagerUI component to avoid infinite loops
 */
import React, { useState, useRef } from 'react';
import { useGridStore } from '../store/unifiedGridStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Icons
import { 
  Save, 
  Plus, 
  MoreHorizontal,
  Star,
  Trash
} from 'lucide-react';

interface ProfileManagerUIProps {
  gridRef: React.RefObject<any>;
}

export function ProfileManagerUI({ gridRef }: ProfileManagerUIProps) {
  // Access the unified store
  const profiles = useGridStore(state => state.profiles);
  const selectedProfileId = useGridStore(state => state.selectedProfileId);
  const isLoading = useGridStore(state => state.isLoading);
  const error = useGridStore(state => state.error);
  const settings = useGridStore(state => state.settings);

  // Store actions
  const selectProfile = useGridStore(state => state.selectProfile);
  const createProfile = useGridStore(state => state.createProfile);
  const saveCurrentProfile = useGridStore(state => state.saveCurrentProfile);
  const deleteProfile = useGridStore(state => state.deleteProfile);
  const setDefaultProfile = useGridStore(state => state.setDefaultProfile);
  const extractGridState = useGridStore(state => state.extractGridState);

  // Local state
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [profileNameError, setProfileNameError] = useState('');

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
      setProfileNameError('Profile name is required');
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
      setProfileNameError('');
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
      setIsDeleteDialogOpen(false);
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

  // Render the UI
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Profile Selector - Using a native select to avoid issues */}
        <div className="relative w-[200px]">
          <select
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
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
        </div>

        {/* Save Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSaveProfile}
              disabled={!selectedProfileId || isLoading}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Save current settings
          </TooltipContent>
        </Tooltip>

        {/* New Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsNewProfileDialogOpen(true)}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Create new profile
          </TooltipContent>
        </Tooltip>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={!selectedProfileId || isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSetDefaultProfile}>
              <Star className="mr-2 h-4 w-4" />
              <span>Set as default</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete profile</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile name display */}
        {selectedProfile && (
          <div className="ml-2 text-sm font-medium">
            {selectedProfile.name}
            {selectedProfile.isDefault && (
              <span className="ml-1 text-xs text-yellow-500">(Default)</span>
            )}
          </div>
        )}
      </div>

      {/* New Profile Dialog */}
      <Dialog open={isNewProfileDialogOpen} onOpenChange={setIsNewProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium">
                Profile Name
              </label>
              <Input
                id="profile-name"
                value={newProfileName}
                onChange={(e) => {
                  setNewProfileName(e.target.value);
                  if (e.target.value.trim()) {
                    setProfileNameError('');
                  }
                }}
                placeholder="Enter profile name"
                className={profileNameError ? 'border-red-500' : ''}
              />
              {profileNameError && (
                <p className="text-xs text-red-500">{profileNameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="profile-description"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                placeholder="Enter profile description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this profile?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
