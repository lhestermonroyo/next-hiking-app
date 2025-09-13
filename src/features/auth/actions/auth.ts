'use server';
import { createClientForServer } from '@/lib/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import z from 'zod';
import { toast } from 'sonner';
import { loginSchema, signUpSchema } from './schemas';

type AuthResponse = Promise<{
  error: boolean;
  message: string;
  data?: any;
}>;

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();
  const authCallbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallbackUrl
    }
  });

  if (error) {
    return {
      error: true,
      message: error?.message || 'Error signing in. Please try again.'
    };
  }

  redirect(data.url);
};

const signInWithPassword = async ({
  email,
  password
}: z.infer<typeof loginSchema>): AuthResponse => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      error: true,
      message: error?.message || 'Error signing in. Please try again.'
    };
  }

  if (data.user?.email_confirmed_at === null) {
    return {
      error: true,
      message: 'Please confirm your email before signing in.'
    };
  }

  return {
    error: false,
    message: 'Signed in successfully!'
  };
};

const signUp = async ({
  email,
  password
}: z.infer<typeof signUpSchema>): AuthResponse => {
  const supabase = await createClientForServer();
  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    toast.error(error.message);
    return {
      error: true,
      message: error.message || 'Error signing up. Please try again.'
    };
  }

  return {
    error: false,
    message:
      'Account created successfully! Please check your email to confirm your account.'
  };
};

const signOut = async () => {
  const supabase = await createClientForServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: true,
      message: error.message || 'Error signing out. Please try again.'
    };
  }

  return {
    error: false,
    message: 'Signed out successfully!'
  };
};

const signInWithGoogle = signInWith('google');

export { signInWithGoogle, signInWithPassword, signUp, signOut };
