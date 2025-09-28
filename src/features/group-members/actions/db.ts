'use server';
import { table } from '@/data/constants';
import { createClientForServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type Role = 'admin' | 'editor';

const saveGroupMember = async (
  groupId: string,
  memberId: string,
  role: Role
) => {
  const supabase = await createClientForServer();

  const groupMembersQry = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select('group_id')
    .eq('member_id', memberId)
    .single();

  if (groupMembersQry.data && groupMembersQry.data?.group_id === groupId) {
    return {
      error: true,
      message: 'Member already exists in the group.'
    };
  }

  const { error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .insert({
      group_id: groupId,
      member_id: memberId,
      role
    })
    .select();

  if (error) {
    return {
      error: true,
      message: error.message || 'Error saving group member. Please try again.'
    };
  }

  revalidatePath(`/groups/${groupId}/members`);
  return {
    error: false,
    message: 'Group member saved successfully!'
  };
};

const updateGroupMemberRole = async (
  groupId: string,
  memberId: string,
  role: Role
) => {
  const supabase = await createClientForServer();

  const adminsQuery = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select('member_id')
    .eq('group_id', groupId)
    .eq('role', 'admin');

  if (adminsQuery.error) {
    return {
      error: true,
      message:
        adminsQuery.error.message ||
        'Error checking admin status. Please try again.'
    };
  }

  const admins = adminsQuery.data || [];
  const isLastAdmin = admins.length === 1 && admins[0].member_id === memberId;

  if (isLastAdmin && role !== 'admin') {
    return {
      error: true,
      message: 'Cannot change role. The group must have at least one admin.'
    };
  }

  const { error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .update({ role })
    .eq('group_id', groupId)
    .eq('member_id', memberId);

  if (error) {
    return {
      error: true,
      message: error.message || 'Error updating group member. Please try again.'
    };
  }

  revalidatePath(`/groups/${groupId}/members`);
  return {
    error: false,
    message: 'Group member updated successfully!'
  };
};

const deleteGroupMember = async (
  memberId: string,
  groupId: string,
  profileId: string
) => {
  const supabase = await createClientForServer();

  const adminsQuery = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select('member_id')
    .eq('group_id', groupId)
    .eq('role', 'admin');

  if (adminsQuery.error) {
    return {
      error: true,
      message:
        adminsQuery.error.message ||
        'Error checking admin status. Please try again.'
    };
  }

  const admins = adminsQuery.data || [];
  const isLastAdmin = admins.length === 1 && admins[0].member_id === profileId;

  if (isLastAdmin) {
    return {
      error: true,
      message: 'Cannot delete member. The group must have at least one admin.'
    };
  }

  const { error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .delete()
    .eq('id', memberId);

  if (error) {
    return {
      error: true,
      message: error.message || 'Error deleting group member. Please try again.'
    };
  }

  revalidatePath(`/groups/${groupId}/members`);
  return {
    error: false,
    message: 'Group member deleted successfully!'
  };
};

const fetchMembersByGroupId = async (groupId: string) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select(
      'id, group_id, member_id, role, profile:profiles_tbl!group_members_tbl_member_id_fkey(first_name, last_name, avatar, email)'
    )
    .eq('group_id', groupId);

  if (error) {
    return {
      error: true,
      message: error.message || 'Error fetching members. Please try again.'
    };
  }

  return {
    error: false,
    data
  };
};

const fetchGroupsByMemberId = async (memberId: string) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select(
      'group_id, member_id, role, group:groups_tbl!group_members_tbl_group_id_fkey(id, name, avatar)'
    )
    .eq('member_id', memberId);

  if (error) {
    return {
      error: true,
      message: error.message || 'Error fetching groups. Please try again.'
    };
  }

  return {
    error: false,
    data: Array.isArray(data) && data.length > 0 ? data[0] : null
  };
};

const fetchGroupByMemberId = async (groupId: string, memberId: string) => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase
    .from(table.GROUP_MEMBERS_TBL)
    .select()
    .eq('group_id', groupId)
    .eq('member_id', memberId)
    .single();

  if (error) {
    return {
      error: true,
      message: error.message || 'Error fetching group member. Please try again.'
    };
  }

  return {
    error: false,
    data
  };
};

export {
  saveGroupMember,
  updateGroupMemberRole,
  deleteGroupMember,
  fetchMembersByGroupId,
  fetchGroupsByMemberId,
  fetchGroupByMemberId
};
