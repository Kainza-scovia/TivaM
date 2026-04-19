'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account');
        setLoading(false);
        return;
      }
      
      // Auto-login after successful signup if user is created
      if (data?.user) {
        // Sign in with the same credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          // Auto-login didn't work, redirect to home after a moment
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          // Auto-login successful, redirect to home immediately
          router.push('/');
        }
      } else {
        // Email confirmation required, redirect to home
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      // Check if it's a network error
      if (err?.message === 'Failed to fetch') {
        setError('Network error - Unable to reach Supabase. Please check your internet connection.');
      } else {
        setError(err?.message || 'An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-background rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Created!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your account has been created successfully. Redirecting to home...
          </p>
          <Button
            disabled
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 opacity-50"
          >
            Redirecting...
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-background rounded-lg shadow-lg flex flex-col max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold text-foreground">Create Account</h2>
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Signup Form */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground">Sign up to explore more features</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="Create a password (min. 8 characters)"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={loading || !email || !password || !confirmPassword}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="text-primary hover:text-primary/90 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
