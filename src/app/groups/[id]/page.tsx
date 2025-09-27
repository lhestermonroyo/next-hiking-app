import BackButton from '@/components/BackButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { fetchGroupByMemberId } from '@/features/group-members/actions/db';
import { fetchGroupById } from '@/features/groups/actions/db';
import { format } from 'date-fns';
import {
  ExternalLink,
  Facebook,
  Instagram,
  LucideProps,
  Mail,
  MountainIcon,
  Music2,
  Phone,
  Settings2,
  Star,
  Youtube
} from 'lucide-react';
import Link from 'next/link';
import { ForwardRefExoticComponent, RefAttributes, Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function GroupPage(props: Props) {
  return (
    <div className="max-w-7xl mx-auto flex-col gap-6 py-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuspensePage params={props.params} />
      </Suspense>
    </div>
  );
}

async function SuspensePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  const profile = await getCurrentProfile();

  if (!profile || !id) {
    return null;
  }

  const [groupResult, memberResult] = await Promise.all([
    fetchGroupById(id),
    fetchGroupByMemberId(id, profile.id)
  ]);

  const { data: group } = groupResult;
  const { data: member } = memberResult;

  if (!group) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 mb-4">
        <BackButton />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={group?.avatar ?? undefined} alt={group?.name} />
              <AvatarFallback className="rounded-lg">
                {group?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <h1 className="text-3xl font-bold">{group?.name}</h1>
              <p className="text-muted-foreground truncate">
                {group?.location} &bull; Active since{' '}
                {format(new Date(group?.created_at), 'MMMM yyyy')}
              </p>
            </div>
          </div>

          {member?.role === 'admin' && (
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/groups/${group.id}/members`}>Manage Members</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href={`/groups/${group.id}/settings`}>
                  <Settings2 className="size-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-6 grid-rows-5 gap-x-12 gap-y-4">
        <div className="col-span-4 row-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">About</h1>
            <p className="text-muted-foreground">{group?.bio}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Upcoming Events</h1>
            <div>
              <Button asChild className="float-right -mb-10">
                <Link href="/groups/create">Create Event</Link>
              </Button>
              <EventsTab />
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Stats</h1>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Star}
                label="Ratings"
                value={`${group?.avg_rating}/5`}
              />
              <StatCard
                icon={MountainIcon}
                label="Held Events"
                value={group?.total_events}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Contacts</h1>
            <ContactItem type="Email" value={group?.group_email} icon={Mail} />
            <ContactItem type="Phone" value={group?.group_phone} icon={Phone} />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Socials</h1>
            {group?.socials?.facebook && (
              <SocialItem icon={Facebook} value={group.socials.facebook} />
            )}
            {group?.socials?.instagram && (
              <SocialItem icon={Instagram} value={group.socials.instagram} />
            )}
            {group?.socials?.youtube && (
              <SocialItem icon={Youtube} value={group.socials.youtube} />
            )}
            {group?.socials?.tiktok && (
              <SocialItem icon={Music2} value={group.socials.tiktok} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Events</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="all">All Events Content</TabsContent>
      <TabsContent value="upcoming">Upcoming Events Content</TabsContent>
      <TabsContent value="past">Past Events Content</TabsContent>
    </Tabs>
  );
}

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2">
        <Icon className="h-6 w-6 text-accent-foreground" />
        <p className="text-muted-foreground">
          {value} {label}
        </p>
      </CardContent>
    </Card>
  );
}

function ContactItem({
  type,
  value,
  icon: Icon
}: {
  type: string;
  value: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}) {
  const redirect = type === 'Email' ? `mailto:${value}` : `tel:${value}`;

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col gap-0 w-full">
        <p className="text-sm text-muted-foreground">{type}</p>
        <div className="flex gap-4 items-center">
          <p className="text-accent-foreground flex-1">{value}</p>
          <Button variant="link" size="icon">
            <Link href={redirect} target="_blank" rel="noopener noreferrer">
              <Icon className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SocialItem({
  icon: Icon,
  value
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  value: string;
}) {
  const displayValue = value.replace(/^(https?:\/\/)?(www\.)?/, '');

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-2 w-full items-center">
        <Card className="p-1">
          <CardContent className="p-1">
            <Icon className="size-5 text-accent-foreground" />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-0 w-full">
          <p className="text-accent-foreground">{displayValue}</p>
        </div>
      </div>
      <Button variant="link" size="icon" asChild>
        <Link href={value} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
