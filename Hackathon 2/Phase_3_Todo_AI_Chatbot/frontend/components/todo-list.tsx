import { Todo } from '@/types/todo';
import { TodoItem } from '@/components/todo-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X } from 'lucide-react';
import { reminderService } from '@/services/reminder-service';
import { useEffect } from 'react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onEdit: (id: number, newDescription: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  sortBy?: 'priority' | 'due_date' | 'created_at' | 'description' | 'id';
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: 'priority' | 'due_date' | 'created_at' | 'description' | 'id', order: 'asc' | 'desc') => void;
  selectedTags?: string[];
  onTagFilterChange?: (tags: string[]) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  statusFilter?: 'completed' | 'incomplete' | null;
  onStatusFilterChange?: (status: 'completed' | 'incomplete' | null) => void;
  selectedRecurrence?: ('NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY')[];
  onRecurrenceFilterChange?: (recurrence: ('NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY')[]) => void;
}

export function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSortChange,
  selectedTags = [],
  onTagFilterChange,
  searchQuery = '',
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedRecurrence = [],
  onRecurrenceFilterChange
}: TodoListProps) {
  const handleSortChange = (newSortBy: 'priority' | 'due_date' | 'created_at' | 'description' | 'id') => {
    const newOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    if (onSortChange) {
      onSortChange(newSortBy, newOrder);
    }
  };

  // Get sort display text
  const getSortDisplay = () => {
    if (!sortBy) return 'Sort by';

    const sortText = {
      'priority': 'Priority',
      'due_date': 'Due Date',
      'created_at': 'Date Created',
      'description': 'Description',
      'id': 'Default'
    }[sortBy] || 'Sort by';

    return `${sortText} ${sortOrder === 'asc' ? '↑' : '↓'}`;
  };

  // Extract all unique tags from todos
  const allTags = Array.from(
    new Set(todos.flatMap(todo => todo.tags || []))
  );

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    if (onTagFilterChange) {
      if (selectedTags.includes(tag)) {
        onTagFilterChange(selectedTags.filter(t => t !== tag));
      } else {
        onTagFilterChange([...selectedTags, tag]);
      }
    }
  };

  // Clear all tag filters
  const clearTagFilters = () => {
    if (onTagFilterChange) {
      onTagFilterChange([]);
    }
  };

  // Toggle status filter
  const toggleStatusFilter = (status: 'completed' | 'incomplete') => {
    if (onStatusFilterChange) {
      if (statusFilter === status) {
        onStatusFilterChange(null); // Clear filter if clicking the same status
      } else {
        onStatusFilterChange(status);
      }
    }
  };

  // Toggle recurrence filter
  const toggleRecurrenceFilter = (recurrence: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
    if (onRecurrenceFilterChange) {
      if (selectedRecurrence.includes(recurrence)) {
        onRecurrenceFilterChange(selectedRecurrence.filter(r => r !== recurrence));
      } else {
        onRecurrenceFilterChange([...selectedRecurrence, recurrence]);
      }
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    if (onStatusFilterChange) {
      onStatusFilterChange(null);
    }
    if (onSearchChange) {
      onSearchChange('');
    }
    if (onTagFilterChange) {
      onTagFilterChange([]);
    }
    if (onRecurrenceFilterChange) {
      onRecurrenceFilterChange([]);
    }
  };

  // Effect to handle reminders when todos change
  useEffect(() => {
    // Schedule reminders for all todos
    reminderService.scheduleReminders(todos);

    // Cleanup function to clear all reminders when component unmounts
    return () => {
      reminderService.clearAllReminders();
    };
  }, [todos]);

  return (
    <div className="space-y-3" role="list">
      {/* Filter and sorting controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search, status, and tag filters */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Search input */}
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                onClick={() => onSearchChange?.('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Status and tag filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status filters */}
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleStatusFilter('completed')}
              className="text-xs h-7"
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === 'incomplete' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleStatusFilter('incomplete')}
              className="text-xs h-7"
            >
              Active
            </Button>

            {/* Tag filtering controls */}
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTagFilter(tag)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-secondary/30 hover:bg-secondary/80'
                }`}
              >
                {tag}
                {selectedTags.includes(tag) && <X className="h-3 w-3" />}
              </button>
            ))}

            {/* Recurrence filtering controls */}
            {(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map(recurrence => (
              <button
                key={recurrence}
                type="button"
                onClick={() => toggleRecurrenceFilter(recurrence)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedRecurrence.includes(recurrence)
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-secondary text-secondary-foreground border-secondary/30 hover:bg-secondary/80'
                }`}
              >
                {recurrence === 'NONE' && 'No Recur'}
                {recurrence === 'DAILY' && 'Daily'}
                {recurrence === 'WEEKLY' && 'Weekly'}
                {recurrence === 'MONTHLY' && 'Monthly'}
                {selectedRecurrence.includes(recurrence) && <X className="h-3 w-3" />}
              </button>
            ))}

            {(statusFilter || searchQuery || selectedTags.length > 0 || selectedRecurrence.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-7"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Sorting controls */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm">
                {getSortDisplay()}
                <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSortChange('priority')}>
                Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('due_date')}>
                Due Date {sortBy === 'due_date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('created_at')}>
                Date Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('description')}>
                Description {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('id')}>
                Default {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
}
