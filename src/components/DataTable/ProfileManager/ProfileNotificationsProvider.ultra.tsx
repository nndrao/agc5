/**
 * ProfileNotificationsProvider.ultra.tsx
 * An ultra-simplified component to provide notifications from the unified store
 */
import { ReactNode, useEffect, useRef } from 'react';
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

  // Use a ref to track if we've already shown this notification
  const notificationRef = useRef<any>(null);

  // Load profiles on component mount
  useEffect(() => {
    console.log('ProfileNotificationsProvider: Loading profiles');
    loadProfiles();
  }, [loadProfiles]);

  // Handle notifications
  useEffect(() => {
    // Only process if we have a notification
    if (!notification) return;

    // Check if this is a new notification
    const isNewNotification =
      !notificationRef.current ||
      notificationRef.current.message !== notification.message ||
      notificationRef.current.type !== notification.type;

    if (isNewNotification) {
      console.log('ProfileNotificationsProvider: Showing notification', notification);

      // Update the ref to track this notification
      notificationRef.current = { ...notification };

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
      // Use a separate effect for clearing to avoid dependency loops
      const timeoutId = setTimeout(() => {
        clearNotification();
      }, 100);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [notification]); // Only depend on notification, not clearNotification

  return children;
}
