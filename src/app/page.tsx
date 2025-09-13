import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions/auth';
import { getProfileByEmail } from '@/features/auth/actions/db';
import { createClientForServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    redirect('/auth/login');
  }

  const profile = await getProfileByEmail(user.data.user.email!);

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <Layout>
      <h1>Home Page</h1>
    </Layout>
  );

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1>Home Page</h1>
      <Button onClick={signOut}>Logout</Button>
    </div>
  );
}
