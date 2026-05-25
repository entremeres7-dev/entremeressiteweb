import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/context/AuthContext';
import { handlePushNotificationResponse } from '@/lib/push/handlePushNotificationRoute';

/**
 * Ouvre le bon écran quand l'utilisatrice tape sur une notification push.
 */
export function PushNotificationHandler() {
  const { session, loading } = useAuth();
  const handledIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const id = response.notification.request.identifier;
      if (handledIdRef.current === id) return;
      handledIdRef.current = id;
      handlePushNotificationResponse(response);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handledIdRef.current = response.notification.request.identifier;
      handlePushNotificationResponse(response);
    });

    return () => subscription.remove();
  }, [loading, session]);

  return null;
}
