/**
 * ProfileManager.tsx
 * UI component for managing grid profiles
 */

import React, { useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui';
import {
  Save,
  Star,
  Plus,
  Edit,
  Trash,
  Check,
  Copy,
  Download,
  Upload,
  Info,
  MoreVertical,
  Layers
} from 'lucide-react';

export function ProfileManager() {
  // Profile store
  const profiles = useProfileStore(state => state.profiles);
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const error = useProfileStore(state => state.error);
  const notification = useProfileStore(state => state.notification);
  const isLoading = useProfileStore(state => state.isLoading);

  const selectProfile = useProfileStore(state => state.selectProfile);
  const createNewProfile = useProfileStore(state => state.createNewProfile);
  const updateCurrentProfile = useProfileStore(state => state.updateCurrentProfile);
  const removeProfile = useProfileStore(state => state.removeProfile);
  const setAsDefaultProfile = useProfileStore(state => state.setAsDefaultProfile);
  const clearNotification = useProfileStore(state => state.clearNotification);
  const loadProfileById = useProfileStore(state => state.loadProfileById);

  // Local state for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  // Form state
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');

  // Handle profile selection
  const handleSelectProfile = (profileId: string) => {
    try {
      // Just select the profile - the grid will be updated elsewhere
      selectProfile(profileId);
      setIsSelectDialogOpen(false);
    } catch (err) {
      console.error('Error selecting profile:', err);
    }
  };

  // Handle profile creation
  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;

    // For Zustand store, we need to provide all parameters
    // We're creating an empty profile since we don't have grid state here
    const success = createNewProfile(
      newProfileName,
      newProfileDescription,
      {}, // Empty settings
      [], // Empty column state
      {}, // Empty filter model
      []  // Empty sort model
    );

    if (success) {
      setIsCreateDialogOpen(false);
      setNewProfileName('');
      setNewProfileDescription('');
    }
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    // For Zustand store, we need to provide all parameters
    // We're updating with empty data since we don't have grid state here
    updateCurrentProfile(
      {}, // Empty settings
      [], // Empty column state
      {}, // Empty filter model
      []  // Empty sort model
    );
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    const success = removeProfile(profileToDelete);

    if (success) {
      setIsDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  // Handle setting default profile
  const handleSetAsDefault = async (profileId: string) => {
    await setAsDefaultProfile(profileId);
  };

  // Get current profile
  const currentProfile = selectedProfileId
    ? profiles.find(p => p.id === selectedProfileId)
    : undefined;

  return (
    <div className="profile-manager flex items-center">
      {/* Current Profile Display */}
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <span className="text-sm font-medium">Profile:</span>
        <Badge variant="outline" className="font-medium">
          {currentProfile?.name || 'None Selected'}
          {currentProfile?.isDefault && (
            <Star className="ml-1 h-3 w-3 text-yellow-500" />
          )}
        </Badge>
      </div>

      {/* Profile Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Profile Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsSelectDialogOpen(true)}>
              <Layers className="mr-2 h-4 w-4" />
              <span>Select Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUpdateProfile} disabled={!selectedProfileId}>
              <Save className="mr-2 h-4 w-4" />
              <span>Save Current Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => selectedProfileId && handleSetAsDefault(selectedProfileId)}
              disabled={!selectedProfileId || currentProfile?.isDefault}
            >
              <Star className="mr-2 h-4 w-4" />
              <span>Set as Default</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (selectedProfileId) {
                  setProfileToDelete(selectedProfileId);
                  setIsDeleteDialogOpen(true);
                }
              }}
              disabled={!selectedProfileId}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <Download className="mr-2 h-4 w-4" />
              <span>Export Profiles</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Upload className="mr-2 h-4 w-4" />
              <span>Import Profiles</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a new profile with the current grid settings
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Profile Name</Label>
              <Input
                id="name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="My Profile"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                placeholder="Description of this profile"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="default-profile" />
              <Label htmlFor="default-profile">Set as default profile</Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile} disabled={!newProfileName.trim() || isLoading}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Profile Dialog */}
      <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Profile</DialogTitle>
            <DialogDescription>
              Choose a profile to load
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select
              value={selectedProfileId || ''}
              onValueChange={(value) => value && handleSelectProfile(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      {profile.name}
                      {profile.isDefault && <Star className="h-3 w-3 text-yellow-500" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsSelectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedProfileId && handleSelectProfile(selectedProfileId)}
              disabled={!selectedProfileId || isLoading}
            >
              Load Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="font-medium">
              {profileToDelete ? profiles.find(p => p.id === profileToDelete)?.name : ''}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setProfileToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProfile}
              disabled={!profileToDelete || isLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Toast would be implemented here */}
    </div>
  );
}