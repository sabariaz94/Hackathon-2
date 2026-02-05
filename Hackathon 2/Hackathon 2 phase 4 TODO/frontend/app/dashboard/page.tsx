"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTasks, useStats } from "@/hooks";
import { authApi, Task, TaskCreate, TaskUpdate } from "@/lib/api";
import {
  Sidebar,
  TaskStats,
  TaskFilters,
  TaskList,
  AddTaskModal,
  AIChatInput,
} from "@/components/dashboard";
import type { TaskFormData } from "@/components/dashboard";

export default function DashboardPage() {
  const router = useRouter();

  // User state
  const [username, setUsername] = useState<string>("User");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);

  // Use custom hooks for tasks
  const {
    tasks,
    filteredTasks,
    availableTags,
    isLoading: isTasksLoading,
    error: tasksError,
    isMutating,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks({ autoFetch: false });

  // Use stats hook
  const { stats, completionRate } = useStats(tasks);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await authApi.me();
      if (error) {
        router.push("/login");
        return;
      }
      if (data) {
        setUsername(data.name || data.email?.split("@")[0] || "User");
      }
      setIsAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  // Fetch tasks after auth check
  useEffect(() => {
    if (!isAuthLoading) {
      fetchTasks();
    }
  }, [isAuthLoading, fetchTasks]);

  // ========================================
  // Task Handlers
  // ========================================

  const handleAddTask = useCallback(
    async (taskData: TaskFormData) => {
      const taskCreate: TaskCreate = {
        title: taskData.title,
        description: taskData.description || undefined,
        priority: taskData.priority,
        tags: taskData.tags,
      };

      // Add reminder if enabled and has valid date/time
      if (taskData.reminder?.enabled && taskData.reminder.date && taskData.reminder.time) {
        taskCreate.reminder = {
          reminder_date: taskData.reminder.date,
          reminder_time: taskData.reminder.time,
        };
      }

      await createTask(taskCreate);
    },
    [createTask]
  );

  const handleEditTask = useCallback(
    async (taskData: TaskFormData) => {
      if (!taskData.id) return;

      const taskUpdate: TaskUpdate = {
        title: taskData.title,
        description: taskData.description || undefined,
        priority: taskData.priority,
        completed: taskData.completed,
        completion_date: taskData.completion_date,
        tags: taskData.tags,
      };

      // Handle reminder
      if (taskData.reminder?.enabled && taskData.reminder.date && taskData.reminder.time) {
        taskUpdate.reminder = {
          reminder_date: taskData.reminder.date,
          reminder_time: taskData.reminder.time,
        };
      } else if (!taskData.reminder?.enabled) {
        // Remove reminder if disabled
        taskUpdate.remove_reminder = true;
      }

      await updateTask(taskData.id, taskUpdate);
      setEditingTask(null);
    },
    [updateTask]
  );

  const handleToggleComplete = useCallback(
    async (id: string) => {
      await toggleComplete(id);
    },
    [toggleComplete]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      await deleteTask(id);
    },
    [deleteTask]
  );

  const handleEditClick = useCallback((task: Task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      completed: task.completed,
      completion_date: task.completion_date || null,
      tags: task.tags || [],
      reminder: task.reminder ? {
        enabled: !task.reminder.sent,
        date: task.reminder.reminder_date,
        time: task.reminder.reminder_time,
      } : undefined,
    });
    setIsModalOpen(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    router.push("/");
  }, [router]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleModalSubmit = useCallback(
    (taskData: TaskFormData) => {
      if (editingTask?.id) {
        handleEditTask(taskData);
      } else {
        handleAddTask(taskData);
      }
    },
    [editingTask, handleEditTask, handleAddTask]
  );

  const handleOpenAddModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  // Handle AI task creation - refresh tasks list
  const handleAITaskCreated = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ========================================
  // Filter Handlers
  // ========================================

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters((prev) => ({ ...prev, search }));
    },
    [setFilters]
  );

  const handlePriorityChange = useCallback(
    (priority: string) => {
      setFilters((prev) => ({ ...prev, priority }));
    },
    [setFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters((prev) => ({ ...prev, status }));
    },
    [setFilters]
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      setFilters((prev) => ({ ...prev, sortBy }));
    },
    [setFilters]
  );

  const handleTagFilterChange = useCallback(
    (tag: string) => {
      setFilters((prev) => ({ ...prev, tag }));
    },
    [setFilters]
  );

  // ========================================
  // Render
  // ========================================

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-obsidian-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-black">
      {/* Sidebar */}
      <Sidebar username={username} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My <span className="gradient-text">Tasks</span>
            </h1>
            <p className="text-gray-400">
              {stats.total > 0
                ? `${stats.pending} pending • ${stats.completed} completed • ${completionRate}% done`
                : "Manage and track your tasks efficiently"}
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            disabled={isMutating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-obsidian-violet-primary text-white font-medium hover:bg-obsidian-violet-dark glow-violet transition-all disabled:opacity-50"
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
            Add Task
          </button>
        </div>

        {/* AI Chat Input */}
        <div className="mb-6">
          <AIChatInput onTaskCreated={handleAITaskCreated} />
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Error Message */}
        {tasksError && (
          <div className="mb-6 p-4 rounded-lg bg-obsidian-danger/10 border border-obsidian-danger/30 text-obsidian-danger">
            <div className="flex items-center gap-2">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{tasksError}</span>
              <button
                onClick={fetchTasks}
                className="ml-auto text-obsidian-danger hover:text-red-300 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <TaskFilters
          searchQuery={filters.search}
          onSearchChange={handleSearchChange}
          priorityFilter={filters.priority}
          onPriorityChange={handlePriorityChange}
          statusFilter={filters.status}
          onStatusChange={handleStatusChange}
          sortBy={filters.sortBy}
          onSortChange={handleSortChange}
          tagFilter={filters.tag}
          onTagFilterChange={handleTagFilterChange}
          availableTags={availableTags}
        />

        {/* Loading State */}
        {isTasksLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner"></div>
          </div>
        ) : (
          /* Task List */
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onAddTask={handleOpenAddModal}
            onClearFilters={clearFilters}
            hasFilters={hasActiveFilters}
          />
        )}
      </main>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editTask={editingTask}
      />
    </div>
  );
}
