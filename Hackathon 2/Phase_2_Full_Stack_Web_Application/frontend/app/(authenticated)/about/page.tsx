'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">About Todo App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="text-center">
              <h2 className="text-xl font-semibold mb-4">Modern Task Management Solution</h2>
              <p className="text-muted-foreground mb-6">
                Our Todo App is designed to help you organize your tasks efficiently with a clean, intuitive interface and powerful features.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Simple Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Easily create, edit, and manage your tasks with our streamlined interface.
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Smart Features</h3>
                <p className="text-sm text-muted-foreground">
                  Priority levels, due dates, and categorization help you stay on track.
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Secure Access</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with industry-standard authentication and encryption.
                </p>
              </div>
            </section>

            <section className="pt-4 border-t">
              <h3 className="font-medium text-lg mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Add and manage tasks
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Mark tasks as complete
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> View task lists
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Secure authentication
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Responsive design
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Modern UI components
                </li>
              </ul>
            </section>

            <section className="pt-4 border-t">
              <h3 className="font-medium text-lg mb-3">Tech Stack</h3>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                <li className="bg-secondary/20 p-2 rounded">Next.js</li>
                <li className="bg-secondary/20 p-2 rounded">FastAPI</li>
                <li className="bg-secondary/20 p-2 rounded">Neon DB</li>
                <li className="bg-secondary/20 p-2 rounded">ShadCN</li>
              </ul>
            </section>

            <footer className="pt-6 text-center text-sm text-muted-foreground border-t">
              <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
              <p className="mt-1">Created with ❤️ by the development team</p>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}