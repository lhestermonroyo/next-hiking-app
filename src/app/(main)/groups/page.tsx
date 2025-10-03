import AppSidebarHeader from '@/components/layout/AppSidebarHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { fetchGroupsByMemberId } from '@/features/group-members/actions/db';
import { fetchAllGroups } from '@/features/groups/actions/db';
import AllHikingGroupsTab from '@/features/groups/components/AllHikingGroupsTab';
import JoinedGroupsTab from '@/features/groups/components/JoinedGroupsTab';
import Link from 'next/link';
import { Suspense } from 'react';

export default function GroupsPage() {
  return (
    <div className="@container/main">
      <AppSidebarHeader data={[{ title: 'Hiking Groups' }]} />
      <div className="max-w-7xl mx-auto flex-col gap-6 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SuspensePage />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspensePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const [groupsResult, joinedGroupsResult] = await Promise.all([
    fetchAllGroups(),
    fetchGroupsByMemberId(profile.id)
  ]);
  const { data: groups } = groupsResult;
  const { data: joinedGroups } = joinedGroupsResult;

  if (!groups) {
    return null;
  }

  const isMaxGroupsReached =
    Array.isArray(joinedGroups) &&
    joinedGroups.filter((item) => item.role === 'admin').length >= 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h1 className="text-3xl font-bold flex-1">Hiking Groups</h1>
        {!isMaxGroupsReached && (
          <Button asChild>
            <Link href="/groups/create">Create Group</Link>
          </Button>
        )}
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Hiking Groups</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllHikingGroupsTab groups={groups} />
        </TabsContent>
        <TabsContent value="joined">
          <JoinedGroupsTab groups={groups} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
