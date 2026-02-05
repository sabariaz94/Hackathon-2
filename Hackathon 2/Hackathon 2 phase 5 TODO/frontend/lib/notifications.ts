/**
 * Browser notification service for task reminders.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showNotification(
  title: string,
  body: string,
  taskId?: string
) {
  if (Notification.permission !== "granted") return;
  const notification = new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag: taskId || "default",
  });
  notification.onclick = () => {
    window.focus();
    if (taskId) window.location.href = `/dashboard?task=${taskId}`;
  };
}

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW registration failed:", err));
  }
}
