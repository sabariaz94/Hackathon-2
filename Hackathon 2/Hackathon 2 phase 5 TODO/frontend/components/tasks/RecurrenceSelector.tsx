"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface RecurrenceState {
  enabled: boolean;
  pattern: "daily" | "weekly" | "monthly";
  interval: number;
  weekDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  monthDay: number;
  endDate: string;
  neverEnds: boolean;
}

export const defaultRecurrence: RecurrenceState = {
  enabled: false,
  pattern: "daily",
  interval: 1,
  weekDays: [],
  monthDay: 1,
  endDate: "",
  neverEnds: true,
};

interface RecurrenceSelectorProps {
  recurrence: RecurrenceState;
  onChange: (recurrence: RecurrenceState) => void;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecurrenceSelector({ recurrence, onChange }: RecurrenceSelectorProps) {
  const update = (partial: Partial<RecurrenceState>) => {
    onChange({ ...recurrence, ...partial });
  };

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`relative w-10 h-5 rounded-full transition-colors ${
            recurrence.enabled ? "bg-obsidian-violet-primary" : "bg-obsidian-gray-700"
          }`}
          onClick={() => update({ enabled: !recurrence.enabled })}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              recurrence.enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-gray-300">Make recurring</span>
      </label>

      <AnimatePresence>
        {recurrence.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-4"
          >
            {/* Pattern */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Pattern</label>
              <div className="flex gap-2">
                {(["daily", "weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update({ pattern: p })}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                      recurrence.pattern === p
                        ? "bg-obsidian-violet-primary text-white"
                        : "bg-obsidian-gray-800 text-gray-400 border border-obsidian-gray-700 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Interval */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={recurrence.interval}
                  onChange={(e) => update({ interval: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-20 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-3 py-2.5 text-white text-center focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
                />
                <span className="text-sm text-gray-400">
                  {recurrence.pattern === "daily" && (recurrence.interval === 1 ? "day" : "days")}
                  {recurrence.pattern === "weekly" && (recurrence.interval === 1 ? "week" : "weeks")}
                  {recurrence.pattern === "monthly" && (recurrence.interval === 1 ? "month" : "months")}
                </span>
              </div>
            </div>

            {/* Weekly: day checkboxes */}
            {recurrence.pattern === "weekly" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">On days</label>
                <div className="flex gap-1.5">
                  {WEEK_DAYS.map((day, i) => {
                    const isSelected = recurrence.weekDays.includes(i);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          update({
                            weekDays: isSelected
                              ? recurrence.weekDays.filter((d) => d !== i)
                              : [...recurrence.weekDays, i],
                          })
                        }
                        className={`w-10 h-10 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-obsidian-violet-primary text-white"
                            : "bg-obsidian-gray-800 text-gray-400 border border-obsidian-gray-700 hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly: day of month */}
            {recurrence.pattern === "monthly" && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Day of month</label>
                <select
                  value={recurrence.monthDay}
                  onChange={(e) => update({ monthDay: parseInt(e.target.value) })}
                  className="w-24 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* End date */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-2">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    recurrence.neverEnds ? "bg-obsidian-violet-primary" : "bg-obsidian-gray-700"
                  }`}
                  onClick={() => update({ neverEnds: !recurrence.neverEnds, endDate: "" })}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      recurrence.neverEnds ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-300">Never ends</span>
              </label>

              {!recurrence.neverEnds && (
                <input
                  type="date"
                  value={recurrence.endDate}
                  onChange={(e) => update({ endDate: e.target.value })}
                  className="bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all [color-scheme:dark]"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
