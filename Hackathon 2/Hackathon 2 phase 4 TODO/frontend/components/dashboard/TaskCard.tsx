"use client";

import { useState } from "react";
import { Task } from "@/lib/api";

export type { Task };

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Format reminder date/time for display
 * Shows "Today at 3:00 PM", "Tomorrow at 3:00 PM", or "Friday at 3:00 PM"
 */
function formatReminderDateTime(
  dateString: string,
  timeString: string
): string {
  const reminderDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reminderDateOnly = new Date(reminderDate);
  reminderDateOnly.setHours(0, 0, 0, 0);

  // Format time
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const formattedTime = `${displayHours}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  // Format date
  let dateLabel: string;
  if (reminderDateOnly.getTime() === today.getTime()) {
    dateLabel = "Today";
  } else if (reminderDateOnly.getTime() === tomorrow.getTime()) {
    dateLabel = "Tomorrow";
  } else {
    // Show day name for this week, or full date
    const daysDiff = Math.floor(
      (reminderDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff < 7) {
      dateLabel = reminderDate.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      dateLabel = reminderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }

  return `${dateLabel} at ${formattedTime}`;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityStyles = {
    low: {
      border: "border-l-obsidian-success",
      badge: "bg-obsidian-success/10 text-obsidian-success border-obsidian-success/30",
      text: "Low",
    },
    medium: {
      border: "border-l-obsidian-warning",
      badge: "bg-obsidian-warning/10 text-obsidian-warning border-obsidian-warning/30",
      text: "Medium",
    },
    high: {
      border: "border-l-obsidian-danger",
      badge: "bg-obsidian-danger/10 text-obsidian-danger border-obsidian-danger/30",
      text: "High",
    },
  };

  const priority = priorityStyles[task.priority || "medium"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        className={`bg-obsidian-gray-900 rounded-xl border-l-4 ${priority.border} border border-obsidian-gray-700 p-5 hover:border-obsidian-violet-primary/50 transition-all group ${
          task.completed ? "opacity-60" : ""
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`flex-shrink-0 w-6 h-6 mt-1 rounded-md border-2 flex items-center justify-center transition-all ${
              task.completed
                ? "bg-obsidian-violet-primary border-obsidian-violet-primary"
                : "border-obsidian-gray-600 hover:border-obsidian-violet-primary"
            }`}
          >
            {task.completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3
                className={`font-semibold text-white ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </h3>

              {/* Priority Badge */}
              <span
                className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded border ${priority.badge}`}
              >
                {priority.text}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p
                className={`text-sm mb-3 ${
                  task.completed ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {task.description.length > 150
                  ? `${task.description.substring(0, 150)}...`
                  : task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-obsidian-gray-800 border border-obsidian-gray-700 text-obsidian-violet-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reminder Display */}
            {task.reminder && (
              <div
                className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border ${
                  task.reminder.sent
                    ? "bg-obsidian-success/10 border-obsidian-success/30"
                    : "bg-purple-500/10 border-purple-500/30"
                }`}
              >
                {/* Bell Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    task.reminder.sent ? "text-obsidian-success" : "text-purple-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>

                {/* Reminder Date/Time */}
                <span
                  className={`text-sm ${
                    task.reminder.sent ? "text-obsidian-success" : "text-purple-300"
                  }`}
                >
                  {formatReminderDateTime(
                    task.reminder.reminder_date,
                    task.reminder.reminder_time
                  )}
                </span>

                {/* Sent Status Checkmark */}
                {task.reminder.sent && (
                  <div className="flex items-center gap-1 ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-obsidian-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs text-obsidian-success">Sent</span>
                  </div>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Created {formatDate(task.created_at)}
              </span>

              {task.completed && task.completion_date && (
                <span className="flex items-center gap-1 text-obsidian-success">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Completed {formatDate(task.completion_date)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            className={`flex-shrink-0 flex gap-2 transition-opacity ${
              showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg bg-obsidian-gray-800 text-gray-400 hover:text-obsidian-violet-light hover:bg-obsidian-gray-700 transition-all"
              title="Edit task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg bg-obsidian-gray-800 text-gray-400 hover:text-obsidian-danger hover:bg-red-500/10 transition-all"
              title="Delete task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-xl p-6 max-w-sm w-full slide-up">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Task</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete &quot;{task.title}&quot;? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-obsidian-gray-800 text-white hover:bg-obsidian-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
