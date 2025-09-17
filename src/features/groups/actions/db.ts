'use server';
import z from 'zod';
import { v4 as uuid } from 'uuid';
import { createClientForServer } from '@/lib/supabase/server';
import { groupSchema } from '@/features/groups/actions/schemas';
import { table } from '@/data/constants';
import { uploadFile } from '@/lib/supabase/utils/upload';
import { saveGroupMember } from '@/features/group-members/actions/db';

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

  return {
    error: false,
    message: 'Group saved successfully!'
  };
};

const getGroupByCreator = async (creatorId: string) => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from(table.GROUPS_TBL)
    .select('*')
    .eq('creator_id', creatorId)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export { saveGroup, getGroupByCreator };
