/**
 * ProfileManagerUI.tsx
 * UI component for managing profiles
 */

import React, { useState, useRef } from 'react';
import { useProfileContext } from './ProfileContext';
import { safelyAccessGridApi, getColumnState, getFilterModel, getSortModelFromColumnState, loadProfileInStages } from './GridStateUtils';
import { GridSettings } from '../Settings/types';

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
  gridRef: React.RefObject<any>;
  gridSettings: GridSettings;
}

export function ProfileManagerUI({ gridRef, gridSettings }: ProfileManagerUIProps) {
  // Profile context
  const { 
    profiles, 
    selectedProfileId, 
    isLoading, 
    error, 
    notification,
    selectProfile, 
    createNewProfile, 
    updateCurrentProfile, 
    removeProfile,
    setAsDefaultProfile,
    clearNotification
  } = useProfileContext();

  // Local state
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [profileNameError, setProfileNameError] = useState('');

  // Refs
  const selectRef = useRef<HTMLButtonElement>(null);

  // Display notifications
  React.useEffect(() => {
    if (notification) {
      const { type, message } = notification;
      
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      } else if (type === 'info') {
        toast.info(message);
      }
      
      clearNotification();
    }
  }, [notification, clearNotification]);

  // Display errors
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Load a profile
  const handleLoadProfile = (profileId: string) => {
    const profile = selectProfile(profileId);
    if (!profile) {
      toast.error('Failed to select profile');
      return;
    }

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid API not available');
      return;
    }

    // Apply the profile in stages
    const result = loadProfileInStages(
      gridApi,
      columnApi,
      profile.settings,
      profile.columnState,
      profile.filterModel,
      profile.sortModel
    );

    if (result.success) {
      toast.success(`Profile "${profile.name}" loaded successfully`);
    } else {
      toast.error(`Failed to load profile at stage: ${result.stage}`);
      console.error('Profile loading error:', result.error);
    }
  };

  // Save current state to profile
  const handleSaveProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid API not available');
      return;
    }

    // Get current state
    const columnState = getColumnState(columnApi, gridApi);
    const filterModel = getFilterModel(gridApi);
    const sortModel = getSortModelFromColumnState(columnState);

    // Update the profile
    const success = updateCurrentProfile(
      gridSettings,
      columnState,
      filterModel,
      sortModel
    );

    if (!success) {
      toast.error('Failed to update profile');
    }
  };

  // Create a new profile
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setProfileNameError('Profile name is required');
      return;
    }

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid API not available');
      setIsNewProfileDialogOpen(false);
      return;
    }

    // Get current state
    const columnState = getColumnState(columnApi, gridApi);
    const filterModel = getFilterModel(gridApi);
    const sortModel = getSortModelFromColumnState(columnState);

    // Create the profile
    const success = createNewProfile(
      newProfileName,
      newProfileDescription,
      gridSettings,
      columnState,
      filterModel,
      sortModel
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

    const success = removeProfile(selectedProfileId);
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

    setAsDefaultProfile(selectedProfileId);
  };

  // Render the UI
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Profile Selector */}
        <Select
          value={selectedProfileId || ""}
          onValueChange={handleLoadProfile}
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
              variant="outline"
              size="icon"
              disabled={!selectedProfileId || isLoading}
              onClick={handleSaveProfile}
            >
              <Save className="h-4 w-4" />
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