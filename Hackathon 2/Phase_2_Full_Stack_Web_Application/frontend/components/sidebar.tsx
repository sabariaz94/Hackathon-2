'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home, FileText, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ isOpen, onClose, isMobile = true }: SidebarProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      onClose();
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full pt-16">
            <nav className="flex flex-col space-y-1 p-4">
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/todos')}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
              >
                <CheckSquare className="h-5 w-5" />
                <span>My Tasks</span>
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>About</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors mt-auto"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    );
  } else {
    // Desktop sidebar - always visible
    return (
      <div className="hidden md:block w-64 h-full border-r">
        <div className="flex flex-col h-full pt-16">
          <nav className="flex flex-col space-y-1 p-4">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation('/todos')}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
            >
              <CheckSquare className="h-5 w-5" />
              <span>My Tasks</span>
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>About</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-left hover:bg-accent transition-colors mt-auto"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    );
  }
}