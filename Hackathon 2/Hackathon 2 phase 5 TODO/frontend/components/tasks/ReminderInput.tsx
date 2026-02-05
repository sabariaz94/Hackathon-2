"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReminderInputProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  date: string;
  onDateChange: (date: string) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

/**
 * Get day name from date string
 */
function getDayName(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/**
 * Format date for display
 */
function formatDateDisplay(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) {
    return "Today";
  } else if (dateOnly.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format time for display
 */
function formatTimeDisplay(timeString: string): string {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Get minimum date (today)
 */
function getMinDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export default function ReminderInput({
  enabled,
  onEnabledChange,
  date,
  onDateChange,
  time,
  onTimeChange,
}: ReminderInputProps) {
  const [dayName, setDayName] = useState("");

  // Update day name when date changes
  useEffect(() => {
    setDayName(getDayName(date));
  }, [date]);

  // Validate date is in the future
  const isDateValid = !date || new Date(date) >= new Date(getMinDate());

  return (
    <div className="space-y-3">
      {/* Enable/Disable Toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="sr-only"
          />
          <motion.div
            className={`w-10 h-6 rounded-full transition-colors ${
              enabled ? "bg-purple-600" : "bg-zinc-700"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-4 h-4 bg-white rounded-full shadow-md"
              animate={{
                x: enabled ? 22 : 4,
                y: 4,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${enabled ? "text-purple-400" : "text-zinc-500"}`}
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
          <span
            className={`font-medium ${enabled ? "text-white" : "text-zinc-400"}`}
          >
            Set Reminder
          </span>
        </div>
      </label>

      {/* Reminder Fields */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-3">
              {/* Date Picker */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Reminder Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                    min={getMinDate()}
                    className={`w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      !isDateValid
                        ? "border-red-500"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  />
                  {!isDateValid && (
                    <p className="mt-1 text-xs text-red-400">
                      Date must be today or in the future
                    </p>
                  )}
                </div>
              </div>

              {/* Day Name (Read-only) */}
              {dayName && (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-purple-300 font-medium">
                    {formatDateDisplay(date)} ({dayName})
                  </span>
                </div>
              )}

              {/* Time Picker */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-zinc-600 transition-all"
                />
                {time && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Reminder at {formatTimeDisplay(time)}
                  </p>
                )}
              </div>

              {/* Quick Time Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Morning", time: "09:00" },
                  { label: "Noon", time: "12:00" },
                  { label: "Afternoon", time: "14:00" },
                  { label: "Evening", time: "18:00" },
                ].map((preset) => (
                  <motion.button
                    key={preset.label}
                    type="button"
                    onClick={() => onTimeChange(preset.time)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      time === preset.time
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-purple-500 hover:text-purple-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
