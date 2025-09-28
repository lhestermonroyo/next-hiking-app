'use client';
import { ReactNode, useTransition } from 'react';
import { updateGroupMemberRole } from '../actions/db';
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

type Member = {
  id: string;
  member_id: string;
  group_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'editor';
};

export default function GroupMemberItem({
  member,
  isAdmin,
  onDelete
}: {
  member: Member;
  isAdmin: boolean;
  onDelete: (memberId: string, profileId: string) => void;
}) {
  const [isLoading, startTransition] = useTransition();

  return (
    <Card key={member.member_id} className="p-4">
      <CardContent className="flex p-0">
        <div className="flex flex-1 gap-2 items-center">
          <Avatar className="w-12 h-12 overflow-hidden">
            <AvatarImage
              src={member.avatar || undefined}
              className="object-cover object-top h-full w-full"
            />
            <AvatarFallback>{member.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">
              {member.first_name} {member.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {member.email} &bull;{' '}
              <span className="capitalize">{member.role}</span>
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2 items-center">
            <ChangeRoleDialog member={member}>
              <Button variant="secondary" className="cursor-pointer">
                <ChevronsUpDown />
                Change Role
              </Button>
            </ChangeRoleDialog>
            <ConfirmRemoveDialog
              fullname={`${member.first_name} ${member.last_name}`}
              loading={isLoading}
              onConfirm={() =>
                startTransition(() => onDelete(member.id, member.member_id))
              }
            >
              <Button
                variant="destructive"
                size="icon"
                className="cursor-pointer"
              >
                <Trash className="size-5" />
              </Button>
            </ConfirmRemoveDialog>
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
              {member.first_name} {member.last_name}'s
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

function ConfirmRemoveDialog({
  children,
  fullname,
  loading,
  onConfirm
}: {
  children: ReactNode;
  fullname: string;
  loading: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to remove this member?
          </DialogTitle>
          <DialogDescription className="mt-4">
            This action cannot be undone. This will permanently remove{' '}
            <span className="font-bold">{fullname}</span> from the group.
          </DialogDescription>
          <div className="mt-6 flex gap-2">
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={loading}
              onClick={onConfirm}
            >
              {loading ? 'Loading...' : 'Yes, Delete Member'}
            </Button>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogTrigger>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
