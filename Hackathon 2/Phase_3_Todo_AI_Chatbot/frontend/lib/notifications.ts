/**
 * Browser Notification Utility
 * Handles browser notifications for upcoming due tasks
 */

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Check if browser notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    throw new Error('Browser notifications are not supported');
  }

  if (Notification.permission === 'granted') {
    return Notification.permission;
  }

  return await Notification.requestPermission();
}

/**
 * Show a browser notification
 */
export async function showNotification(options: NotificationOptions): Promise<void> {
  if (!isNotificationSupported()) {
    console.warn('Browser notifications are not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  // Create notification
  new Notification(options.title, {
    body: options.body,
    icon: options.icon,
    tag: options.tag,
    requireInteraction: options.requireInteraction
  });
}

/**
 * Check if notification permission is granted
 */
export function isNotificationPermissionGranted(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

/**
 * Check if notification permission is denied
 */
export function isNotificationPermissionDenied(): boolean {
  return isNotificationSupported() && Notification.permission === 'denied';
}

/**
 * Check if notification permission is default (not yet requested)
 */
export function isNotificationPermissionDefault(): boolean {
  return isNotificationSupported() && Notification.permission === 'default';
}