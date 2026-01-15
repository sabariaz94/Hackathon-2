import { Todo } from '@/types/todo';
import { showNotification, isNotificationPermissionGranted } from '@/lib/notifications';

/**
 * Reminder Service
 * Handles scheduling and showing notifications for upcoming due tasks
 */

interface Reminder {
  id: number;
  todoId: number;
  scheduledTime: Date;
  notificationTitle: string;
  notificationBody: string;
}

class ReminderService {
  private reminders: Map<number, NodeJS.Timeout> = new Map(); // Map of reminderId to timeoutId
  private activeReminders: Map<number, Reminder> = new Map(); // Map of todoId to reminder

  /**
   * Schedule a reminder for a todo
   */
  public scheduleReminder(todo: Todo): void {
    if (!todo.due_date || !todo.reminder_time) {
      return; // No due date or reminder time, nothing to schedule
    }

    // Clear any existing reminder for this todo
    this.clearReminder(todo.id);

    // Calculate the time when the reminder should be shown
    const dueDate = new Date(todo.due_date);
    const reminderTime = dueDate.getTime() - (todo.reminder_time * 60 * 1000); // Convert minutes to milliseconds
    const now = new Date().getTime();

    if (reminderTime <= now) {
      // Reminder time has already passed, show notification immediately if still relevant
      if (!todo.completed) {
        this.showReminderNotification(todo);
      }
      return;
    }

    // Schedule the reminder
    const timeUntilReminder = reminderTime - now;
    const timeoutId = setTimeout(() => {
      this.showReminderNotification(todo);
      this.removeReminder(todo.id);
    }, timeUntilReminder);

    // Store the reminder
    const reminder: Reminder = {
      id: todo.id,
      todoId: todo.id,
      scheduledTime: new Date(reminderTime),
      notificationTitle: 'Todo Reminder',
      notificationBody: `Your task "${todo.description}" is due soon!`
    };

    this.reminders.set(todo.id, timeoutId);
    this.activeReminders.set(todo.id, reminder);
  }

  /**
   * Show a notification for a todo reminder
   */
  private showReminderNotification(todo: Todo): void {
    if (!isNotificationPermissionGranted()) {
      console.warn('Notification permission not granted, cannot show reminder');
      return;
    }

    showNotification({
      title: 'Todo Reminder',
      body: `Your task "${todo.description}" is due soon!`,
      tag: `todo-reminder-${todo.id}`
    });
  }

  /**
   * Clear a scheduled reminder for a todo
   */
  public clearReminder(todoId: number): void {
    const timeoutId = this.reminders.get(todoId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reminders.delete(todoId);
    }

    this.activeReminders.delete(todoId);
  }

  /**
   * Schedule reminders for multiple todos
   */
  public scheduleReminders(todos: Todo[]): void {
    todos.forEach(todo => this.scheduleReminder(todo));
  }

  /**
   * Clear all scheduled reminders
   */
  public clearAllReminders(): void {
    // Clear all timeouts
    this.reminders.forEach(timeoutId => clearTimeout(timeoutId));

    // Clear the maps
    this.reminders.clear();
    this.activeReminders.clear();
  }

  /**
   * Update a reminder when a todo is updated
   */
  public updateReminder(todo: Todo): void {
    this.clearReminder(todo.id);
    this.scheduleReminder(todo);
  }

  /**
   * Remove a reminder when a todo is deleted
   */
  public removeReminder(todoId: number): void {
    this.clearReminder(todoId);
  }

  /**
   * Get all active reminders
   */
  public getActiveReminders(): Reminder[] {
    return Array.from(this.activeReminders.values());
  }

  /**
   * Check if notifications are supported in this browser
   */
  public static isSupported(): boolean {
    return 'Notification' in window;
  }
}

// Create a singleton instance
export const reminderService = new ReminderService();