import Logo from '@/components/Logo';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';
import { createClientForServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default function OnboardingPage() {
  return (
    <div className="max-w-3xl mx-auto flex-col gap-6 p-4 mb-8">
      <div className="flex flex-col gap-6">
        <Logo />
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-bold mb-2">Let us onboard you!</h1>
          <p className="text-muted-foreground mb-6">
            Please fill out the form below to complete your profile.
          </p>
        </div>
      </div>
      <SuspenseComponent />
    </div>
  );
}

async function SuspenseComponent() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth/login');
  }

  return <OnboardingForm user={data.user} />;
}
