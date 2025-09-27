'use client';
import { SearchForm } from '@/components/SearchForm';
import { fetchAllGroups } from '../actions/db';
import GroupCard from './GroupCard';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function JoinedGroupsTab({
  groups
}: {
  groups: Awaited<ReturnType<typeof fetchAllGroups>>['data'] | null;
}) {
  const [search, setSearch] = useState('');
  const debouncedVal = useDebounce({ value: search, delay: 300 });

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex gap-2 justify-start">
        <SearchForm
          placeholder="Search hiking groups..."
          onSearch={setSearch}
        />
      </div>
      <p>Coming soon!</p>
    </div>
  );
}
