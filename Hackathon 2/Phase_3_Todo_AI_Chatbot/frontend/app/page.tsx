'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/user-profile';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!session;

  // Check auth status and redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push('/login');
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

  // If not authenticated, show redirecting message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleGoToTasks = () => {
    router.push('/todos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome to Todo App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg text-muted-foreground">
              Organize your life with ease – add, track, and complete tasks effortlessly
            </p>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-base px-8 py-6"
                onClick={handleGoToTasks}
              >
                Go to My Tasks
              </Button>
            </div>

            {session?.user && (
              <div className="pt-4 border-t mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Signed in as <span className="font-medium">{session.user.email}</span>
                  </p>
                  <UserProfile />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}