'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader
} from '@/components/ui/card';
import { ChevronRight, MapPin, MountainIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

type Group = {
  id: string;
  created_at: string;
  name: string;
  location: string;
  avatar: string | null;
  status: 'active' | 'inactive';
  avg_rating: number;
  total_events: number;
};

export default function GroupCard({ group }: { group: Group }) {
  return (
    <Card className="transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="flex items-center gap-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={group.avatar ?? undefined} alt={group.name} />
          <AvatarFallback className="rounded-lg">
            {group.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{group.name}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">{group.location}</p>
            </div>
            {group.status === 'inactive' && (
              <Fragment>
                &bull;
                <Badge variant="destructive">Inactive</Badge>
              </Fragment>
            )}
          </div>
        </div>
        <CardAction>
          <Link
            className="flex items-center gap-1 text-sm"
            href={`/groups/${group.id}`}
          >
            View <ChevronRight />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Star className="h-6 w-6 text-accent-foreground" />
            <p className="text-sm text-muted-foreground">
              {group.avg_rating}/5 Ratings
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MountainIcon className="h-6 w-6 text-accent-foreground" />
            <p className="text-sm text-muted-foreground">
              {group.total_events} Held Events
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
