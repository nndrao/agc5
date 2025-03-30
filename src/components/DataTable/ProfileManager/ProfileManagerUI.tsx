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
  onProfileLoaded?: (settings: GridSettings) => void;
  autoLoadDefaultProfile?: boolean;
}

export function ProfileManagerUI({ gridRef, gridSettings, onProfileLoaded, autoLoadDefaultProfile = false }: ProfileManagerUIProps) {
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
  
  // Add state for profile loading indicator
  const [isApplyingProfile, setIsApplyingProfile] = useState(false);

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

  // Auto-load default profile when component mounts if autoLoadDefaultProfile is true
  React.useEffect(() => {
    if (autoLoadDefaultProfile && !isLoading && selectedProfileId && gridRef.current) {
      console.log('Auto-loading default profile on startup...');
      // We need to use a timeout to ensure grid API is fully initialized
      const timer = setTimeout(() => {
        handleLoadProfile(selectedProfileId);
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoadDefaultProfile, isLoading, selectedProfileId, gridRef.current]);

  // Load a profile
  const handleLoadProfile = (profileId: string) => {
    // For auto-loading profile at startup, we suppress toasts for better UX
    const isAutoLoading = autoLoadDefaultProfile && !document.hasFocus();
    const showToast = !isAutoLoading;
    
    // Begin loading profile
    setIsApplyingProfile(true);
    
    const profile = selectProfile(profileId);
    if (!profile) {
      if (showToast) toast.error('Failed to select profile');
      console.error('Failed to select profile - profile not found');
      setIsApplyingProfile(false);
      return;
    }

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      if (showToast) toast.error('Grid API not available');
      console.error('Grid API not available when loading profile');
      
      // For auto-loading, we'll retry after a delay
      if (isAutoLoading) {
        console.log('Will retry loading profile after delay...');
        setTimeout(() => handleLoadProfile(profileId), 500);
      } else {
        setIsApplyingProfile(false);
      }
      return;
    }

    // Loading profile with settings

    // Apply the profile in stages
    const result = loadProfileInStages(
      gridApi,
      columnApi,
      profile.settings,
      profile.columnState,
      profile.filterModel,
      profile.sortModel
    );

    // Set loading state to false when done
    setIsApplyingProfile(false);

    if (result.success) {
      // Update parent component's gridSettings state
      if (onProfileLoaded) {
        // Sync parent component state
        onProfileLoaded(profile.settings);
      }
      
      // Format and display the timing information
      if (showToast) {
        if (result.timing) {
          const { total, stages } = result.timing;
          
          // Sort stages by duration (descending) to show the most time-consuming first
          const sortedStages = Object.entries(stages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3) // Only show top 3 most time-consuming stages
            .map(([key, time]) => `${key}: ${time.toFixed(0)}ms`);
            
          toast.success(
            <div>
              <div><strong>Profile loaded: {profile.name}</strong></div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Completed in {total}ms
              </div>
            </div>,
            { duration: 2500 }
          );
        } else {
          toast.success(`Profile "${profile.name}" loaded successfully`);
        }
      }
      // Profile loaded successfully
    } else {
      if (showToast) toast.error(`Failed to load profile at stage: ${result.stage}`);
      console.error('Profile loading error:', result.error);
    }
  };

  // Save current state to profile
  const handleSaveProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }

    // Show updating indicator
    setIsApplyingProfile(true);

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid API not available');
      setIsApplyingProfile(false);
      return;
    }

    // Get current state
    const columnState = getColumnState(columnApi, gridApi);
    const filterModel = getFilterModel(gridApi);
    const sortModel = getSortModelFromColumnState(columnState);

    // Save profile without excessive logging
    
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
    
    // Reset loading state
    setIsApplyingProfile(false);
  };

  // Create a new profile
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setProfileNameError('Profile name is required');
      return;
    }

    // Show loading indicator
    setIsApplyingProfile(true);

    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid API not available');
      setIsNewProfileDialogOpen(false);
      setIsApplyingProfile(false);
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
    
    // Reset loading state
    setIsApplyingProfile(false);
  };

  // Delete a profile
  const handleDeleteProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }
    
    setIsApplyingProfile(true);
    
    const success = removeProfile(selectedProfileId);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
    
    setIsApplyingProfile(false);
  };

  // Set default profile
  const handleSetDefaultProfile = () => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }
    
    setIsApplyingProfile(true);
    setAsDefaultProfile(selectedProfileId);
    setIsApplyingProfile(false);
  };

  // Render the UI
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Profile Selector with Busy Indicator */}
        <div className="relative">
          <Select
            value={selectedProfileId || ""}
            onValueChange={handleLoadProfile}
            disabled={isLoading || profiles.length === 0 || isApplyingProfile}
          >
            <SelectTrigger 
              ref={selectRef}
              className={`w-[200px] ${isApplyingProfile ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}`}
            >
              {isApplyingProfile ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Applying profile...</span>
                </div>
              ) : (
                <SelectValue 
                  placeholder={isLoading ? "Loading profiles..." : "Select a profile"} 
                />
              )}
            </SelectTrigger>
            <SelectContent>
              {profiles.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No profiles available
                </div>
              ) : (
                profiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.id} disabled={isApplyingProfile}>
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
        </div>
        
        {/* Save Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={!selectedProfileId || isLoading || isApplyingProfile}
              onClick={handleSaveProfile}
              className={isApplyingProfile ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              {isApplyingProfile ? (
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save className="h-4 w-4" />
              )}
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
              disabled={isLoading || isApplyingProfile}
              className={isApplyingProfile ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              {isApplyingProfile ? (
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
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
              disabled={!selectedProfileId || isLoading || isApplyingProfile}
              className={isApplyingProfile ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
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