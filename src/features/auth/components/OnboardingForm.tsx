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
import { User } from '@supabase/supabase-js';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../actions/schemas';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import UploadableAvatar from '@/components/UploadableAvatar';
import { Button } from '@/components/ui/button';
import { saveProfile } from '../actions/db';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import z from 'zod';

const roleOptions = [
  { value: 'hiker', label: 'Hiker' },
  { value: 'guide', label: 'Guide' },
  { value: 'admin', label: 'Admin' }
] as const;

export function OnboardingForm({ user }: { user: User }) {
  let firstName = '';
  let lastName = '';

  if (user.user_metadata?.full_name) {
    const fullName = user.user_metadata.full_name.split(' ');
    firstName = fullName[0];
    lastName = fullName[1];
  }

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: firstName || user.user_metadata?.first_name || '',
      lastName: lastName || user.user_metadata?.last_name || '',
      phone: user.user_metadata?.phone || '',
      role: null,
      avatar: null
    },
    mode: 'onTouched'
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const result = await saveProfile(values);

    if (result.error) {
      toast.error(result.message);
    }
    console.log('result', result);
    redirect('/');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your first name"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your last name"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="phone"
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
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value ?? ''}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Separator className="mt-12 mb-10" />
        <div className="flex flex-col gap-12">
          <div className="m-auto">
            <UploadableAvatar
              initialUrl={user.user_metadata?.avatar_url}
              onChange={(file: File) => form.setValue('avatar', file)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Save and Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
