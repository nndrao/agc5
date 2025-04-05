/**
 * ProfileManagerUI.tsx
 * UI component for managing profiles
 */

import React, { useState, useRef } from 'react';
import { useGridStore } from '../store/unifiedGridStore';
// We no longer need these utilities as we use the unified store
// We no longer need this import as we use the unified store
import { AgGridReact } from 'ag-grid-react';

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BookmarkPlus,
  Save,
  Trash2,
  MoreHorizontal,
  Star,
  AlertCircle,
  CheckCircle2,
  InfoIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProfileManagerUIProps {
  gridRef: React.RefObject<AgGridReact>;
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

  // Refs
  const selectRef = useRef<HTMLButtonElement>(null);

  // We now use the ProfileNotifications component for notifications

  // Display errors
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Load a profile
  const handleLoadProfile = (profileId: string) => {
    // Don't do anything if the profile is already selected
    if (profileId === selectedProfileId) {
      console.log(`Profile ${profileId} is already selected, skipping`);
      return Promise.resolve();
    }

    console.log(`Loading profile with ID: ${profileId}`);

    try {
      // Use the unified store to select the profile
      selectProfile(profileId);
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile due to an error');
      return Promise.reject(error);
    }
  };

  // Save current state to profile
  const handleSaveProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    console.log(`Saving profile with ID: ${selectedProfileId}`);

    // First extract the current grid state
    extractGridState();

    // Then save the current profile
    try {
      // Save the current profile with the extracted state
      saveCurrentProfile();
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  // Create a new profile
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setProfileNameError('Profile name is required');
      return;
    }

    // First extract the current grid state
    extractGridState();

    // Then create the profile
    const success = createProfile(
      newProfileName,
      newProfileDescription
    );

    if (success) {
      setNewProfileName('');
      setNewProfileDescription('');
      setProfileNameError('');
      setIsNewProfileDialogOpen(false);
    }
  };

  // Delete a profile
  const handleDeleteProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    const success = deleteProfile(selectedProfileId);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  // Set default profile
  const handleSetDefaultProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    setDefaultProfile(selectedProfileId);
  };

  // Render the UI
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Profile Selector */}
        <Select
          value={selectedProfileId || ""}
          onValueChange={(value) => {
            // Only handle the change if the value is different
            if (value !== selectedProfileId) {
              // Handle the async function
              handleLoadProfile(value).catch(error => {
                console.error('Error in profile selection:', error);
                toast.error('Failed to load selected profile');
              });
            }
          }}
          disabled={isLoading || profiles.length === 0}
        >
          <SelectTrigger
            ref={selectRef}
            className="w-[200px]"
          >
            <SelectValue
              placeholder={isLoading ? "Loading profiles..." : "Select a profile"}
            />
          </SelectTrigger>
          <SelectContent>
            {profiles.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No profiles available
              </div>
            ) : (
              profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>
                  <div className="flex items-center">
                    {profile.isDefault && (
                      <Star className="mr-2 h-3 w-3 text-yellow-500" />
                    )}
                    <span>{profile.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Save Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={!selectedProfileId}
              onClick={handleSaveProfile}
              data-save-profile
            >
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Update current profile
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
              <BookmarkPlus className="h-4 w-4" />
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
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete profile</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Profile Dialog */}
      <Dialog
        open={isNewProfileDialogOpen}
        onOpenChange={setIsNewProfileDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a new profile with the current grid settings and layout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProfileName}
                onChange={(e) => {
                  setNewProfileName(e.target.value);
                  setProfileNameError('');
                }}
                className="col-span-3"
              />
              {profileNameError && (
                <div className="col-span-4 text-right text-destructive text-sm">
                  {profileNameError}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewProfileDialogOpen(false);
                setNewProfileName('');
                setNewProfileDescription('');
                setProfileNameError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}