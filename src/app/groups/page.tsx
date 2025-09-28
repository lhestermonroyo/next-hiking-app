import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAllGroups } from '@/features/groups/actions/db';
import AllHikingGroupsTab from '@/features/groups/components/AllHikingGroupsTab';
import JoinedGroupsTab from '@/features/groups/components/JoinedGroupsTab';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';

export default function GroupsPage() {
  return (
    <div className="max-w-7xl mx-auto flex-col gap-6 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuspensePage />
      </Suspense>
    </div>
  );
}

async function SuspensePage() {
  const { data: allGroups } = await fetchAllGroups();

  if (!allGroups) {
    return null;
  }

  return (
    <Fragment>
      <Button asChild className="float-right -mb-10">
        <Link href="/groups/create">Create Group</Link>
      </Button>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Hiking Groups</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllHikingGroupsTab groups={allGroups} />
        </TabsContent>
        <TabsContent value="joined">
          <JoinedGroupsTab groups={allGroups} />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}
