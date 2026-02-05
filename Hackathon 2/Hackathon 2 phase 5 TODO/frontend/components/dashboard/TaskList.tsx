"use client";

import TaskCard, { Task } from "./TaskCard";
import EmptyState from "./EmptyState";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
  onClearFilters,
  hasFilters,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        type={hasFilters ? "no-results" : "no-tasks"}
        onAddTask={onAddTask}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
