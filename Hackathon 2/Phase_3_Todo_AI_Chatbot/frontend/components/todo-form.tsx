'use client';

import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

interface TodoFormProps {
  onSubmit: (description: string, priority?: 'HIGH' | 'MEDIUM' | 'LOW', tags?: string[], due_date?: string, recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY', reminder_time?: number) => Promise<void>;
  isSubmitting: boolean;
}

const MIN_LENGTH = 1;
const MAX_LENGTH = 500;

export function TodoForm({ onSubmit, isSubmitting }: TodoFormProps) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [recurrenceType, setRecurrenceType] = useState<'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'>('NONE');
  const [reminderTime, setReminderTime] = useState<number>(10); // Default to 10 minutes
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle notification permissions
  const { isGranted, isDenied, isDefault, requestPermission } = useNotificationPermission();

  // Real-time validation
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDescription(value);

    // Validate
    if (value.trim().length === 0 && value.length > 0) {
      setError('Description cannot be empty');
    } else if (value.length > MAX_LENGTH) {
      setError(`Description cannot exceed ${MAX_LENGTH} characters`);
    } else {
      setError(null);
    }
  }

  // Priority change handler
  function handlePriorityChange(newPriority: 'HIGH' | 'MEDIUM' | 'LOW') {
    setPriority(newPriority);
    setDropdownOpen(false);
  }

  // Handle tag input change
  function handleTagInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagInput(e.target.value);
  }

  // Add tag when user presses Enter or clicks add
  function addTag() {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) { // Limit to 5 tags
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  }

  // Remove a tag
  function removeTag(tagToRemove: string) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  // Handle Enter key in tag input
  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed in empty input
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  }

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = description.trim();

    // Final validation
    if (trimmed.length === 0) {
      setError('Description cannot be empty');
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      setError(`Description cannot exceed ${MAX_LENGTH} characters`);
      return;
    }

    // Request notification permission if a due date and reminder time are set
    if (dueDate && reminderTime > 0) {
      if (isDefault) {
        // If permission hasn't been requested yet, request it
        await requestPermission();
      } else if (isDenied) {
        // If permission is denied, warn the user
        console.warn('Notification permission denied. Reminders will not work.');
      }
    }

    try {
      await onSubmit(trimmed, priority, tags, dueDate || undefined, recurrenceType, reminderTime);
      // Clear form on success
      setDescription('');
      setPriority('MEDIUM');
      setTags([]);
      setTagInput('');
      setDueDate('');
      setRecurrenceType('NONE');
      setReminderTime(10); // Reset to default
      setError(null);
    } catch (err) {
      // Error handled by parent component with toast
    }
  }

  // Determine if submit should be disabled
  const isDisabled = isSubmitting || !!error || description.trim().length === 0;

  // Get priority display text and color
  const getPriorityDisplay = () => {
    switch (priority) {
      case 'HIGH':
        return { text: 'High', color: 'text-destructive' };
      case 'MEDIUM':
        return { text: 'Medium', color: 'text-yellow-500' };
      case 'LOW':
        return { text: 'Low', color: 'text-green-500' };
      default:
        return { text: 'Medium', color: 'text-yellow-500' };
    }
  };

  const { text: priorityText, color: priorityColor } = getPriorityDisplay();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-strong neon-border rounded-2xl p-4 hover-lift">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="ripple relative">
                <Input
                  value={description}
                  onChange={handleChange}
                  placeholder="Add a new task..."
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'input-error' : undefined}
                  className="w-full h-12 text-sm glass border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/20 transition-all"
                />
              </div>
              {error && (
                <p id="input-error" className="text-xs text-destructive mt-2 fade-in flex items-center gap-2" role="alert">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive pulse-glow" />
                  {error}
                </p>
              )}
              {description.length > 400 && (
                <div className="flex items-center justify-between mt-2 fade-in">
                  <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${(description.length / MAX_LENGTH) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-2 tabular-nums">
                    {description.length}/{MAX_LENGTH}
                  </p>
                </div>
              )}
            </div>

            {/* Priority dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className={`h-12 px-4 text-sm font-medium border-transparent hover:bg-secondary/50 transition-colors ${priorityColor}`}
                >
                  <span className="mr-2 font-medium">{priorityText}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => handlePriorityChange('HIGH')}
                  className="text-destructive hover:text-destructive"
                >
                  <span className="font-medium">High</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePriorityChange('MEDIUM')}
                  className="text-yellow-500 hover:text-yellow-500"
                >
                  <span className="font-medium">Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePriorityChange('LOW')}
                  className="text-green-500 hover:text-green-500"
                >
                  <span className="font-medium">Low</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags input */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 mb-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary/70 hover:text-primary"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter to add)..."
                disabled={isSubmitting || tags.length >= 5}
                className="h-9 text-sm glass"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={isSubmitting || !tagInput.trim() || tags.length >= 5}
                className="h-9 px-3 text-sm"
              >
                Add
              </Button>
            </div>
            {tags.length >= 5 && (
              <p className="text-xs text-muted-foreground">
                Maximum 5 tags allowed
              </p>
            )}
          </div>

          {/* Due date input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="due-date" className="text-sm font-medium text-foreground">
              Due Date (optional)
            </label>
            <Input
              id="due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 text-sm glass"
            />
          </div>

          {/* Recurrence dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Recurrence (optional)
            </label>
            <div className="flex gap-2">
              {(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={recurrenceType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRecurrenceType(type)}
                  className="flex-1 text-xs capitalize"
                >
                  {type === 'NONE' ? 'None' : type}
                </Button>
              ))}
            </div>
            {recurrenceType !== 'NONE' && (
              <p className="text-xs text-muted-foreground">
                {recurrenceType === 'DAILY' && 'Task will repeat every day'}
                {recurrenceType === 'WEEKLY' && 'Task will repeat every week'}
                {recurrenceType === 'MONTHLY' && 'Task will repeat every month'}
              </p>
            )}
          </div>

          {/* Reminder time input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="reminder-time" className="text-sm font-medium text-foreground">
              Reminder Time (minutes before due)
            </label>
            <Input
              id="reminder-time"
              type="number"
              min="0"
              max="1440" // Max 24 hours in minutes
              value={reminderTime}
              onChange={(e) => setReminderTime(Math.max(0, Math.min(1440, parseInt(e.target.value) || 0)))}
              className="h-9 text-sm glass"
              placeholder="Minutes before due"
            />
            <p className="text-xs text-muted-foreground">
              Notification will be sent this many minutes before the due time
            </p>
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            className="h-12 px-8 text-sm font-bold btn-3d bounce-in bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Task'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
