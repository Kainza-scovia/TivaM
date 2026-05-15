'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebase/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader, X } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  // Check for account lockout on mount
  const checkLockout = () => {
    try {
      const lockoutData = localStorage.getItem(`login_lockout_${email}`);
      if (lockoutData) {
        const { lockedUntil, attempts } = JSON.parse(lockoutData);
        const now = Date.now();
        
        if (now < lockedUntil) {
          const timeRemaining = Math.ceil((lockedUntil - now) / 1000);
          setIsLocked(true);
          setLockoutTimeRemaining(timeRemaining);
          setError(`Account temporarily locked due to too many failed login attempts. Try again in ${timeRemaining} seconds.`);
          return true;
        } else {
          // Lockout expired, clear it
          localStorage.removeItem(`login_lockout_${email}`);
          setIsLocked(false);
        }
      }
    } catch (e) {
      console.error('[v0] Error checking lockout:', e);
    }
    return false;
  };

  // Increment failed login attempts
  const recordFailedAttempt = () => {
    try {
      const attemptsData = localStorage.getItem(`login_attempts_${email}`);
      let attempts = 0;
      
      if (attemptsData) {
        const data = JSON.parse(attemptsData);
        attempts = data.attempts + 1;
      } else {
        attempts = 1;
      }

      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({ attempts, lastAttempt: Date.now() }));

      if (attempts >= 5) {
        // Lock account for 15 minutes
        const lockedUntil = Date.now() + 15 * 60 * 1000;
        localStorage.setItem(`login_lockout_${email}`, JSON.stringify({ lockedUntil, attempts }));
        setIsLocked(true);
        setError('Too many failed login attempts. Account locked for 15 minutes. Try again later.');
        return true;
      }

      const attemptsRemaining = 5 - attempts;
      setError(`Invalid email or password. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`);
      return false;
    } catch (e) {
      console.error('[v0] Error recording failed attempt:', e);
      return false;
    }
  };

  // Clear successful login attempts
  const clearAttempts = () => {
    try {
      localStorage.removeItem(`login_attempts_${email}`);
      localStorage.removeItem(`login_lockout_${email}`);
    } catch (e) {
      console.error('[v0] Error clearing attempts:', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if account is locked
    if (checkLockout()) {
      setLoading(false);
      return;
    }

    try {
      await firebaseAuth.signin(email, password);

      // Login successful - clear attempts and redirect
      clearAttempts();
      router.push(redirectTo);
    } catch (err: any) {
      console.error('[v0] Login catch error:', err);
      
      // Check if it's a network error
      if (err?.message === 'Failed to fetch') {
        setError('Network error - Unable to reach Firebase. Please check your internet connection.');
      } else {
        recordFailedAttempt();
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-background rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || !email || !password || isLocked}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? 'Signing in...' : isLocked ? 'Account Locked' : 'Sign In'}
            </Button>
          </form>

          {/* Password Recovery & Sign Up Links */}
          <div className="mt-6 space-y-3">
            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/90 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                  className="text-primary hover:text-primary/90 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
