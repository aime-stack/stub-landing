'use client';

import { useState } from 'react';
import { loginAction } from '@/services/auth';
import { User, Lock } from 'lucide-react';

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
    <form action={handleSubmit} className="space-y-6 w-full py-4">
      {error && (
        <div className="p-4 mb-4 text-[15px] font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm text-gray-800 font-semibold mb-1">
          Username
        </label>
        <div className="relative flex items-center border-b border-gray-300 group focus-within:border-cyan-400 transition-colors h-14">
          <User className="w-5 h-5 text-gray-400 absolute left-2 group-focus-within:text-cyan-400 transition-colors" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full h-full bg-transparent pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
            placeholder="Type your username"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        <label htmlFor="password" className="text-sm text-gray-800 font-semibold mb-1">
          Password
        </label>
        <div className="relative flex items-center border-b border-gray-300 group focus-within:border-cyan-400 transition-colors h-14">
          <Lock className="w-5 h-5 text-gray-400 absolute left-2 group-focus-within:text-cyan-400 transition-colors" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full h-full bg-transparent pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
            placeholder="Type your password"
          />
        </div>
      </div>

      <div className="flex w-full justify-end mt-4 mb-8">
        <a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Forgot password?
        </a>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center items-center h-14 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 text-base font-bold tracking-widest text-white hover:opacity-90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-fuchsia-500/25 uppercase"
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </div>

      <div className="flex flex-col items-center mt-12 space-y-4">
        <span className="text-sm text-gray-500">Or Sign Up Using</span>
        <div className="flex justify-center gap-4">
          {/* Facebook */}
          <button type="button" className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
          </button>
          {/* Twitter */}
          <button type="button" className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
          </button>
          {/* Google */}
          <button type="button" className="w-12 h-12 rounded-full bg-[#EA4335] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
          </button>
        </div>
      </div>

      <div className="text-center mt-12 flex justify-center items-center">
        <a href="/?signup=true" className="text-sm text-gray-800 hover:text-fuchsia-600 font-bold uppercase tracking-wider transition-colors pt-6 border-t border-gray-100 w-full">
          Need an account? Sign up
        </a>
      </div>
    </form>
  );
}
