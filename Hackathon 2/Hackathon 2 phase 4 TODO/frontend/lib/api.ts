/**
 * API client for ObsidianList backend
 * Handles authentication, task CRUD, and AI assistant operations
 * JWT tokens are stored in localStorage and sent via Authorization header
 */

import { getToken, setToken, setUser, clearAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  detail?: string;
}

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  tags?: string[];
  completed: boolean;
  completion_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  reminder?: Reminder;
}

// Reminder types
export interface Reminder {
  id: string;
  task_id: string;
  user_id: string;
  reminder_date: string;
  reminder_day: string;
  reminder_time: string;
  sent: boolean;
  sent_at?: string;
  created_at: string;
}

export interface ReminderCreate {
  reminder_date: string;  // YYYY-MM-DD
  reminder_time: string;  // HH:MM
  reminder_day?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  reminder?: ReminderCreate;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  completion_date?: string | null;
  tags?: string[];
  reminder?: ReminderCreate;
  remove_reminder?: boolean;
}

// AI Assistant types
export interface AIAssistRequest {
  message: string;
}

export interface AIAssistResponse {
  task_id: string;
  title: string;
  description?: string;
  priority: string;
  tags: string[];
  ai_interpretation: string;
}

// Chat types
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tool_calls?: { calls: ToolCall[] };
  created_at: string;
}

export interface ToolCall {
  tool: string;
  arguments: Record<string, unknown>;
  result: { status: string; message?: string; [key: string]: unknown };
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  message_id: string;
  tool_calls: ToolCall[];
}

// Stats types
export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

// ============================================================================
// API Client Configuration
// ============================================================================

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_RETRIES = 1;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Check if an error is a network/connection error that should be retried
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    // Network errors in fetch
    return true;
  }
  return false;
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Core API Fetch Function
// ============================================================================

