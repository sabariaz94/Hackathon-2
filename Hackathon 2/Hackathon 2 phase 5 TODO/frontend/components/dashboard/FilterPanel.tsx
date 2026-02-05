"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  status: "all" | "pending" | "completed";
  priority: "all" | "high" | "medium" | "low";
  selectedTags: string[];
  dateFrom: string;
  dateTo: string;
  overdue: boolean;
  dueSoon: boolean;
}

export const defaultFilters: FilterState = {
  status: "all",
  priority: "all",
  selectedTags: [],
  dateFrom: "",
  dateTo: "",
  overdue: false,
  dueSoon: false,
};

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
}

export default function FilterPanel({ filters, onFilterChange, availableTags }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.selectedTags.length > 0,
    filters.dateFrom !== "",
    filters.dateTo !== "",
    filters.overdue,
    filters.dueSoon,
  ].filter(Boolean).length;

  const update = (partial: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const clearAll = () => onFilterChange(defaultFilters);

  const removeFilter = (key: string) => {
    switch (key) {
      case "status": update({ status: "all" }); break;
      case "priority": update({ priority: "all" }); break;
      case "tags": update({ selectedTags: [] }); break;
      case "dateFrom": update({ dateFrom: "" }); break;
      case "dateTo": update({ dateTo: "" }); break;
      case "overdue": update({ overdue: false }); break;
      case "dueSoon": update({ dueSoon: false }); break;
    }
  };

  const activeChips: { key: string; label: string }[] = [];
  if (filters.status !== "all") activeChips.push({ key: "status", label: `Status: ${filters.status}` });
  if (filters.priority !== "all") activeChips.push({ key: "priority", label: `Priority: ${filters.priority}` });
  if (filters.selectedTags.length > 0) activeChips.push({ key: "tags", label: `Tags: ${filters.selectedTags.join(", ")}` });
  if (filters.dateFrom) activeChips.push({ key: "dateFrom", label: `From: ${filters.dateFrom}` });
  if (filters.dateTo) activeChips.push({ key: "dateTo", label: `To: ${filters.dateTo}` });
  if (filters.overdue) activeChips.push({ key: "overdue", label: "Overdue" });
  if (filters.dueSoon) activeChips.push({ key: "dueSoon", label: "Due soon" });

  const selectClasses = "w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all";

  return (
    <div className="bg-obsidian-gray-900 rounded-xl border border-obsidian-gray-700 p-4 mb-6">
      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-obsidian-violet-primary/20 text-obsidian-violet-light border border-obsidian-violet-primary/30"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeFilter(chip.key)}
                className="ml-1 hover:text-white transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-obsidian-violet-primary text-white">
            {activeFilterCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible filter panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-obsidian-gray-700">
              {/* Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => update({ status: e.target.value as FilterState["status"] })}
                  className={selectClasses}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => update({ priority: e.target.value as FilterState["priority"] })}
                  className={selectClasses}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => update({ dateFrom: e.target.value })}
                  className={selectClasses}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => update({ dateTo: e.target.value })}
                  className={selectClasses}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      filters.overdue ? "bg-obsidian-violet-primary" : "bg-obsidian-gray-700"
                    }`}
                    onClick={() => update({ overdue: !filters.overdue })}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        filters.overdue ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-300">Overdue only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      filters.dueSoon ? "bg-obsidian-violet-primary" : "bg-obsidian-gray-700"
                    }`}
                    onClick={() => update({ dueSoon: !filters.dueSoon })}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        filters.dueSoon ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-300">Due soon</span>
                </label>
              </div>
            </div>

            {/* Tags multi-select */}
            {availableTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-obsidian-gray-700">
                <label className="block text-sm text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = filters.selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          update({
                            selectedTags: isSelected
                              ? filters.selectedTags.filter((t) => t !== tag)
                              : [...filters.selectedTags, tag],
                          })
                        }
                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                          isSelected
                            ? "bg-obsidian-violet-primary text-white"
                            : "bg-obsidian-gray-800 text-gray-400 hover:text-white border border-obsidian-gray-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
