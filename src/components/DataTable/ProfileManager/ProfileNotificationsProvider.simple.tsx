/**
 * ProfileNotificationsProvider.simple.tsx
 * A simplified component to provide notifications from the unified store
 */
import { ReactNode, useEffect } from 'react';
import { useGridStore } from '../store/unifiedGridStore';
import { toast } from 'sonner';

interface ProfileNotificationsProviderProps {
  children: ReactNode;
}

export function ProfileNotificationsProvider({ children }: ProfileNotificationsProviderProps) {
  // Initialize profile store
  const loadProfiles = useGridStore(state => state.loadProfiles);
  const notification = useGridStore(state => state.notification);
  const clearNotification = useGridStore(state => state.clearNotification);
  
  // Load profiles on component mount
  useEffect(() => {
    console.log('ProfileNotificationsProvider: Loading profiles');
    loadProfiles();
  }, [loadProfiles]);
  
  // Handle notifications
  useEffect(() => {
    if (notification) {
      console.log('ProfileNotificationsProvider: Showing notification', notification);
      
      // Show toast based on notification type
      switch (notification.type) {
        case 'success':
          toast.success(notification.message);
          break;
        case 'error':
          toast.error(notification.message);
          break;
        case 'info':
          toast.info(notification.message);
          break;
        default:
          toast(notification.message);
          break;
      }
      
      // Clear notification after showing toast
      clearNotification();
    }
  }, [notification, clearNotification]);
  
  return children;
}
