import HeaderBreadcrumb from '@/components/HeaderBreadcrumb';
import AppSidebarHeader from '@/components/layout/AppSidebarHeader';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { GroupForm } from '@/features/groups/components/GroupForm';
import { Suspense } from 'react';

export default function CreateGroupPage() {
  return (
    <div className="@container/main">
      <AppSidebarHeader
        data={[
          { title: 'Hiking Groups', href: '/groups' },
          { title: 'Create Group' }
        ]}
      />
      <div className="max-w-3xl mx-auto flex-col gap-6 p-4 mb-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-0">
            <h1 className="text-3xl font-bold mb-2">Create Group</h1>
            <p className="text-muted-foreground mb-6">
              Fill-out the form below to create a new hiking group. As a
              creator, you will be the initial admin of the group.
            </p>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseComponent />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspenseComponent() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return <GroupForm profile={profile} />;
}
