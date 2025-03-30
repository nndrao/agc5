/**
 * ProfileManagerUI.tsx - Simple, reliable version
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
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
    isSaving,
    isDeleting,
    isCreating,
    isSettingDefault,
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
  const [customBusyState, setCustomBusyState] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<any>(null);
  
  // Refs
  const selectRef = useRef<HTMLButtonElement>(null);
  const didAutoLoadRef = useRef(false);

  // Combined busy state for UI feedback
  const isLoadingProfile = customBusyState === 'loading';
  const isBusy = isLoadingProfile || isSaving || isDeleting || isCreating || isSettingDefault;
  
  // Process notifications
  useEffect(() => {
    if (notification) {
      const { type, message } = notification;
      
      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
          toast.info(message);
          break;
      }
      
      clearNotification();
    }
  }, [notification, clearNotification]);

  // Display errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Default profile auto-loading effect that runs once
  useEffect(() => {
    // Run this only when autoLoadDefaultProfile becomes true, grid is ready, and profiles are loaded
    const shouldAutoLoad = 
      autoLoadDefaultProfile && 
      !didAutoLoadRef.current && 
      !isLoading && 
      !!selectedProfileId;

    if (shouldAutoLoad) {
      console.log('Auto-loading default profile on startup...');
      
      // Safety timeout to clear loading state
      const safetyTimer = setTimeout(() => {
        setCustomBusyState(null);
        console.log('Auto-load safety timeout triggered');
      }, 10000); // 10 second max
      
      // Set loading state
      setCustomBusyState('loading');
      
      // Add delay so UI renders first
      loadingTimeoutRef.current = setTimeout(() => {
        // Mark that we attempted auto-load
        didAutoLoadRef.current = true;
        
        // Try to get the grid API
        const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
        
        if (isReady) {
          // Load the profile
          const profile = selectProfile(selectedProfileId);
          if (profile) {
            try {
              // Apply profile
              const result = loadProfileInStages(
                gridApi,
                columnApi,
                profile.settings,
                profile.columnState,
                profile.filterModel,
                profile.sortModel
              );
              
              // Update parent state if successful
              if (result.success && onProfileLoaded) {
                onProfileLoaded(profile.settings);
              }
            } catch (err) {
              console.error('Error during profile loading', err);
            }
          }
        } else {
          console.warn('Grid API not ready, cannot auto-load profile');
        }
        
        // Always clear loading state when done
        setCustomBusyState(null);
        clearTimeout(safetyTimer);
      }, 1500);
      
      // Cleanup
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        clearTimeout(safetyTimer);
      };
    }
  }, [autoLoadDefaultProfile, selectedProfileId, isLoading, selectProfile, onProfileLoaded, gridRef]);

  // Simple function to load a profile
  const handleLoadProfile = useCallback((profileId: string) => {
    // Don't show toast if auto-loading
    const showToast = autoLoadDefaultProfile ? document.hasFocus() : true;
    
    // Set loading state
    setCustomBusyState('loading');
    
    // Safety timeout
    const safetyTimer = setTimeout(() => {
      setCustomBusyState(null);
    }, 5000);
    
    try {
      // Get profile
      const profile = selectProfile(profileId);
      if (!profile) {
        if (showToast) toast.error('Profile not found');
        setCustomBusyState(null);
        clearTimeout(safetyTimer);
        return;
      }
      
      // Get grid API
      const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
      if (!isReady) {
        if (showToast) toast.error('Grid not ready');
        setCustomBusyState(null);
        clearTimeout(safetyTimer);
        return;
      }
      
      // Apply profile asynchronously
      setTimeout(() => {
        try {
          // Apply profile
          const result = loadProfileInStages(
            gridApi,
            columnApi,
            profile.settings,
            profile.columnState,
            profile.filterModel,
            profile.sortModel
          );
          
          // Update parent component
          if (result.success && onProfileLoaded) {
            onProfileLoaded(profile.settings);
          }
          
          // Show result
          if (showToast) {
            if (result.success) {
              toast.success(`Profile "${profile.name}" loaded successfully`);
            } else {
              toast.error(`Failed to load profile: ${result.stage}`);
            }
          }
        } catch (err) {
          console.error('Error loading profile', err);
          if (showToast) toast.error('Error loading profile');
        } finally {
          // Always clear loading state
          setCustomBusyState(null);
          clearTimeout(safetyTimer);
        }
      }, 100);
    } catch (err) {
      console.error('Error in profile loading', err);
      setCustomBusyState(null);
      clearTimeout(safetyTimer);
    }
  }, [autoLoadDefaultProfile, selectProfile, gridRef, onProfileLoaded]);
  
  // Simple function to save a profile
  const handleSaveProfile = useCallback(() => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }
    
    // Get grid API
    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid not ready');
      return;
    }
    
    // Get current state
    const columnState = getColumnState(columnApi, gridApi);
    const filterModel = getFilterModel(gridApi);
    const sortModel = getSortModelFromColumnState(columnState);
    
    // Update profile - context handles loading state
    updateCurrentProfile(
      gridSettings,
      columnState,
      filterModel,
      sortModel
    );
  }, [selectedProfileId, gridRef, gridSettings, updateCurrentProfile]);
  
  // Create a new profile
  const handleCreateProfile = useCallback(() => {
    if (!newProfileName.trim()) {
      setProfileNameError('Profile name is required');
      return;
    }
    
    // Get grid API
    const { gridApi, columnApi, isReady } = safelyAccessGridApi(gridRef);
    if (!isReady) {
      toast.error('Grid not ready');
      setIsNewProfileDialogOpen(false);
      return;
    }
    
    // Get current state
    const columnState = getColumnState(columnApi, gridApi);
    const filterModel = getFilterModel(gridApi);
    const sortModel = getSortModelFromColumnState(columnState);
    
    // Create profile - context handles loading state
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
  }, [newProfileName, newProfileDescription, gridRef, gridSettings, createNewProfile]);
  
  // Delete a profile
  const handleDeleteProfile = useCallback(() => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }
    
    // Delete profile - context handles loading state
    const success = removeProfile(selectedProfileId);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  }, [selectedProfileId, removeProfile]);
  
  // Set default profile
  const handleSetDefaultProfile = useCallback(() => {
    if (!selectedProfileId) {
      toast.error('No profile selected');
      return;
    }
    
    // Set default - context handles loading state
    setAsDefaultProfile(selectedProfileId);
  }, [selectedProfileId, setAsDefaultProfile]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Profile Selector with Busy Indicator */}
        <div className="relative">
          <Select
            value={selectedProfileId || ""}
            onValueChange={handleLoadProfile}
            disabled={isLoading || profiles.length === 0 || isBusy}
          >
            <SelectTrigger 
              ref={selectRef}
              className={`w-[200px] ${isBusy ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}`}
            >
              {isBusy ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="whitespace-nowrap">
                    {isLoadingProfile ? (didAutoLoadRef.current ? "Loading profile..." : "Loading profile...") :
                     isSaving ? "Saving profile..." :
                     isCreating ? "Creating profile..." :
                     isDeleting ? "Deleting profile..." :
                     isSettingDefault ? "Setting default..." :
                     "Processing..."}
                  </span>
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
                  <SelectItem key={profile.id} value={profile.id} disabled={isBusy}>
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
              disabled={!selectedProfileId || isLoading || isBusy}
              onClick={handleSaveProfile}
              className={isBusy ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              {isSaving ? (
                <div className="flex items-center justify-center w-4 h-4">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
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
              disabled={isLoading || isBusy}
              className={isBusy ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              {isCreating ? (
                <div className="flex items-center justify-center w-4 h-4">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
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
              disabled={!selectedProfileId || isLoading || isBusy}
              className={isBusy ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={handleSetDefaultProfile}
              disabled={isSettingDefault}
            >
              {isSettingDefault ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Setting default...</span>
                </div>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Set as default</span>
                </>
              )}
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
            <Button onClick={handleCreateProfile} disabled={isCreating}>
              {isCreating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </div>
              ) : "Create"}
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
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting...</span>
                </div>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}