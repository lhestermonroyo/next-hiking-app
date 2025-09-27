'use client';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SearchForm({
  placeholder = 'Search',
  onSearch
}: {
  placeholder?: string;
  onSearch: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        id="search"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  );
}
