'use client';
import { ReactNode, useState } from 'react';
import { fetchMembersByGroupId, updateGroupMemberRole } from '../actions/db';
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
import { ChevronsUpDown, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema } from '@/features/auth/actions/schemas';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import z from 'zod';
import { toast } from 'sonner';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' }
] as const;

type Member = NonNullable<
  Awaited<ReturnType<typeof fetchMembersByGroupId>>['data']
>[number];

export default function MemberItem({
  member,
  isAdmin
}: {
  member: Member;
  isAdmin: boolean;
}) {
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
            <p className="text-sm text-muted-foreground">
              {profile.email} &bull;{' '}
              <span className="capitalize">{member.role}</span>
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-4 items-center">
            <ChangeRoleDialog member={member}>
              <Button variant="secondary">
                <ChevronsUpDown />
                Change Role
              </Button>
            </ChangeRoleDialog>
            <Button variant="destructive" size="icon">
              <Trash className="size-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChangeRoleDialog({
  member,
  children
}: {
  member: Member;
  children: ReactNode;
}) {
  const profile = Array.isArray(member.profile)
    ? member.profile[0]
    : member.profile;

  const form = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: member.role
    },
    mode: 'onTouched'
  });

  const onSubmit = async (data: z.infer<typeof roleSchema>) => {
    const result = await updateGroupMemberRole(
      member.group_id,
      member.member_id,
      data.role
    );

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Change{' '}
            <span className="font-bold">
              {profile.first_name} {profile.last_name}'s
            </span>{' '}
            role.
          </DialogDescription>
          <div className="mt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <div className="grid">
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value ?? ''}
                          >
                            <SelectTrigger className="w-full">
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
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    className="cursor-pointer w-auto self-start"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Loading...'
                      : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
