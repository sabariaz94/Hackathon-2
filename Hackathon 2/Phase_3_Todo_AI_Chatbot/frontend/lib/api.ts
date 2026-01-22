import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiError,
} from '@/types/todo';
import { cacheService } from '@/services/cache-service';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic HTTP request wrapper with error handling and type safety
 *
 * @template T - Expected response type
 * @param endpoint - API endpoint path (e.g., '/api/todos')
 * @param options - Fetch API options (method, body, headers, etc.)
 * @returns Promise resolving to typed response data
 * @throws Error with backend error message or generic message
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get the auth token from localStorage (JWT token)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - this should be handled by Better Auth
    if (response.status === 401) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized - please log in again');
    }

    // Handle non-OK responses (4xx, 5xx)
    if (!response.ok) {
      // Try to parse error from backend
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));

      // Extract error message from FastAPI detail (can be string or array)
      let errorMessage = 'An unexpected error occurred';
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((err) => err.msg).join(', ');
      }

      throw new Error(errorMessage || `HTTP ${response.status}`);
    }

    // Handle 204 No Content (DELETE responses)
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    // Re-throw Error instances (includes our custom errors above)
    if (error instanceof Error) {
      throw error;
    }

    // Handle unexpected errors (network failures, JSON parse errors)
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Fetch all todos from the backend with optional filtering, searching, and sorting
 *
 * @param search - Keyword to search in description
 * @param status - Filter by completion status ('completed' or 'incomplete')
 * @param priority - Filter by priority level ('HIGH', 'MEDIUM', 'LOW')
 * @param tags - Comma-separated list of tags to filter by
 * @param sort_by - Sort by field ('priority', 'due_date', 'created_at', 'description')
 * @param order - Sort order ('asc' or 'desc')
 * @param limit - Number of results to return
 * @param offset - Number of results to skip
 * @returns Promise<Todo[]> - Array of todos
 * @throws Error if request fails
 *
 * **Backend Endpoint**: GET /api/todos
 * **Success Response**: 200 OK with Todo[] body
 * **Error Responses**:
 *   - 500: Server error
 *   - Network error: Cannot reach server
 */
export async function fetchTodos(
  search?: string,
  status?: 'completed' | 'incomplete',
  priority?: 'HIGH' | 'MEDIUM' | 'LOW',
  tags?: string,
  sort_by?: 'priority' | 'due_date' | 'created_at' | 'description',
  order?: 'asc' | 'desc',
  limit?: number,
  offset?: number
): Promise<Todo[]> {
  // Build cache key from parameters
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (tags) params.append('tags', tags);
  if (sort_by) params.append('sort_by', sort_by);
  if (order) params.append('order', order);
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());

  const queryString = params.toString();
  const cacheKey = `todos_${queryString || 'all'}`;

  // Try to get from cache first
  const cached = cacheService.get<Todo[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const endpoint = `/api/todos${queryString ? `?${queryString}` : ''}`;

  const result = await apiRequest<Todo[]>(endpoint, {
    method: 'GET',
  });

  // Cache the result for 2 minutes
  cacheService.set(cacheKey, result, 2 * 60 * 1000);

  return result;
}

/**
 * Create a new todo
 *
 * @param description - Todo description (1-500 characters)
 * @param priority - Task priority level (HIGH, MEDIUM, LOW)
 * @param tags - Array of tags for categorization
 * @param due_date - Deadline for the task (ISO 8601 format)
 * @param recurrence_type - Recurrence pattern (NONE, DAILY, WEEKLY, MONTHLY)
 * @param reminder_time - Minutes before due time for notification
 * @returns Promise<Todo> - Created todo with generated ID and timestamps
 * @throws Error if validation fails or request fails
 *
 * **Backend Endpoint**: POST /api/todos
 * **Request Body**: { description: string, priority?: string, tags?: string[], due_date?: string, recurrence_type?: string, reminder_time?: number }
 * **Success Response**: 201 Created with Todo body
 * **Error Responses**:
 *   - 400: Validation error (empty description or > 500 chars)
 *   - 500: Server error
 */
export async function createTodo(
  description: string,
  priority?: 'HIGH' | 'MEDIUM' | 'LOW',
  tags?: string[],
  due_date?: string,
  recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY',
  reminder_time?: number
): Promise<Todo> {
  const payload: CreateTodoRequest = {
    description,
    priority,
    tags,
    due_date,
    recurrence_type,
    reminder_time
  };

  const result = await apiRequest<Todo>('/api/todos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Invalidate cache for all todo lists since a new todo was created
  cacheService.delete('todos_all');
  // Also delete any cached lists with filters since the new todo might match those filters
  const allCacheKeys = Array.from(cacheService.getStats().keys);
  allCacheKeys.forEach(key => {
    if (key.startsWith('todos_')) {
      cacheService.delete(key);
    }
  });

  return result;
}

/**
 * Update an existing todo (partial update supported)
 *
 * @param id - Todo ID
 * @param updates - Fields to update (description and/or completed)
 * @returns Promise<Todo> - Updated todo with refreshed updated_at
 * @throws Error if todo not found or validation fails
 *
 * **Backend Endpoint**: PATCH /api/todos/{id}
 * **Request Body**: { description?: string, completed?: boolean }
 * **Success Response**: 200 OK with Todo body
 * **Error Responses**:
 *   - 400: Validation error (empty description if provided)
 *   - 404: Todo with given ID not found
 *   - 500: Server error
 */
export async function updateTodo(
  id: number,
  updates: UpdateTodoRequest
): Promise<Todo> {
  const result = await apiRequest<Todo>(`/api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

  // Invalidate cache for all todo lists since a todo was updated
  cacheService.delete('todos_all');
  // Also delete any cached lists with filters since the updated todo might affect those results
  const allCacheKeys = Array.from(cacheService.getStats().keys);
  allCacheKeys.forEach(key => {
    if (key.startsWith('todos_')) {
      cacheService.delete(key);
    }
  });

  return result;
}

/**
 * Delete a todo
 *
 * @param id - Todo ID
 * @returns Promise<void> - Resolves with no data on success
 * @throws Error if todo not found or request fails
 *
 * **Backend Endpoint**: DELETE /api/todos/{id}
 * **Success Response**: 204 No Content (no body)
 * **Error Responses**:
 *   - 404: Todo with given ID not found
 *   - 500: Server error
 */
export async function deleteTodo(id: number): Promise<void> {
  const result = await apiRequest<void>(`/api/todos/${id}`, {
    method: 'DELETE',
  });

  // Invalidate cache for all todo lists since a todo was deleted
  cacheService.delete('todos_all');
  // Also delete any cached lists with filters since the deleted todo might have affected those results
  const allCacheKeys = Array.from(cacheService.getStats().keys);
  allCacheKeys.forEach(key => {
    if (key.startsWith('todos_')) {
      cacheService.delete(key);
    }
  });

  return result;
}

/**
 * Send a chat message to the backend AI assistant
 *
 * @param message - The user's message to send
 * @param token - The authentication token
 * @param conversation_id - Optional conversation ID to continue a conversation
 * @returns Promise with the AI response
 * @throws Error if request fails
 *
 * **Backend Endpoint**: POST /api/chat
 * **Request Body**: { message: string, conversation_id?: number }
 * **Success Response**: 200 OK with response body
 * **Error Responses**:
 *   - 401: Unauthorized (invalid/expired token)
 *   - 500: Server error
 */
export async function sendChatMessage(
  { message, conversation_id }: { message: string; conversation_id?: number | null },
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      conversation_id: conversation_id || null
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
    }));

    let errorMessage = 'An error occurred while processing your message';
    if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

