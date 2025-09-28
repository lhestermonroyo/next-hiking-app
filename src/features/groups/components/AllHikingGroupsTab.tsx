'use client';
import { SearchForm } from '@/components/SearchForm';
import { fetchAllGroups } from '../actions/db';
import GroupCard from './GroupCard';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Filter, Settings2 } from 'lucide-react';

export default function AllHikingGroupsTab({
  groups
}: {
  groups: Awaited<ReturnType<typeof fetchAllGroups>>['data'] | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedVal = useDebounce({ value: searchQuery, delay: 300 });

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex gap-2 justify-start">
        <SearchForm
          placeholder="Search hiking groups..."
          onSearch={setSearchQuery}
          value={searchQuery}
          className="min-w-[300px]"
        />
        <Button className="cursor-pointer" variant="secondary">
          <Filter />
          Filter
        </Button>
        <Button className="cursor-pointer" variant="secondary">
          <Settings2 />
          View
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.isArray(groups) &&
          groups
            .filter((group) =>
              group.name.toLowerCase().includes(debouncedVal.toLowerCase())
            )
            .map((group) => <GroupCard key={group.id} group={group} />)}
      </div>
    </div>
  );
}
