/**
 * Token Storage Utility for Local Storage
 *
 * Manages JWT storage in the browser's local storage.
 * Handles storage, retrieval, and removal of authentication tokens.
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Persists the JWT token to local storage.
 * @param token - The JWT access token string.
 */
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves the JWT token from local storage.
 * @returns The token string or null if not found.
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Removes the JWT token from local storage.
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Persists basic user information to local storage.
 * @param user - User object containing ID and email.
 */
export const saveUser = (user: { id: number; email: string }): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieves user information from local storage.
 * @returns User object or null if not found.
 */
export const getUser = (): { id: number; email: string } | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (err) {
        return null;
      }
    }
  }
  return null;
};

/**
 * Removes all authentication data from local storage.
 */
export const clearAuth = (): void => {
  removeToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};
