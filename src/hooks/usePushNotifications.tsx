import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { toast } from '@/hooks/use-toast';

export interface PushNotificationState {
  token: string | null;
  notifications: PushNotificationSchema[];
  permissionGranted: boolean;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    token: null,
    notifications: [],
    permissionGranted: false
  });

  useEffect(() => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const setupPushNotifications = async () => {
      try {
        // Request permission
        const permissionResult = await PushNotifications.requestPermissions();
        
        if (permissionResult.receive === 'granted') {
          setState(prev => ({ ...prev, permissionGranted: true }));
          
          // Register for push notifications
          await PushNotifications.register();
        } else {
          toast({
            title: 'Push notifications disabled',
            description: 'Enable notifications in your device settings to receive updates.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    // Add listeners
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token:', token.value);
      setState(prev => ({ ...prev, token: token.value }));
      
      // TODO: Send this token to your backend to store for sending notifications
      toast({
        title: 'Notifications enabled',
        description: 'You will now receive push notifications.'
      });
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
      toast({
        title: 'Notification setup failed',
        description: 'Could not register for push notifications.',
        variant: 'destructive'
      });
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      setState(prev => ({
        ...prev,
        notifications: [...prev.notifications, notification]
      }));
      
      // Show toast for foreground notifications
      toast({
        title: notification.title || 'New notification',
        description: notification.body || ''
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push notification action performed:', action);
      // Handle notification tap - navigate to relevant content
      const data = action.notification.data;
      if (data?.movieId) {
        window.location.href = `/movie/${data.movieId}`;
      }
    });

    setupPushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  const requestPermission = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: 'Not available',
        description: 'Push notifications are only available in the mobile app.',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
        setState(prev => ({ ...prev, permissionGranted: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  return {
    ...state,
    requestPermission,
    isNativePlatform: Capacitor.isNativePlatform()
  };
};
