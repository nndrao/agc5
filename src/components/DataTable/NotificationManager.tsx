/**
 * NotificationManager.tsx
 * Component to display notifications from the unified grid store
 */
import { useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationManagerProps {
  notification: { type: 'success' | 'error' | 'info' | null; message: string } | null;
  onClear: () => void;
}

export function NotificationManager({ notification, onClear }: NotificationManagerProps) {
  // Show toast when notification changes
  useEffect(() => {
    if (notification) {
      console.log('NotificationManager: Showing notification', notification);
      
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
      onClear();
    }
  }, [notification, onClear]);
  
  // This component doesn't render anything
  return null;
}
