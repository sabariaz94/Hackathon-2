'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!session;

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
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

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
    // Don't render children if not authenticated (redirect will happen via useEffect)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}