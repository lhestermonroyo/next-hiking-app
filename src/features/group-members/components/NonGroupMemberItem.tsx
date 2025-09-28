import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchNonMemberProfiles } from '@/features/auth/actions/db';
import { PlusCircle } from 'lucide-react';

export default function NonGroupMemberItem({
  profile,
  onAddMember
}: {
  profile: NonNullable<
    Awaited<ReturnType<typeof searchNonMemberProfiles>>['data']
  >;
  onAddMember: (profileId: string) => void;
}) {
  return (
    <Card key={profile.id} className="p-4">
      <CardContent className="flex p-0 items-center">
        <div className="flex flex-1 gap-2 items-center">
          <Avatar className="w-12 h-12 overflow-hidden">
            <AvatarImage
              src={profile?.avatar || undefined}
              className="object-cover object-top h-full w-full"
            />
            <AvatarFallback>{profile.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={() => onAddMember(profile.id)}
        >
          <PlusCircle />
          Add to Group
        </Button>
      </CardContent>
    </Card>
  );
}
