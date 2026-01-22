'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Todo } from '@/types/todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { TodoForm } from '@/components/todo-form';
import { TodoList } from '@/components/todo-list';
import { EmptyState } from '@/components/empty-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { UserProfile } from '@/components/user-profile';
import { reminderService } from '@/services/reminder-service';

interface Particle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!session;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'due_date' | 'created_at' | 'description' | 'id'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'completed' | 'incomplete' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 4}s`,
      animationDuration: `${3 + Math.random() * 3}s`,
    }));
    setParticles(newParticles);
    setIsMounted(true);
  }, []);

  // Fetch todos on mount and when filters change
  useEffect(() => {
    async function loadTodos() {
      try {
        setIsLoading(true);
        const data = await fetchTodos(
          searchQuery || undefined,
          statusFilter || undefined,
          undefined, // priority filter
          selectedTags.length > 0 ? selectedTags.join(',') : undefined, // tags filter
          sortBy,
          sortOrder
        );
        setTodos(data);

        // Schedule reminders for all todos
        reminderService.scheduleReminders(data);
      } catch (error) {
        toast({
          title: 'Error loading todos',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to fetch todos from server',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (!loading) {
      // Only load todos when not loading auth state and user is authenticated
      const token = localStorage.getItem('token');
      const isActuallyAuthenticated = isAuthenticated || (!!token && token !== 'undefined' && token !== 'null');

      if (isActuallyAuthenticated) {
        loadTodos();
      }
    }
  }, [loading, isAuthenticated, toast, sortBy, sortOrder, searchQuery, statusFilter, selectedTags]);

  // Check auth status and redirect if not authenticated
  useEffect(() => {
    // Don't proceed if still loading auth state
    if (loading) {
      return;
    }

    // Check if user is authenticated by looking at both session and token in localStorage
    const token = localStorage.getItem('token');
    const isActuallyAuthenticated = isAuthenticated || (!!token && token !== 'undefined' && token !== 'null');

    if (!isActuallyAuthenticated) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Cleanup function to clear all reminders when component unmounts
  useEffect(() => {
    return () => {
      reminderService.clearAllReminders();
    };
  }, []);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Check auth status without loading state
  const token = localStorage.getItem('token');
  const isActuallyAuthenticated = isAuthenticated || (!!token && token !== 'undefined' && token !== 'null');

  if (!isActuallyAuthenticated) {
    // Don't render main content if not authenticated (redirect will happen via useEffect)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Handle create todo
  async function handleCreateTodo(description: string, priority?: 'HIGH' | 'MEDIUM' | 'LOW', tags?: string[], due_date?: string, recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY', reminder_time?: number) {
    setIsCreating(true);
    try {
      const newTodo = await createTodo(description, priority, tags, due_date, recurrence_type, reminder_time);
      setTodos((prev) => [newTodo, ...prev]); // Prepend new todo
      toast({
        title: 'Success',
        description: 'Todo created successfully',
      });
    } catch (error) {
      toast({
        title: 'Failed to create todo',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error; // Re-throw so form knows it failed
    } finally {
      setIsCreating(false);
    }
  }

  // Handle toggle completion (optimistic update)
  async function handleToggleComplete(id: number, currentCompleted: boolean) {
    // 1. Snapshot current state for rollback
    const previousTodos = [...todos];

    // 2. Apply optimistic update immediately
    const optimisticTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !currentCompleted,
            updated_at: new Date().toISOString(),
          }
        : todo
    );
    setTodos(optimisticTodos);

    try {
      // 3. Send mutation to backend
      const updatedTodo = await updateTodo(id, { completed: !currentCompleted });

      // 4. Replace optimistic update with server response
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      // 5. Update reminder for this todo
      reminderService.updateReminder(updatedTodo);

      // 6. Success feedback
      toast({
        title: 'Todo updated',
        description: `Marked as ${updatedTodo.completed ? 'complete' : 'incomplete'}`,
      });
    } catch (error) {
      // 7. Rollback on error
      setTodos(previousTodos);

      // 8. Error feedback
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    }
  }

  // Handle edit todo description
  async function handleEditTodo(id: number, newDescription: string) {
    try {
      const updatedTodo = await updateTodo(id, { description: newDescription });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      // Update reminder for this todo
      reminderService.updateReminder(updatedTodo);

      toast({
        title: 'Todo updated',
        description: 'Description updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error; // Re-throw so component knows it failed
    }
  }

  // Handle sort change
  function handleSortChange(newSortBy: 'priority' | 'due_date' | 'created_at' | 'description' | 'id', newOrder: 'asc' | 'desc') {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
  }

  // Handle search change
  function handleSearchChange(query: string) {
    setSearchQuery(query);
  }

  // Handle status filter change
  function handleStatusFilterChange(status: 'completed' | 'incomplete' | null) {
    setStatusFilter(status);
  }

  // Handle tag filter change
  function handleTagFilterChange(tags: string[]) {
    setSelectedTags(tags);
  }

  // Handle delete todo
  async function handleDeleteTodo(id: number) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      // Remove reminder for this todo
      reminderService.removeReminder(id);

      toast({
        title: 'Todo deleted',
        description: 'Todo removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error; // Re-throw so component knows it failed
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      {/* Particle effects - only render after mount */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="particle"
              style={particle}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Cyberpunk Header with 3D effects */}
        <div className="mb-12 floating">
          <div className="glass-strong neon-border rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-5xl font-bold gradient-text tracking-tight">
                  Todo List
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full pulse-glow" />
                <p className="text-sm text-muted-foreground font-medium">
                  {todos.length === 0
                    ? 'No tasks yet'
                    : `${todos.filter(t => !t.completed).length} active, ${todos.filter(t => t.completed).length} completed`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Input with glassmorphism */}
        <div className="mb-8 slide-in">
          <TodoForm onSubmit={handleCreateTodo} isSubmitting={isCreating} />
        </div>

        {/* Task List with staggered animations */}
        <div>
          {isLoading && <LoadingSkeleton count={3} />}

          {!isLoading && todos.length === 0 && <EmptyState />}

          {!isLoading && todos.length > 0 && (
            <TodoList
              todos={todos}
              onToggle={handleToggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              selectedTags={selectedTags}
              onTagFilterChange={handleTagFilterChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
