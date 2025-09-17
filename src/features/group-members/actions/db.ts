import { table } from '@/data/constants';
import { createClientForServer } from '@/lib/supabase/server';

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

  return {
    error: false,
    message: 'Group member saved successfully!'
  };
};

const getGroupsByMemberId = async (memberId: string) => {
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
    data
  };
};

const getGroupByMemberId = async (groupId: string, memberId: string) => {
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

export { saveGroupMember, getGroupsByMemberId, getGroupByMemberId };
