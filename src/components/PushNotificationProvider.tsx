import { createContext, useContext, ReactNode } from 'react';
import { usePushNotifications, PushNotificationState } from '@/hooks/usePushNotifications';

interface PushNotificationContextType extends PushNotificationState {
  requestPermission: () => Promise<boolean>;
  isNativePlatform: boolean;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

export const PushNotificationProvider = ({ children }: { children: ReactNode }) => {
  const pushNotifications = usePushNotifications();

  return (
    <PushNotificationContext.Provider value={pushNotifications}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotificationContext must be used within a PushNotificationProvider');
  }
  return context;
};
