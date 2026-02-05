/**
 * Authentication helpers for JWT token management
 * Tokens are stored in localStorage for persistence
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Get the stored JWT token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the JWT token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the JWT token
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData) as StoredUser;
  } catch {
    return null;
  }
}

/**
 * Store user data
 */
export function setUser(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove user data
 */
export function removeUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Clear all auth data (logout)
 */
export function clearAuth(): void {
  removeToken();
  removeUser();
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): { Authorization: string } | Record<string, never> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
