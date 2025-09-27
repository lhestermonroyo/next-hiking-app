import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { fetchNonMemberProfiles } from '@/features/auth/actions/db';
import { ReactNode, Suspense } from 'react';

export default function AddMemberSheet({
  groupId,
  children
}: {
  groupId: string;
  children: ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Member</SheetTitle>
          <SheetDescription>
            Invite and assign roles to new members.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 flex flex-col gap-4">
          {/* <SearchForm placeholder="Search members..." onSearch={() => {}} /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <SuspenseComponent groupId={groupId} />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}

async function SuspenseComponent({ groupId }: { groupId: string }) {
  const nonGroupMembers = await fetchNonMemberProfiles(groupId);
  console.log('nonGroupMembers', nonGroupMembers);

  return <div>Member list will go here...</div>;
}
