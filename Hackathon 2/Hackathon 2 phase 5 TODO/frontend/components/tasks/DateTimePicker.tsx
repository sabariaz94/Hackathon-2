"use client";

import { useState } from "react";

interface DateTimePickerProps {
  dueDate: string;
  dueTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  showTimePicker?: boolean;
}

export default function DateTimePicker({
  dueDate,
  dueTime,
  onDateChange,
  onTimeChange,
  showTimePicker = true,
}: DateTimePickerProps) {
  const [showTime, setShowTime] = useState(!!dueTime);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Date input */}
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1.5">Due Date</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
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
            <input
              type="date"
              value={dueDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all [color-scheme:dark]"
              aria-label="Due date"
            />
          </div>
        </div>

        {/* Time input */}
        {showTimePicker && showTime && (
          <div className="w-40">
            <label className="block text-sm text-gray-400 mb-1.5">Time</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all [color-scheme:dark]"
                aria-label="Due time"
              />
            </div>
          </div>
        )}
      </div>

      {/* Toggle time picker */}
      {showTimePicker && !showTime && (
        <button
          type="button"
          onClick={() => setShowTime(true)}
          className="text-sm text-obsidian-violet-light hover:text-obsidian-violet-primary transition-colors"
        >
          + Add time
        </button>
      )}

      {/* Clear date */}
      {dueDate && (
        <button
          type="button"
          onClick={() => {
            onDateChange("");
            onTimeChange("");
            setShowTime(false);
          }}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear due date
        </button>
      )}
    </div>
  );
}
