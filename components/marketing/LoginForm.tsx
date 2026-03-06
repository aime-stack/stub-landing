'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/services/auth';
import { Eye, EyeOff, Loader2, ChevronRight, Phone, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type AuthTab = 'password' | 'otp';
type OtpStep = 'phone' | 'code';

export function LoginForm() {
  const searchParams = useSearchParams();
  const isVerified = searchParams?.get('verified') === 'true';

  const [tab, setTab] = useState<AuthTab>('password');

  // Password login state
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('phone');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Social OAuth
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true);
    setEmailError(null);
    try {
      const res = await loginAction(formData);
      if (res?.error) setEmailError(res.error);
    } catch {
      setEmailError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    if (!phone.trim()) return;
    setOtpLoading(true);
    setOtpError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setOtpStep('code');
      setOtpSent(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP. Check your phone number.');
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpCode.trim()) return;
    setOtpLoading(true);
    setOtpError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ phone, token: otpCode, type: 'sms' });
      if (error) throw error;
      window.location.href = '/feed';
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/feed` },
    });
  }

  return (
    <div className="w-full">

      {isVerified && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
          <h3 className="text-emerald-700 font-bold text-[17px] tracking-tight">Email Verified!</h3>
          <p className="text-emerald-600/90 text-sm font-medium leading-snug">Your account is active.<br/>Please log in to continue.</p>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-8">
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none ${
            tab === 'password' ? 'bg-white shadow font-semibold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email &amp; Password
        </button>
        <button
          type="button"
          onClick={() => setTab('otp')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none ${
            tab === 'otp' ? 'bg-white shadow font-semibold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Phone / OTP
        </button>
      </div>

      {/* ── Email / Password ── */}
      {tab === 'password' && (
        <form action={handlePasswordSubmit}>

          {emailError && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl" role="alert">
              {emailError}
            </div>
          )}

          {/* Email input */}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            className="w-full h-14 rounded-2xl border border-gray-300 bg-gray-50 px-5 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200" style={{ '--tw-ring-color': '#0a7ea4' } as any}
          />

          {/* Gap between fields */}
          <div className="mt-3" />

          {/* Password input */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full h-14 rounded-2xl border border-gray-300 bg-gray-50 px-5 pr-12 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Gap before button */}
          <div className="mt-5" />

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl text-white text-[15px] font-semibold tracking-wide shadow-md hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2" style={{ background: 'var(--gradient-primary)' }}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          {/* Forgot password — gap below button */}
          <div className="mt-5 text-center">
            <button type="button" className="text-sm font-semibold transition-colors focus:outline-none" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color='var(--primary)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>
              Forgot password?
            </button>
          </div>

        </form>
      )}

      {/* ── Phone / OTP ── */}
      {tab === 'otp' && (
        <div>
          {otpError && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl" role="alert">
              {otpError}
            </div>
          )}

          {otpStep === 'phone' ? (
            <>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                  <Phone size={17} />
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile number with country code"
                  className="w-full h-14 rounded-2xl border border-gray-300 bg-gray-50 pl-11 pr-5 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400 pl-1">Include country code, e.g. +1 for US.</p>
              <div className="mt-5" />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !phone.trim()}
                className="w-full h-14 rounded-2xl text-white text-[15px] font-semibold tracking-wide shadow-md hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2" style={{ background: 'var(--gradient-primary)' }}
              >
                {otpLoading ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                {otpLoading ? 'Sending…' : 'Send Code'}
              </button>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600 text-center">
                Code sent to <span className="font-semibold text-gray-800">{phone}</span>.{' '}
                <button
                  type="button"
                  onClick={() => { setOtpStep('phone'); setOtpCode(''); }}
                  className="hover:underline font-semibold focus:outline-none" style={{ color: 'var(--primary)' }}
                >
                  Change
                </button>
              </p>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="w-full h-16 rounded-2xl border border-gray-300 bg-gray-50 px-5 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-center text-3xl font-bold tracking-[0.5em]"
              />
              <div className="mt-5" />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpCode.length < 6}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-[15px] font-semibold tracking-wide shadow-md hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {otpLoading && <Loader2 className="animate-spin" size={18} />}
                {otpLoading ? 'Verifying…' : 'Verify & Log in'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 mt-8 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── OAuth Buttons ── */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={!!oauthLoading}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-60 transition-all duration-200 shadow-sm"
        >
          {oauthLoading === 'google' ? (
            <Loader2 className="animate-spin text-gray-400" size={18} />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span className="text-[15px] font-medium text-gray-700">Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={!!oauthLoading}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-60 transition-all duration-200 shadow-sm"
        >
          {oauthLoading === 'github' ? (
            <Loader2 className="animate-spin text-gray-400" size={18} />
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          )}
          <span className="text-[15px] font-medium text-gray-700">Continue with GitHub</span>
        </button>
      </div>

      {/* ── Sign Up CTA ── */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <a href="/?signup=true" className="font-semibold text-cyan-600 hover:underline">
          Sign up
        </a>
      </div>

    </div>
  );
}
