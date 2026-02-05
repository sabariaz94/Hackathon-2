"use client";

import { Task } from "@/lib/api";

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority === "high" && !t.completed
  ).length;

  const stats = [
    {
      label: "Pending Tasks",
      value: pendingCount,
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "violet",
      bgColor: "bg-obsidian-violet-primary/10",
      textColor: "text-obsidian-violet-primary",
      borderColor: "border-obsidian-violet-primary/30",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: (
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "green",
      bgColor: "bg-obsidian-success/10",
      textColor: "text-obsidian-success",
      borderColor: "border-obsidian-success/30",
    },
    {
      label: "High Priority",
      value: highPriorityCount,
      icon: (
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      color: "red",
      bgColor: "bg-obsidian-danger/10",
      textColor: "text-obsidian-danger",
      borderColor: "border-obsidian-danger/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-obsidian-gray-900 rounded-xl p-6 border ${stat.borderColor} hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div
              className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}
            >
              {stat.icon}
            </div>
          </div>
          {/* Progress indicator */}
          <div className="mt-4 h-1 bg-obsidian-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${stat.bgColor.replace("/10", "")} transition-all duration-500`}
              style={{
                width: `${Math.min((stat.value / Math.max(tasks.length, 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
