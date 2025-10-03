import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { ProfileButtonClient } from './_ProfileButtonClient';
import { Suspense } from 'react';

export function ProfileButton() {
  return (
    <Suspense>
      <SuspenseComponent />
    </Suspense>
  );
}

async function SuspenseComponent() {
  const profile = await getCurrentProfile();

  return <ProfileButtonClient profile={profile} />;
}
