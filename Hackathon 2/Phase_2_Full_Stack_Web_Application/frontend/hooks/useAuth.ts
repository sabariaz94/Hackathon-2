'use client';

/**
 * useAuth Hook
 *
 * Custom hook to access authentication context.
 */

import { useAuth as useCustomAuth } from '@/lib/auth/AuthContext';

export const useAuth = () => {
  return useCustomAuth();
};
