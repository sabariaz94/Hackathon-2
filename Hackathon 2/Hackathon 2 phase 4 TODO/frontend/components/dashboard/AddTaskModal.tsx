"use client";

import { useState, useEffect, useRef } from "react";
import ReminderInput from "../tasks/ReminderInput";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => void;
  editTask?: TaskFormData | null;
}

export interface ReminderFormData {
  enabled: boolean;
  date: string;
  time: string;
}

export interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  completion_date: string | null;
  tags: string[];
  reminder?: ReminderFormData;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  editTask,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "low",
    completed: false,
    completion_date: null,
    tags: [],
    reminder: {
      enabled: false,
      date: "",
      time: "09:00",
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes or editTask changes
  useEffect(() => {
    if (editTask) {
      setFormData({
        ...editTask,
        reminder: editTask.reminder || {
          enabled: false,
          date: "",
          time: "09:00",
        },
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "low",
        completed: false,
        completion_date: null,
        tags: [],
        reminder: {
          enabled: false,
          date: "",
          time: "09:00",
        },
      });
    }
    setErrors({});
    setTagInput("");
  }, [isOpen, editTask]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      if (tag.length <= 30) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
        setTagInput("");
      } else {
        setErrors({ ...errors, tags: "Tag must be max 30 characters" });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be max 200 characters";
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "Description must be max 2000 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-obsidian-gray-700">
          <h2 className="text-xl font-bold text-white">
            {editTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-obsidian-gray-800 text-gray-400 hover:text-white transition-all"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-obsidian-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="What needs to be done?"
              className={`w-full bg-obsidian-gray-800 border ${
                errors.title
                  ? "border-obsidian-danger"
                  : "border-obsidian-gray-700"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all`}
            />
            {errors.title && (
              <p className="text-obsidian-danger text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add details about this task..."
              rows={3}
              className={`w-full bg-obsidian-gray-800 border ${
                errors.description
                  ? "border-obsidian-danger"
                  : "border-obsidian-gray-700"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-obsidian-danger text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {(["low", "medium", "high"] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all capitalize ${
                    formData.priority === priority
                      ? priority === "low"
                        ? "bg-obsidian-success/20 border-obsidian-success text-obsidian-success"
                        : priority === "medium"
                          ? "bg-obsidian-warning/20 border-obsidian-warning text-obsidian-warning"
                          : "bg-obsidian-danger/20 border-obsidian-danger text-obsidian-danger"
                      : "bg-obsidian-gray-800 border-obsidian-gray-700 text-gray-400 hover:border-obsidian-gray-600"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    completed: false,
                    completion_date: null,
                  })
                }
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${
                  !formData.completed
                    ? "bg-obsidian-violet-primary/20 border-obsidian-violet-primary text-obsidian-violet-light"
                    : "bg-obsidian-gray-800 border-obsidian-gray-700 text-gray-400 hover:border-obsidian-gray-600"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    completed: true,
                    completion_date: new Date().toISOString().split("T")[0],
                  })
                }
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${
                  formData.completed
                    ? "bg-obsidian-success/20 border-obsidian-success text-obsidian-success"
                    : "bg-obsidian-gray-800 border-obsidian-gray-700 text-gray-400 hover:border-obsidian-gray-600"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Completion Date (shown when completed) */}
          {formData.completed && (
            <div className="slide-down">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Completion Date
              </label>
              <input
                type="date"
                value={formData.completion_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, completion_date: e.target.value })
                }
                className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-3 text-white focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags{" "}
              <span className="text-gray-500">({formData.tags.length}/10)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-obsidian-gray-800 border border-obsidian-gray-700 text-obsidian-violet-light text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
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
                </span>
              ))}
            </div>
            {formData.tags.length < 10 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg bg-obsidian-gray-800 border border-obsidian-gray-700 text-obsidian-violet-light hover:bg-obsidian-gray-700 transition-all"
                >
                  Add
                </button>
              </div>
            )}
            {errors.tags && (
              <p className="text-obsidian-danger text-sm mt-1">{errors.tags}</p>
            )}
          </div>

          {/* Reminder */}
          <div className="bg-obsidian-gray-800 rounded-lg p-4 border border-obsidian-gray-700">
            <ReminderInput
              enabled={formData.reminder?.enabled || false}
              onEnabledChange={(enabled) =>
                setFormData({
                  ...formData,
                  reminder: { ...formData.reminder!, enabled },
                })
              }
              date={formData.reminder?.date || ""}
              onDateChange={(date) =>
                setFormData({
                  ...formData,
                  reminder: { ...formData.reminder!, date },
                })
              }
              time={formData.reminder?.time || "09:00"}
              onTimeChange={(time) =>
                setFormData({
                  ...formData,
                  reminder: { ...formData.reminder!, time },
                })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-obsidian-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-obsidian-gray-800 border border-obsidian-gray-700 text-white hover:bg-obsidian-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-obsidian-violet-primary text-white font-medium hover:bg-obsidian-violet-dark glow-violet transition-all"
            >
              {editTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
