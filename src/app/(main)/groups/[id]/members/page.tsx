import AppSidebarHeader from '@/components/layout/AppSidebarHeader';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { fetchMembersByGroupId } from '@/features/group-members/actions/db';
import GroupMemberList from '@/features/group-members/components/GroupMemberList';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ManageMembersPage(props: Props) {
  return (
    <Suspense>
      <SuspensePage params={props.params} />
    </Suspense>
  );
}

async function SuspensePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  return (
    <div className="@container/main">
      <AppSidebarHeader
        data={[
          {
            title: 'Hiking Groups',
            href: '/groups'
          },
          {
            title: 'Group Details',
            href: `/groups/${id}`
          },
          {
            title: 'Manage Members'
          }
        ]}
      />
      <div className="max-w-3xl mx-auto flex-col gap-6 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseComponent groupId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspenseComponent({ groupId }: { groupId: string }) {
  const [profile, membersResult] = await Promise.all([
    getCurrentProfile(),
    fetchMembersByGroupId(groupId)
  ]);

  const { data: members } = membersResult;

  if (!members) {
    return null;
  }

  return (
    <GroupMemberList members={members} profile={profile!} groupId={groupId} />
  );
}
