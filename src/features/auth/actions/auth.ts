'use server';
import { createClientForServer } from '@/lib/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

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
    toast.error('Error signing in. Please try again.');
    return;
  }

  redirect(data.url);
};

const signInWithPassword = async () => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password'
  });

  if (error) {
    toast.error('Error signing in. Please try again.');
    return;
  }

  redirect('/');
};

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();

  redirect('/auth/login');
};

const signInWithGoogle = signInWith('google');

export { signInWithGoogle, signOut };
