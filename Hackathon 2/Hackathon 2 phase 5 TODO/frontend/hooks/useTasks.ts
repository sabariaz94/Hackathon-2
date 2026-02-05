"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Task,
  TaskCreate,
  TaskUpdate,
  tasksApi,
  filterTasks,
  sortTasks,
  extractTags,
} from "@/lib/api";

// ============================================================================
// Types
// ============================================================================

export interface UseTasksOptions {
  autoFetch?: boolean;
}

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  tag: string;
  sortBy: string;
}

export interface UseTasksReturn {
  // Data
  tasks: Task[];
  filteredTasks: Task[];
  availableTags: string[];

  // Loading & Error States
  isLoading: boolean;
  error: string | null;
  isMutating: boolean;

  // Filters
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // CRUD Operations
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskCreate) => Promise<Task | null>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleComplete: (id: string) => Promise<Task | null>;

  // Batch Operations
  deleteMultiple: (ids: string[]) => Promise<boolean>;
  completeMultiple: (ids: string[]) => Promise<boolean>;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  priority: "all",
  status: "all",
  tag: "",
  sortBy: "created_desc",
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for task CRUD operations with real-time updates
 *
 * Features:
 * - Automatic data fetching on mount
 * - Optimistic updates for better UX
 * - Built-in filtering and sorting
 * - Error handling with rollback
 * - Loading states for mutations
 *
 * @example
 * ```tsx
 * const {
 *   tasks,
 *   filteredTasks,
 *   isLoading,
 *   createTask,
 *   updateTask,
 *   deleteTask,
 *   toggleComplete,
 *   filters,
 *   setFilters,
 * } = useTasks();
 * ```
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { autoFetch = true } = options;

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  // ========================================
  // Derived State
  // ========================================

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, {
      search: filters.search,
      priority: filters.priority,
      status: filters.status,
      tag: filters.tag,
    });
    return sortTasks(filtered, filters.sortBy);
  }, [tasks, filters]);

  // Extract unique tags from all tasks
  const availableTags = useMemo(() => extractTags(tasks), [tasks]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.priority !== "all" ||
      filters.status !== "all" ||
      filters.tag !== ""
    );
  }, [filters]);

  // ========================================
  // Filter Actions
  // ========================================

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ========================================
  // Fetch Tasks
  // ========================================

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await tasksApi.getAll();

    if (apiError) {
      setError(apiError);
      setTasks([]);
    } else if (data) {
      setTasks(data);
    }

    setIsLoading(false);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, fetchTasks]);

  // ========================================
  // Create Task
  // ========================================

  const createTask = useCallback(
    async (taskData: TaskCreate): Promise<Task | null> => {
      setIsMutating(true);
      setError(null);

      const { data, error: apiError } = await tasksApi.create(taskData);

      if (apiError) {
        setError(apiError);
        setIsMutating(false);
        return null;
      }

      if (data) {
        // Add new task to the beginning of the list (newest first)
        setTasks((prev) => [data, ...prev]);
      }

      setIsMutating(false);
      return data || null;
    },
    []
  );

  // ========================================
  // Update Task
  // ========================================

  const updateTask = useCallback(
    async (id: string, updates: TaskUpdate): Promise<Task | null> => {
      setIsMutating(true);
      setError(null);

      // Store original for rollback
      const originalTask = tasks.find((t) => t.id === id);

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } as Task : task
        )
      );

      const { data, error: apiError } = await tasksApi.update(id, updates);

      if (apiError) {
        // Rollback on error
        if (originalTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? originalTask : task))
          );
        }
        setError(apiError);
        setIsMutating(false);
        return null;
      }

      // Update with server response (ensures consistency)
      if (data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? data : task))
        );
      }

      setIsMutating(false);
      return data || null;
    },
    [tasks]
  );

  // ========================================
  // Delete Task
  // ========================================

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setIsMutating(true);
      setError(null);

      // Store original for rollback
      const originalTasks = [...tasks];

      // Optimistic delete
      setTasks((prev) => prev.filter((task) => task.id !== id));

      const { error: apiError } = await tasksApi.delete(id);

      if (apiError) {
        // Rollback on error
        setTasks(originalTasks);
        setError(apiError);
        setIsMutating(false);
        return false;
      }

      setIsMutating(false);
      return true;
    },
    [tasks]
  );

  // ========================================
  // Toggle Complete
  // ========================================

  const toggleComplete = useCallback(
    async (id: string): Promise<Task | null> => {
      setIsMutating(true);
      setError(null);

      // Find and store original task for rollback
      const originalTask = tasks.find((t) => t.id === id);

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completion_date: !task.completed
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
              }
            : task
        )
      );

      const { data, error: apiError } = await tasksApi.toggleComplete(id);

      if (apiError) {
        // Rollback on error
        if (originalTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? originalTask : task))
          );
        }
        setError(apiError);
        setIsMutating(false);
        return null;
      }

      // Update with server response
      if (data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? data : task))
        );
      }

      setIsMutating(false);
      return data || null;
    },
    [tasks]
  );

  // ========================================
  // Batch Operations
  // ========================================

  const deleteMultiple = useCallback(
    async (ids: string[]): Promise<boolean> => {
      setIsMutating(true);
      setError(null);

      // Store original for rollback
      const originalTasks = [...tasks];

      // Optimistic delete
      setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));

      // Delete all tasks
      const results = await Promise.all(
        ids.map((id) => tasksApi.delete(id))
      );

      // Check for errors
      const hasError = results.some((r) => r.error);
      if (hasError) {
        // Rollback on any error
        setTasks(originalTasks);
        setError("Failed to delete some tasks");
        setIsMutating(false);
        return false;
      }

      setIsMutating(false);
      return true;
    },
    [tasks]
  );

  const completeMultiple = useCallback(
    async (ids: string[]): Promise<boolean> => {
      setIsMutating(true);
      setError(null);

      // Store original for rollback
      const originalTasks = [...tasks];

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          ids.includes(task.id)
            ? {
                ...task,
                completed: true,
                completion_date: new Date().toISOString().split("T")[0],
              } as Task
            : task
        )
      );

      // Toggle all tasks
      const results = await Promise.all(
        ids.map((id) => tasksApi.toggleComplete(id))
      );

      // Check for errors
      const hasError = results.some((r) => r.error);
      if (hasError) {
        // Rollback on any error
        setTasks(originalTasks);
        setError("Failed to complete some tasks");
        setIsMutating(false);
        return false;
      }

      // Update with server responses
      results.forEach((result) => {
        if (result.data) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === result.data!.id ? result.data! : task
            )
          );
        }
      });

      setIsMutating(false);
      return true;
    },
    [tasks]
  );

  // ========================================
  // Return
  // ========================================

  return {
    // Data
    tasks,
    filteredTasks,
    availableTags,

    // Loading & Error States
    isLoading,
    error,
    isMutating,

    // Filters
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,

    // CRUD Operations
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,

    // Batch Operations
    deleteMultiple,
    completeMultiple,
  };
}

export default useTasks;
