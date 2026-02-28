'use client';

import { useState } from 'react';
import { loginAction } from '@/services/auth';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // If success, logic redirects via Server Action
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full appearance-none rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:border-[#0a7ea4] focus:outline-none focus:ring-1 focus:ring-[#0a7ea4] sm:text-sm transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full appearance-none rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:border-[#0a7ea4] focus:outline-none focus:ring-1 focus:ring-[#0a7ea4] sm:text-sm transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-xl border border-transparent bg-[#0a7ea4] py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-[#086a8a] focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:ring-offset-2 focus:ring-offset-[#151718] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="text-center mt-4">
        <a href="/?signup=true" className="text-sm text-[#0a7ea4] hover:underline font-medium">
          Don't have an account? Sign up
        </a>
      </div>
    </form>
  );
}
