"use client";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  tagFilter: string;
  onTagFilterChange: (tag: string) => void;
  availableTags: string[];
}

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  tagFilter,
  onTagFilterChange,
  availableTags,
}: TaskFiltersProps) {
  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statuses = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "created_desc", label: "Newest First" },
    { value: "created_asc", label: "Oldest First" },
    { value: "priority_desc", label: "Priority (High to Low)" },
    { value: "priority_asc", label: "Priority (Low to High)" },
    { value: "title_asc", label: "Title (A-Z)" },
    { value: "title_desc", label: "Title (Z-A)" },
  ];

  return (
    <div className="bg-obsidian-gray-900 rounded-xl border border-obsidian-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "20px",
            }}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "20px",
            }}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "20px",
            }}
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tag Filter Pills */}
      {availableTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-obsidian-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Filter by tag:</span>
            <button
              onClick={() => onTagFilterChange("")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                tagFilter === ""
                  ? "bg-obsidian-violet-primary text-white"
                  : "bg-obsidian-gray-800 text-gray-400 hover:text-white border border-obsidian-gray-700"
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagFilterChange(tag === tagFilter ? "" : tag)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  tagFilter === tag
                    ? "bg-obsidian-violet-primary text-white"
                    : "bg-obsidian-gray-800 text-gray-400 hover:text-white border border-obsidian-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
