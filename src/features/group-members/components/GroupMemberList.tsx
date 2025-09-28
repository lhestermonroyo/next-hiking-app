'use client';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import {
  deleteGroupMember,
  fetchMembersByGroupId,
  saveGroupMember
} from '../actions/db';
import { sortRole } from '../utils/sortRole';
import GroupMemberItem from './GroupMemberItem';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchForm } from '@/components/SearchForm';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { useDebounce } from '@/hooks/use-debounce';
import { searchNonMemberProfiles } from '@/features/auth/actions/db';
import NonGroupMemberItem from './NonGroupMemberItem';
import { toast } from 'sonner';

type NonGroupMember = {
  id: any;
  email: any;
  first_name: any;
  last_name: any;
  avatar: any;
};

export default function GroupMemberList({
  members,
  profile,
  groupId
}: {
  members: NonNullable<
    Awaited<ReturnType<typeof fetchMembersByGroupId>>['data']
  >;
  profile: NonNullable<
    Awaited<ReturnType<typeof getCurrentProfile>>['data']
  >[number];
  groupId: string;
}) {
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  const handleDelete = async (memberId: string, profileId: string) => {
    const result = await deleteGroupMember(memberId, groupId, profileId);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  const isAdmin = useMemo(
    () =>
      members.some(
        (member) => member.member_id === profile?.id && member.role === 'admin'
      ),
    [members, profile]
  );

  return (
    <div className="flex flex-col gap-4">
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Members</h1>
        {isAdmin && (
          <Button
            className="cursor-pointer"
            onClick={() => setShowAddMemberForm(!showAddMemberForm)}
          >
            {showAddMemberForm ? 'Close' : 'Add Member'}
          </Button>
        )}
      </div>
      {showAddMemberForm && <AddMemberForm groupId={groupId} />}
      <div className="flex flex-col gap-2">
        {members
          .sort((a, b) => sortRole(a.role, b.role))
          .map((member) => {
            const profile = Array.isArray(member.profile)
              ? member.profile[0]
              : member.profile;

            return (
              <GroupMemberItem
                key={member.member_id}
                member={{
                  id: member.id,
                  member_id: member.member_id,
                  group_id: member.group_id,
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  email: profile.email,
                  avatar: profile.avatar,
                  role: member.role
                }}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            );
          })}
      </div>
    </div>
  );
}

function AddMemberForm({ groupId }: { groupId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [searchResult, setSearchResult] = useState<NonGroupMember | null>(null);

  const debouncedSearchQuery = useDebounce({
    value: searchQuery,
    delay: 1000
  });

  useEffect(() => {
    searchMember(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const searchMember = async (query: string) => {
    try {
      if (query.length === 0) {
        setShowNoResults(false);
        setSearchResult(null);
        return;
      }

      const trimmedQuery = query.trim();

      const result = await searchNonMemberProfiles(groupId, trimmedQuery);

      if (result.error || !result.data) {
        setShowNoResults(true);
        return;
      }

      setSearchResult(result.data);
      setShowNoResults(false);
    } catch (error) {
      toast.error('Error searching member. Please try again.');
    } finally {
      setShowLoading(false);
    }
  };

  const handleAddMember = async (profileId: string) => {
    const result = await saveGroupMember(groupId, profileId, 'editor');

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      setSearchResult(null);
      setShowNoResults(false);
      setSearchQuery('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Add Member</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SearchForm
          placeholder="Search by name or email..."
          onSearch={setSearchQuery}
          value={searchQuery}
        />
        {showNoResults && <p>No results found</p>}
        {showLoading && <p>Loading...</p>}
        {searchResult && (
          <NonGroupMemberItem
            profile={searchResult}
            onAddMember={handleAddMember}
          />
        )}
      </CardContent>
    </Card>
  );
}
