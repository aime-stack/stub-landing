'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  accountType: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  message: z.string().optional()
});

export async function loginAction(formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: 'Invalid email or password structure' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to app.stubgram.com/feed (or relative /feed if already on subdomain)
  // Our middleware handles /login redirects, but since Server Actions run on the domain
  // where they are called, we can redirect optimally.
  const appHost = process.env.NODE_ENV === 'production' ? 'https://app.stubgram.com' : 'http://app.localhost:3000';
  redirect(`${appHost}/feed`);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const rootHost = process.env.NODE_ENV === 'production' ? 'https://stubgram.com' : 'http://localhost:3000';
  redirect(`${rootHost}/login`);
}

export async function signupAction(rawInput: any) {
  const result = SignupSchema.safeParse(rawInput);
  if (!result.success) {
    return { error: 'Invalid signup data provided' };
  }

  const payload = result.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        account_type: payload.accountType || 'regular',
        phone: payload.phone || null,
        company_name: payload.companyName || null,
        registration_message: payload.message || null,
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  // Same redirect flow as login, going to the feed payload 
  const appHost = process.env.NODE_ENV === 'production' ? 'https://app.stubgram.com' : 'http://app.localhost:3000';
  redirect(`${appHost}/feed`);
}
