'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function AuthNav() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowMenu(false);
  };

  // Extract initials from email (e.g., kainzascovia20@... => K)
  const getInitials = (email: string | undefined): string => {
    if (!email) return 'U';
    const firstLetter = email.charAt(0).toUpperCase();
    return firstLetter;
  };

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="text-sm font-medium">
          Login
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
      >
        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
          {getInitials(user?.email)}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {getInitials(user?.email)}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
