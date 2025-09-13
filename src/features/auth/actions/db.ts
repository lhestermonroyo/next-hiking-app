'use server';
import z from 'zod';
import { profileSchema } from './schemas';
import { saveAvatarToStorage } from './storage';
import { createClientForServer } from '@/lib/supabase/server';

const saveProfile = async (
  user: Pick<
    z.infer<typeof profileSchema>,
    'firstName' | 'lastName' | 'role' | 'phone' | 'avatar'
  >
) => {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  const id = data.user?.id;
  const email = data.user?.email;
  let avatarUrl: string | null = null;

  if (!user.avatar) {
    avatarUrl = data.user?.user_metadata?.avatar_url || null;
  } else {
    const path = `${id}/avatar.png`;
    const result = await saveAvatarToStorage(user.avatar, path);
    console.log('saveAvatarToStorage result', result);

    if (result.error) {
      return {
        error: true,
        message: result.message || 'Error uploading avatar. Please try again.'
      };
    }

    avatarUrl = result.data?.publicUrl || null;
  }

  const { error } = await supabase.from('profile_table').insert({
    email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
    avatar: avatarUrl
  });

  if (error) {
    return {
      error: true,
      message: error.message || 'Error saving profile. Please try again.'
    };
  }

  return {
    error: false,
    message: 'Profile saved successfully!'
  };
};

const getProfileByEmail = async (email: string) => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from('profile_table')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export { saveProfile, getProfileByEmail };
