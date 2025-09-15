import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const signUpSchema = z
  .object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
  pronouns: z.enum(['he', 'she', 'they'], { message: 'Pronouns are required' }),
  location: z.string().min(1, 'Location is required'),
  avatar: z.file().nullable()
});
