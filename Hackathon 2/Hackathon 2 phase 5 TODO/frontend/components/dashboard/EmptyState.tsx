"use client";

interface EmptyStateProps {
  type: "no-tasks" | "no-results";
  onAddTask?: () => void;
  onClearFilters?: () => void;
}

export default function EmptyState({
  type,
  onAddTask,
  onClearFilters,
}: EmptyStateProps) {
  if (type === "no-tasks") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {/* Illustration */}
        <div className="w-32 h-32 rounded-full bg-obsidian-gray-900 border border-obsidian-gray-700 flex items-center justify-center mb-8 glow-violet">
          <svg
            className="w-16 h-16 text-obsidian-violet-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3">
          No Tasks Yet
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-8 max-w-md">
          You haven&apos;t created any tasks yet. Get started by adding your first
          task and take control of your productivity!
        </p>

        {/* CTA Button */}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-obsidian-violet-primary text-white font-medium hover:bg-obsidian-violet-dark glow-violet transition-all"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Your First Task
          </button>
        )}

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <div className="p-4 rounded-lg bg-obsidian-gray-900 border border-obsidian-gray-700">
            <div className="text-obsidian-violet-primary mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              Try our AI assistant to create tasks with natural language
            </p>
          </div>
          <div className="p-4 rounded-lg bg-obsidian-gray-900 border border-obsidian-gray-700">
            <div className="text-obsidian-violet-primary mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              Use tags to organize and filter your tasks easily
            </p>
          </div>
          <div className="p-4 rounded-lg bg-obsidian-gray-900 border border-obsidian-gray-700">
            <div className="text-obsidian-violet-primary mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              Set priorities to focus on what matters most
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No search results
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Illustration */}
      <div className="w-24 h-24 rounded-full bg-obsidian-gray-900 border border-obsidian-gray-700 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>

      {/* Description */}
      <p className="text-gray-400 mb-6 max-w-md">
        We couldn&apos;t find any tasks matching your current filters. Try adjusting
        your search or filters.
      </p>

      {/* Clear Filters Button */}
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-obsidian-gray-800 border border-obsidian-gray-700 text-white hover:border-obsidian-violet-primary transition-all"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Clear All Filters
        </button>
      )}
    </div>
  );
}
