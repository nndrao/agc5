/**
 * ProfileNotificationsProvider.tsx
 * Component to provide notifications from the profile store
 */
import { ReactNode, useEffect } from 'react';
import { useGridStore } from '../store/unifiedGridStore';
import { ProfileNotifications } from './ProfileNotifications';

interface ProfileNotificationsProviderProps {
  children: ReactNode;
}

export function ProfileNotificationsProvider({ children }: ProfileNotificationsProviderProps) {
  // Initialize profile store
  const loadProfiles = useGridStore(state => state.loadProfiles);

  // Load profiles on component mount
  useEffect(() => {
    console.log('ProfileNotificationsProvider: Loading profiles');
    loadProfiles();
  }, [loadProfiles]);

  return (
    <>
      <ProfileNotifications />
      {children}
    </>
  );
}
