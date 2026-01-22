'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserProfile } from '@/components/user-profile';
import Sidebar from '@/components/sidebar';

export default function Header() {
  const { session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || session?.user?.email || 'User';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold hidden md:block">Todo App</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-medium">Welcome, {userName}</span>
          </div>
          <UserProfile />
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
    </header>
  );
}