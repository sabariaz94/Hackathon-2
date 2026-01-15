/**
 * Todo entity matching backend response structure
 * Corresponds to TodoResponse in backend/models/todo.py
 */
export interface Todo {
  id: number;
  description: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  tags: string[];
  due_date?: string; // ISO 8601 format (UTC) - optional
  recurrence_type: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  reminder_time: number;
  created_at: string; // ISO 8601 format (UTC)
  updated_at: string; // ISO 8601 format (UTC)
}

/**
 * Request payload for creating a new todo
 * Corresponds to TodoCreate in backend/models/todo.py
 */
export interface CreateTodoRequest {
  description: string; // 1-500 characters
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  tags?: string[];
  due_date?: string; // ISO 8601 format (UTC) - optional
  recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  reminder_time?: number;
}

/**
 * Request payload for updating an existing todo
 * Corresponds to TodoUpdate in backend/models/todo.py
 * All fields optional - allows partial updates
 */
export interface UpdateTodoRequest {
  description?: string; // 1-500 characters if provided
  completed?: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  tags?: string[];
  due_date?: string; // ISO 8601 format (UTC) - optional
  recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  reminder_time?: number;
}

/**
 * Backend error response structure
 * FastAPI returns { detail: string } or { detail: Array<{msg, type, ...}> }
 */
export interface ApiError {
  detail: string | Array<{ msg: string; type: string }>;
}

/**
 * Authentication response structure
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
  };
}
