/* Service worker for push notifications */

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Task Reminder", {
      body: data.body || "You have a task due soon!",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { taskId: data.taskId },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const taskId = event.notification.data?.taskId;
  event.waitUntil(
    clients.openWindow(taskId ? `/dashboard?task=${taskId}` : "/dashboard")
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(clients.claim())
);
