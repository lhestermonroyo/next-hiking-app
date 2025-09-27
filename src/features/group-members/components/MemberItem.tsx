'use client';
import { useState } from 'react';
import { fetchMembersByGroupId } from '../actions/db';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' }
] as const;

export default function MemberItem({
  member
}: {
  member: NonNullable<
    Awaited<ReturnType<typeof fetchMembersByGroupId>>['data']
  >[number];
}) {
  const [role, setRole] = useState(member.role || 'member');

  const profile = Array.isArray(member.profile)
    ? member.profile[0]
    : member.profile;

  return (
    <Card key={member.id} className="p-4">
      <CardContent className="flex p-0">
        <div className="flex flex-1 gap-2 items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile?.avatar || undefined} />
            <AvatarFallback>{profile.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Select onValueChange={(value) => setRole(value)} value={role}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" size="icon">
            <Trash className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
