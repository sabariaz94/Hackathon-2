"use client";

import { useMemo } from "react";
import { Task, TaskStats, calculateStats } from "@/lib/api";

// ============================================================================
// Types
// ============================================================================

export interface UseStatsReturn {
  stats: TaskStats;
  completionRate: number;
  priorityBreakdown: {
    high: { count: number; percentage: number };
    medium: { count: number; percentage: number };
    low: { count: number; percentage: number };
  };
  recentCompletions: Task[];
  upcomingHighPriority: Task[];
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for calculating task statistics
 *
 * Provides:
 * - Basic counts (total, pending, completed, by priority)
 * - Completion rate percentage
 * - Priority breakdown with percentages
 * - Recent completions list
 * - Upcoming high priority tasks
 *
 * @param tasks - Array of tasks to calculate stats from
 * @returns Statistics and derived data
 *
 * @example
 * ```tsx
 * const { stats, completionRate, priorityBreakdown } = useStats(tasks);
 * ```
 */
export function useStats(tasks: Task[]): UseStatsReturn {
  // ========================================
  // Basic Stats
  // ========================================

  const stats = useMemo(() => calculateStats(tasks), [tasks]);

  // ========================================
  // Completion Rate
  // ========================================

  const completionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  // ========================================
  // Priority Breakdown
  // ========================================

  const priorityBreakdown = useMemo(() => {
    const pendingCount = stats.pending;

    const highPercentage =
      pendingCount > 0
        ? Math.round((stats.highPriority / pendingCount) * 100)
        : 0;
    const mediumPercentage =
      pendingCount > 0
        ? Math.round((stats.mediumPriority / pendingCount) * 100)
        : 0;
    const lowPercentage =
      pendingCount > 0
        ? Math.round((stats.lowPriority / pendingCount) * 100)
        : 0;

    return {
      high: { count: stats.highPriority, percentage: highPercentage },
      medium: { count: stats.mediumPriority, percentage: mediumPercentage },
      low: { count: stats.lowPriority, percentage: lowPercentage },
    };
  }, [stats]);

  // ========================================
  // Recent Completions (last 5)
  // ========================================

  const recentCompletions = useMemo(() => {
    return tasks
      .filter((t) => t.completed && t.completion_date)
      .sort((a, b) => {
        const dateA = a.completion_date ? new Date(a.completion_date).getTime() : 0;
        const dateB = b.completion_date ? new Date(b.completion_date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tasks]);

  // ========================================
  // Upcoming High Priority (pending, high priority)
  // ========================================

  const upcomingHighPriority = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.priority === "high")
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(0, 5);
  }, [tasks]);

  // ========================================
  // Return
  // ========================================

  return {
    stats,
    completionRate,
    priorityBreakdown,
    recentCompletions,
    upcomingHighPriority,
  };
}

export default useStats;
