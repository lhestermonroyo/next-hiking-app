'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { eventSchema } from '../actions/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import z from 'zod';
import DatePicker from '@/components/DatePicker';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';

export default function EventForm() {
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      mountain_id: '',
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      max_participants: 1,
      itinerary: ''
    }
  });

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="flex flex-col gap-6">
          <FormField
            name="mountain_id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mountain</FormLabel>
                <div className="grid">
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value ?? ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {pronounsOptions.map((pronoun) => (
                        <SelectItem key={pronoun.value} value={pronoun.value}>
                          {pronoun.label}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your event title"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your description"
                      className="h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="start_date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <div className="grid">
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <DatePicker
                          placeholder="Enter your start date"
                          field={field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="end_date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3">
                      <DatePicker
                        placeholder="Enter your end date"
                        field={field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="max_participants"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter max participants"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="itinerary"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Itinerary</FormLabel>
                <div className="grid">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your itinerary"
                      className="h-60"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          className="cursor-pointer"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Loading...' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
