import supabase from '@/lib/supabase/client';
import z from 'zod';
import { signUpSchema } from './schemas';
import { toast } from 'sonner';

const saveUser = async (
  user: Pick<z.infer<typeof signUpSchema>, 'firstName' | 'lastName' | 'email'>
) => {
  const { error, data } = await supabase.from('users').insert({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email
  });

  if (error) {
    toast.error('Error saving user data. Please try again.');
    return;
  }
};

export { saveUser };
