import z from 'zod';

export const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  bio: z.string().min(1, 'Bio is required'),
  location: z.string().min(1, 'Location is required'),
  avatar: z.file().nullable(),
  group_email: z.string().email().min(1, 'Group email is required'),
  group_phone: z
    .string()
    .min(10, 'Group phone number must be at least 10 digits long')
});

// add error messages to url validations
export const groupSocialsSchema = z.object({
  twitter: z
    .string()
    .url('Please enter a valid Twitter URL')
    .optional()
    .or(z.literal('')),
  facebook: z
    .string()
    .url('Please enter a valid Facebook URL')
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .url('Please enter a valid Instagram URL')
    .optional()
    .or(z.literal('')),
  youtube: z
    .string()
    .url('Please enter a valid Youtube URL')
    .optional()
    .or(z.literal('')),
  tiktok: z
    .string()
    .url('Please enter a valid TikTok URL')
    .optional()
    .or(z.literal(''))
});
