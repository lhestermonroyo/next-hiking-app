import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { GroupForm } from '@/features/groups/components/GroupForm';

export default function CreateGroupPage() {
  return (
    <div className="max-w-3xl mx-auto flex-col gap-6 py-4 mb-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-bold mb-2">Create Group</h1>
          <p className="text-muted-foreground mb-6">
            Fill-out the form below to create a new hiking group. As a creator,
            you will be the initial admin of the group.
          </p>
        </div>
      </div>
      <SuspenseComponent />
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
