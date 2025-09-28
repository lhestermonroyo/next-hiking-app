'use server';
import z from 'zod';
import { createClientForServer } from '@/lib/supabase/server';
import { profileSchema } from '@/features/auth/actions/schemas';
import { table } from '@/data/constants';
import { uploadFile } from '@/lib/supabase/utils/upload';

const saveProfile = async (user: z.infer<typeof profileSchema>) => {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  const id = data.user?.id;
  const email = data.user?.email;
  let avatarUrl: string | null = null;

  if (!user.avatar) {
    avatarUrl = data.user?.user_metadata?.avatar_url || null;
  } else {
    const path = `${id}/avatar.png`;
    const result = await uploadFile(user.avatar, path, 'profiles');

    if (result.error) {
      return {
        error: true,
        message: result.message || 'Error uploading avatar. Please try again.'
      };
    }

    avatarUrl = result.data?.publicUrl || null;
  }

  const { error } = await supabase.from(table.PROFILES_TBL).insert({
    email,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    pronouns: user.pronouns,
    location: user.location,
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

const fetchProfileByEmail = async (email: string) => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from(table.PROFILES_TBL)
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return {
      error: true,
      message: error.message || 'Error fetching profile. Please try again.'
    };
  }

  return {
    error: false,
    data
  };
};

const searchNonMemberProfiles = async (
  groupId: string,
  searchQuery: string
) => {
  const supabase = await createClientForServer();

  const { data: members, error: membersError } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select('member_id')
    .eq('group_id', groupId);

  if (membersError) {
    return {
      error: true,
      message: membersError.message || 'Error fetching members.'
    };
  }

  const memberIds = members?.map((m) => m.member_id) ?? [];

  const { data, error } = await supabase
    .from(table.PROFILES_TBL)
    .select('id, email, first_name, last_name, avatar')
    .not('id', 'in', `(${memberIds.join(',')})`)
    .ilike('email', `%${searchQuery}%`)
    .or(
      `email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
    )
    .single();

  if (error) {
    return {
      error: true,
      message: error.message || 'Error fetching profiles.'
    };
  }

  return {
    error: false,
    data
  };
};

export { saveProfile, fetchProfileByEmail, searchNonMemberProfiles };
