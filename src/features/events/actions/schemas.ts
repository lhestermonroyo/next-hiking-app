import z from 'zod';

export const eventSchema = z.object({
  mountain_id: z.string().min(1, 'Mountain ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  max_participants: z.number().min(1, 'Max participants must be at least 1'),
  itinerary: z.string().min(1, 'Itinerary is required')
});