/**
 * Generic fetch wrapper with:
 * - Automatic JWT from localStorage via Authorization header
 * - Retry logic for network errors
 * - Consistent error handling
 * - JSON parsing
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError: string = "Unknown error";

  // Get JWT token from localStorage
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...(fetchOptions.headers as Record<string, string>),
        },
      });

      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Check for authentication errors
        if (response.status === 401) {
          return {
            error: "Authentication required. Please log in.",
            status: 401,
          };
        }

        // Check for forbidden errors
        if (response.status === 403) {
          return {
            error: "You don't have permission to perform this action.",
            status: 403,
          };
        }

        // Check for rate limiting
        if (response.status === 429) {
          return {
            error: "Too many requests. Please wait a moment and try again.",
            status: 429,
          };
        }

        return {
          error: errorData.detail || `Request failed (${response.status})`,
          status: response.status,
        };
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { data: undefined as T, status: 204 };
      }

      // Parse JSON response
      const data = await response.json();

      // Parse tags if they're a JSON string
      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          // Array of tasks
          data.forEach((item: Record<string, unknown>) => {
            if (typeof item.tags === "string") {
              try {
                item.tags = JSON.parse(item.tags);
              } catch {
                item.tags = [];
              }
            }
          });
        } else if (typeof data.tags === "string") {
          // Single task
          try {
            data.tags = JSON.parse(data.tags);
          } catch {
            data.tags = [];
          }
        }
      }

      return { data, status: response.status };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network error";

      // Only retry on retryable errors and if we have retries left
      if (isRetryableError(error) && attempt < retries) {
        await sleep(retryDelay * (attempt + 1)); // Exponential backoff
        continue;
      }

      // No more retries
      break;
    }
  }

  return {
    error: lastError || "Failed to connect to server",
    status: 0,
  };
}

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiFetch<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    // Store token and user on success
    if (response.data?.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }

    return response;
  },

  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store token and user on success
    if (response.data?.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }

    return response;
  },

  logout: async (): Promise<void> => {
    clearAuth();
  },

  me: async (): Promise<ApiResponse<User>> => {
    return apiFetch<User>("/api/auth/me");
  },
};

// ============================================================================
// Tasks API
// ============================================================================

export const tasksApi = {
  /**
   * Get all tasks for the authenticated user
   */
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    return apiFetch<Task[]>("/api/tasks");
  },

  /**
   * Get a single task by ID
   */
  getOne: async (id: string): Promise<ApiResponse<Task>> => {
    return apiFetch<Task>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  create: async (task: TaskCreate): Promise<ApiResponse<Task>> => {
    return apiFetch<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  /**
   * Update an existing task
   */
  update: async (id: string, task: TaskUpdate): Promise<ApiResponse<Task>> => {
    return apiFetch<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  },

  /**
   * Delete a task
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiFetch<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Toggle task completion status
   * Sets completion_date to today when marking complete
   * Clears completion_date when marking incomplete
   */
  toggleComplete: async (id: string): Promise<ApiResponse<Task>> => {
    return apiFetch<Task>(`/api/tasks/${id}/complete`, {
      method: "PATCH",
    });
  },
};

// ============================================================================
// AI Assistant API
// ============================================================================

export const aiApi = {
  /**
   * Create a task from natural language message
   * Uses GPT-4 to parse the message and extract task fields
   * Rate limited to 10 requests per minute
   */
  createFromMessage: async (
    message: string
  ): Promise<ApiResponse<AIAssistResponse>> => {
    return apiFetch<AIAssistResponse>("/api/ai-assist", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

// ============================================================================
// Chat API
// ============================================================================

export const chatApi = {
  /**
   * Send a message to the AI assistant
   * Creates a new conversation if conversation_id is not provided
   */
  sendMessage: async (
    userId: string,
    message: string,
    conversationId?: string
  ): Promise<ApiResponse<ChatResponse>> => {
    const body: ChatRequest = { message };
    if (conversationId) {
      body.conversation_id = conversationId;
    }
    return apiFetch<ChatResponse>(`/api/${userId}/chat`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Get all conversations for a user
   */
  getConversations: async (
    userId: string
  ): Promise<ApiResponse<Conversation[]>> => {
    return apiFetch<Conversation[]>(`/api/${userId}/conversations`);
  },

  /**
   * Get all messages in a conversation
   */
  getConversation: async (
    userId: string,
    conversationId: string
  ): Promise<ApiResponse<Message[]>> => {
    return apiFetch<Message[]>(`/api/${userId}/conversations/${conversationId}`);
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (
    userId: string,
    conversationId: string
  ): Promise<ApiResponse<{ status: string; message: string }>> => {
    return apiFetch<{ status: string; message: string }>(
      `/api/${userId}/conversations/${conversationId}`,
      { method: "DELETE" }
    );
  },

  /**
   * Update conversation title
   */
  updateConversation: async (
    userId: string,
    conversationId: string,
    title: string
  ): Promise<ApiResponse<{ status: string; conversation: { id: string; title: string } }>> => {
    return apiFetch<{ status: string; conversation: { id: string; title: string } }>(
      `/api/${userId}/conversations/${conversationId}?title=${encodeURIComponent(title)}`,
      { method: "PATCH" }
    );
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate task statistics from an array of tasks
 */
export function calculateStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.completed).length,
    mediumPriority: tasks.filter((t) => t.priority === "medium" && !t.completed).length,
    lowPriority: tasks.filter((t) => t.priority === "low" && !t.completed).length,
  };
}

/**
 * Get all unique tags from an array of tasks
 */
export function extractTags(tasks: Task[]): string[] {
  const tagSet = new Set<string>();
  tasks.forEach((task) => {
    task.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Sort tasks by various criteria
 */
export function sortTasks(
  tasks: Task[],
  sortBy: string
): Task[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const sorted = [...tasks];

  switch (sortBy) {
    case "created_asc":
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case "created_desc":
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case "priority_desc":
      sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      break;
    case "priority_asc":
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case "title_asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title_desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return sorted;
}

/**
 * Filter tasks by various criteria
 */
export function filterTasks(
  tasks: Task[],
  options: {
    search?: string;
    priority?: string;
    status?: string;
    tag?: string;
  }
): Task[] {
  let result = [...tasks];

  // Search filter
  if (options.search) {
    const query = options.search.toLowerCase();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
  }

  // Priority filter
  if (options.priority && options.priority !== "all") {
    result = result.filter((task) => task.priority === options.priority);
  }

  // Status filter
  if (options.status && options.status !== "all") {
    result = result.filter((task) =>
      options.status === "completed" ? task.completed : !task.completed
    );
  }

  // Tag filter
  if (options.tag) {
    result = result.filter((task) => task.tags?.includes(options.tag!));
  }

  return result;
}
