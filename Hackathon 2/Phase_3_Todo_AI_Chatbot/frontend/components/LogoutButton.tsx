'use client';

/**
 * Logout Button Component
 *
 * Provides a button to trigger the logout flow.
 * Handles the async logout call and redirects to the login page.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Loader2 } from 'lucide-react';

export const LogoutButton: React.FC<{ variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }> = ({ variant = "outline" }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  /**
   * Handles the logout click event.
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (err) {
      toast({
        title: 'Logout error',
        description: 'Failed to complete server logout, but local session cleared.',
        variant: 'destructive',
      });
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Logout
    </Button>
  );
};
