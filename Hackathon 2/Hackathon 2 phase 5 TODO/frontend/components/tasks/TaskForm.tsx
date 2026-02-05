'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PriorityDropdown from './PriorityDropdown';
import TagInput from './TagInput';
import DateTimePicker from './DateTimePicker';
import RecurrenceSelector, { RecurrenceState, defaultRecurrence } from './RecurrenceSelector';
import ReminderInput from './ReminderInput';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  tagIds: string[];
  dueDate: string;
  dueTime: string;
  reminderDate: string;
  reminderTime: string;
  recurrence: RecurrenceState;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  availableTags?: Tag[];
  isEdit?: boolean;
}

export function TaskForm({ onSubmit, onCancel, initialData, availableTags = [], isEdit = false }: TaskFormProps) {
  const [data, setData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    tags: initialData?.tags || [],
    tagIds: initialData?.tagIds || [],
    dueDate: initialData?.dueDate || '',
    dueTime: initialData?.dueTime || '',
    reminderDate: initialData?.reminderDate || '',
    reminderTime: initialData?.reminderTime || '',
    recurrence: initialData?.recurrence || defaultRecurrence,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="What needs to be done?"
          maxLength={200}
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Add details..."
          rows={3}
          maxLength={1000}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Priority & Tags row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
          <PriorityDropdown
            value={data.priority}
            onChange={(priority) => setData({ ...data, priority })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Tags</label>
          <TagInput
            selectedTagIds={data.tagIds}
            availableTags={availableTags}
            onChange={(tagIds) => setData({ ...data, tagIds })}
          />
        </div>
      </div>

      {/* Due Date & Time */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Due Date & Time</label>
        <DateTimePicker
          dueDate={data.dueDate}
          dueTime={data.dueTime}
          onDateChange={(dueDate) => setData({ ...data, dueDate })}
          onTimeChange={(dueTime) => setData({ ...data, dueTime })}
        />
      </div>

      {/* Recurrence */}
      <RecurrenceSelector
        recurrence={data.recurrence}
        onChange={(recurrence) => setData({ ...data, recurrence })}
      />

      {/* Reminder */}
      <ReminderInput
        enabled={!!data.reminderDate}
        onEnabledChange={(enabled) => setData({ ...data, reminderDate: enabled ? data.reminderDate || new Date().toISOString().split('T')[0] : '', reminderTime: enabled ? data.reminderTime : '' })}
        date={data.reminderDate}
        onDateChange={(reminderDate) => setData({ ...data, reminderDate })}
        time={data.reminderTime}
        onTimeChange={(reminderTime) => setData({ ...data, reminderTime })}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !data.title.trim()}
          className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </motion.form>
  );
}
