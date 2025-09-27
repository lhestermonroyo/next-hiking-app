import { fetchProfileByEmail } from '@/features/auth/actions/db';
import { createClientForServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getCurrentProfile() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return redirect('/auth/login');
  }

  const { data: profile } = await fetchProfileByEmail(user.data.user.email!);

  if (!profile) {
    return redirect('/onboarding');
  }

  return profile;
}
