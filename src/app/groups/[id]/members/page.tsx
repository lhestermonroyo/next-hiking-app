import BackButton from '@/components/BackButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { SelectItem, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { roleSchema } from '@/features/auth/actions/schemas';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import {
  fetchGroupByMemberId,
  fetchMembersByGroupId
} from '@/features/group-members/actions/db';
import GroupMemberItem from '@/features/group-members/components/GroupMemberItem';
import GroupMemberList from '@/features/group-members/components/GroupMemberList';
import { sortRole } from '@/features/group-members/utils/sortRole';
import Link from 'next/link';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ManageMembersPage(props: Props) {
  return (
    <div className="max-w-3xl mx-auto flex-col gap-6 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuspensePage params={props.params} />
      </Suspense>
    </div>
  );
}

async function SuspensePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  const [profile, membersResult] = await Promise.all([
    getCurrentProfile(),
    fetchMembersByGroupId(id)
  ]);

  const { data: members } = membersResult;

  if (!members) {
    return null;
  }

  return <GroupMemberList members={members} profile={profile!} groupId={id} />;
}
