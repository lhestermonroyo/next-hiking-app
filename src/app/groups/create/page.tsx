import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { CreateGroupForm } from '@/features/groups/components/CreateGroupForm';

export default function CreateGroupPage() {
  return (
    <div className="max-w-4xl mx-auto flex-col gap-6 p-6 md:p-10">
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

  return <CreateGroupForm profile={profile} />;
}
