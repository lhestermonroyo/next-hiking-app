'use server';
import z from 'zod';
import { v4 as uuid } from 'uuid';
import { createClientForServer } from '@/lib/supabase/server';
import {
  groupSchema,
  groupSocialsSchema
} from '@/features/groups/actions/schemas';
import { table, views } from '@/data/constants';
import { uploadFile } from '@/lib/supabase/utils/upload';
import { saveGroupMember } from '@/features/group-members/actions/db';
import { revalidatePath } from 'next/cache';

const saveGroup = async (
  group: z.infer<typeof groupSchema>,
  creatorId: string
) => {
  const supabase = await createClientForServer();

  const groupId = uuid();
  let avatarUrl: string | null = null;

  if (group.avatar) {
    const path = `${groupId}/avatar.png`;
    const result = await uploadFile(group.avatar, path, 'groups');

    if (result.error) {
      return {
        error: true,
        message: 'Error uploading group avatar. Please try again.'
      };
    }

    avatarUrl = result.data?.publicUrl || null;
  }

  const results = await Promise.all([
    saveGroupMember(groupId, creatorId, 'admin'),
    supabase
      .from(table.GROUPS_TBL)
      .insert({
        creator_id: creatorId,
        id: groupId,
        name: group.name,
        bio: group.bio,
        location: group.location,
        group_email: group.group_email,
        group_phone: group.group_phone,
        avatar: avatarUrl
      })
      .select()
  ]);

  if (results[0].error || results[1].error) {
    return {
      error: true,
      message: 'Error saving group. Please try again.'
    };
  }

  revalidatePath('/groups');
  return {
    error: false,
    message: 'Group saved successfully!'
  };
};

const updateGroup = async (
  group: z.infer<typeof groupSchema>,
  groupId: string
) => {
  const supabase = await createClientForServer();
  let avatarUrl: string | null = null;

  if (group.avatar && group.avatar instanceof File) {
    const path = `${groupId}/avatar.png`;
    const result = await uploadFile(group.avatar, path, 'groups');

    if (result.error) {
      return {
        error: true,
        message: 'Error uploading group avatar. Please try again.'
      };
    }

    avatarUrl = result.data?.publicUrl || null;
  }

  const { error } = await supabase
    .from(table.GROUPS_TBL)
    .update({
      name: group.name,
      bio: group.bio,
      location: group.location,
      group_email: group.group_email,
      group_phone: group.group_phone,
      ...(avatarUrl ? { avatar: avatarUrl } : {})
    })
    .eq('id', groupId)
    .select();

  if (error) {
    return {
      error: true,
      message: 'Error updating group. Please try again.'
    };
  }

  revalidatePath(`/groups/${groupId}`);
  return {
    error: false,
    message: 'Group updated successfully!'
  };
};

const updateGroupSocials = async (
  socials: z.infer<typeof groupSocialsSchema>,
  groupId: string
) => {
  const supabase = await createClientForServer();

  const { error } = await supabase
    .from(table.GROUPS_TBL)
    .update({
      socials
    })
    .eq('id', groupId)
    .select();

  if (error) {
    return {
      error: true,
      message: 'Error updating group socials. Please try again.'
    };
  }

  revalidatePath(`/groups/${groupId}`);
  return {
    error: false,
    message: 'Group socials updated successfully!'
  };
};

const fetchAllGroups = async () => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase
    .from(views.GROUPS_WITH_STATS_VIEW)
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    return {
      error: true,
      message: 'Error fetching groups. Please try again.'
    };
  }

  return {
    error: false,
    data
  };
};

const fetchGroupById = async (id: string) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase
    .from(views.GROUP_DETAILS_WITH_STATS_VIEW)
    .select()
    .eq('id', id)
    .single();

  if (error) {
    return {
      error: true,
      message: 'Error fetching group. Please try again.'
    };
  }

  return {
    error: false,
    data
  };
};

export {
  saveGroup,
  updateGroup,
  updateGroupSocials,
  fetchAllGroups,
  fetchGroupById
};
