import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions/auth';
import { createClientForServer } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getSession();

  console.log('data:', data);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1>Home Page</h1>
      <Button onClick={signOut}>Logout</Button>
    </div>
  );
}
