'use client';

import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';
import { reminderService } from '@/services/reminder-service';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onEdit: (id: number, newDescription: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  index: number;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, index }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle save edit
  async function handleSave() {
    const trimmed = editedDescription.trim();
    if (trimmed.length === 0 || trimmed.length > 500) return;

    try {
      await onEdit(todo.id, trimmed);
      setIsEditing(false);
    } catch (error) {
      // Error handled by parent with toast
      setEditedDescription(todo.description); // Revert on error
    }
  }

  // Handle toggle with reminder update
  async function handleToggle() {
    try {
      await onToggle(todo.id, todo.completed);
      // The parent component will update the todo in the list, which will trigger
      // the reminder service to reschedule reminders in TodoList component
    } catch (error) {
      // Error handled by parent with toast
    }
  }

  // Handle cancel edit
  function handleCancel() {
    setEditedDescription(todo.description); // Revert changes
    setIsEditing(false);
  }

  // Handle delete
  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error handled by parent with toast
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle keyboard shortcuts in edit mode
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

  // Check if edit is valid
  const isValidEdit =
    editedDescription.trim().length > 0 && editedDescription.length <= 500;

  // Get priority display text and color classes
  const getPriorityDisplay = () => {
    switch (todo.priority) {
      case 'HIGH':
        return { text: 'High', color: 'bg-destructive/10 text-destructive border-destructive/30' };
      case 'MEDIUM':
        return { text: 'Medium', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' };
      case 'LOW':
        return { text: 'Low', color: 'bg-green-500/10 text-green-500 border-green-500/30' };
      default:
        return { text: 'Medium', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' };
    }
  };

  const { text: priorityText, color: priorityColor } = getPriorityDisplay();

  // Check if due date is overdue
  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date();

  return (
    <>
      <Card
        className={cn(
          'card-3d group relative overflow-hidden',
          `stagger-${Math.min(index, 5)}`,
          todo.completed && 'opacity-70',
          todo.priority === 'HIGH' && 'border-destructive/50 shadow-destructive/20',
          todo.priority === 'MEDIUM' && 'border-yellow-500/50 shadow-yellow-500/20',
          todo.priority === 'LOW' && 'border-green-500/50 shadow-green-500/20',
          isOverdue && 'border-destructive/70 shadow-destructive/30 bg-destructive/5'
        )}
      >
        <div className="p-4 flex items-center gap-4 relative z-10">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <div className="glow-effect relative">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={handleToggle}
                  className="h-5 w-5 shrink-0 border-2 pulse-glow"
                  aria-label={`Mark "${todo.description}" as ${
                    todo.completed ? 'incomplete' : 'complete'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    'block text-base font-medium transition-all duration-300 truncate',
                    todo.completed
                      ? 'line-through text-muted-foreground opacity-60'
                      : isOverdue
                        ? 'text-destructive'
                        : 'text-foreground'
                  )}
                >
                  {todo.description}
                </span>

                {/* Priority, tags, and due date badges */}
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                    priorityColor
                  )}>
                    {priorityText}
                  </span>

                  {/* Due date badge */}
                  {todo.due_date && (
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                      isOverdue
                        ? 'bg-destructive/10 text-destructive border-destructive/30'
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                    )}>
                      {new Date(todo.due_date).toLocaleDateString()} {new Date(todo.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isOverdue && ' (OVERDUE)'}
                    </span>
                  )}

                  {/* Tags badges */}
                  {todo.tags && todo.tags.length > 0 && todo.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-secondary/30"
                    >
                      {tag}
                    </span>
                  ))}

                  {/* Recurrence badge */}
                  {todo.recurrence_type && todo.recurrence_type !== 'NONE' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/30">
                      {todo.recurrence_type === 'DAILY' && 'Daily'}
                      {todo.recurrence_type === 'WEEKLY' && 'Weekly'}
                      {todo.recurrence_type === 'MONTHLY' && 'Monthly'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground btn-3d"
                  onClick={() => setIsEditing(true)}
                  aria-label={`Edit "${todo.description}"`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive btn-3d"
                  onClick={() => setShowDeleteDialog(true)}
                  aria-label={`Delete "${todo.description}"`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-9 text-sm glass"
                autoFocus
              />

              <div className="flex items-center gap-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-green-500 hover:bg-green-500/10 btn-3d"
                  onClick={handleSave}
                  disabled={!isValidEdit}
                  aria-label="Save changes"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-muted btn-3d"
                  onClick={handleCancel}
                  aria-label="Cancel edit"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass neon-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="gradient-text">Delete todo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{todo.description}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-3d">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 btn-3d"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
