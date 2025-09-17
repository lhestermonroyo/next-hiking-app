'use client';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupSchema } from '@/features/groups/actions/schemas';
import { Input } from '@/components/ui/input';
import UploadableAvatar from '@/components/UploadableAvatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { saveGroup } from '@/features/groups/actions/db';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';

export function CreateGroupForm({
  profile
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
}) {
  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      group_email: '',
      group_phone: '',
      avatar: null
    },
    mode: 'onTouched'
  });

  async function onSubmit(values: z.infer<typeof groupSchema>) {
    const result = await saveGroup(values, profile.id);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      redirect('/');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-3 grid-rows-1 gap-24 mb-10">
          <div className="grid col-span-2 gap-x-4 gap-y-6 items-start">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter group name"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your bio"
                        className="h-36"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your location"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="group_email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter group email"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="group_phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="col-start-3">
            <div className="m-auto">
              <UploadableAvatar
                onChange={(file: File) => form.setValue('avatar', file)}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Loading...' : 'Save Group'}
        </Button>
      </form>
    </Form>
  );
}
