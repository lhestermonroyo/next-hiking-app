'use client';
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
import AddMemberSheet from '@/features/group-members/components/AddMemberSheet';
import MemberItem from '@/features/group-members/components/MemberItem';
import { sortRole } from '@/features/group-members/utils/sortRole';
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

  const isAdmin = members.some(
    (member) => member.member_id === profile?.id && member.role === 'admin'
  );

  return (
    <div className="flex flex-col gap-4">
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Members</h1>
        {isAdmin && (
          <AddMemberSheet groupId={id}>
            <Button>Add Member</Button>
          </AddMemberSheet>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {members
          .sort((a, b) => sortRole(a.role, b.role))
          .map((member) => (
            <MemberItem key={member.id} member={member} isAdmin={isAdmin} />
          ))}
      </div>
    </div>
  );
}
