'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Facebook, Instagram, Music2, Twitter, Youtube } from 'lucide-react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { groupSocialsSchema } from '../actions/schemas';
import z from 'zod';
import { updateGroupSocials } from '../actions/db';
import { toast } from 'sonner';

export default function GroupSocialsForm({
  initialValues
}: {
  initialValues?: z.infer<typeof groupSocialsSchema> & { groupId: string };
}) {
  const form = useForm({
    resolver: zodResolver(groupSocialsSchema),
    defaultValues: {
      twitter: initialValues?.twitter || '',
      facebook: initialValues?.facebook || '',
      instagram: initialValues?.instagram || '',
      youtube: initialValues?.youtube || '',
      tiktok: initialValues?.tiktok || ''
    },
    mode: 'onTouched'
  });

  const onSubmit = async (values: z.infer<typeof groupSocialsSchema>) => {
    const groupId = initialValues?.groupId as string;
    const result = await updateGroupSocials(values, groupId);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="flex flex-col gap-6">
          <SocialInput
            Icon={Twitter}
            placeholder="Enter your Twitter URL"
            name="twitter"
            form={form}
          />
          <SocialInput
            Icon={Facebook}
            placeholder="Enter your Facebook URL"
            name="facebook"
            form={form}
          />
          <SocialInput
            Icon={Instagram}
            placeholder="Enter your Instagram URL"
            name="instagram"
            form={form}
          />
          <SocialInput
            Icon={Youtube}
            placeholder="Enter your Youtube URL"
            name="youtube"
            form={form}
          />
          <SocialInput
            Icon={Music2}
            placeholder="Enter your TikTok URL"
            name="tiktok"
            form={form}
          />
        </div>
        <Button
          className="cursor-pointer"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Loading...' : 'Update Socials'}
        </Button>
      </form>
    </Form>
  );
}

function SocialInput({
  Icon,
  name,
  form,
  placeholder
}: {
  Icon: any;
  name: keyof z.infer<typeof groupSocialsSchema>;
  form: UseFormReturn<z.infer<typeof groupSocialsSchema>>;
  placeholder: string;
}) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 w-full items-start">
              <Card className="p-1">
                <CardContent className="p-1">
                  <Icon className="size-5 text-accent-foreground" />
                </CardContent>
              </Card>
              <div className="flex flex-col gap-0 w-full">
                <FormControl>
                  <Input
                    className="w-full"
                    type="text"
                    placeholder={placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
