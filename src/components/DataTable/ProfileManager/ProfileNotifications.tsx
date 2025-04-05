/**
 * ProfileNotifications.tsx
 * Component to display notifications from the profile store
 */
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useGridStore } from '../store/unifiedGridStore';

export function ProfileNotifications() {
  // Get notification from the unified store
  const notification = useGridStore(state => state.notification);
  const clearNotification = useGridStore(state => state.clearNotification);

  // Show toast when notification changes
  useEffect(() => {
    if (notification) {
      console.log('ProfileNotifications: Showing notification', notification);
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

  // This component doesn't render anything
  return null;
}
