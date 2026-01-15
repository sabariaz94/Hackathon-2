import { useState, useEffect } from 'react';
import {
  requestNotificationPermission,
  isNotificationPermissionGranted,
  isNotificationPermissionDenied,
  isNotificationPermissionDefault
} from '@/lib/notifications';

/**
 * Custom hook for handling browser notification permissions
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize permission state
  useEffect(() => {
    try {
      if (!('Notification' in window)) {
        setError('Browser notifications are not supported');
        setLoading(false);
        return;
      }

      setPermission(Notification.permission);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  // Request permission from user
  const requestPermission = async (): Promise<NotificationPermission> => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if notification permission is granted
  const isGranted = permission === 'granted';

  // Check if notification permission is denied
  const isDenied = permission === 'denied';

  // Check if notification permission is default (not yet requested)
  const isDefault = permission === 'default';

  return {
    permission,
    isGranted,
    isDenied,
    isDefault,
    loading,
    error,
    requestPermission,
  };
}