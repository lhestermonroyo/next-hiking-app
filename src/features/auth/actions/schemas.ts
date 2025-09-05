import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First Name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last Name must be at least 2 characters long'),
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
