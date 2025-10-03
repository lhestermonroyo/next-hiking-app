import BackButton from '@/components/BackButton';
import AppSidebarHeader from '@/components/layout/AppSidebarHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { fetchGroupById } from '@/features/groups/actions/db';
import { GroupForm } from '@/features/groups/components/GroupForm';
import GroupSocialsForm from '@/features/groups/components/GroupSocialsForm';
import { Trash } from 'lucide-react';
import { ReactNode, Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function GroupSettingsPage(props: Props) {
  return (
    <Suspense>
      <SuspensePage params={props.params} />
    </Suspense>
  );
}

async function SuspensePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  return (
    <div className="@container/main">
      <AppSidebarHeader
        data={[
          { title: 'Hiking Groups', href: '/groups' },
          { title: 'Group Details', href: `/groups/${id}` },
          { title: 'Group Settings' }
        ]}
      />
      <div className="max-w-3xl mx-auto flex-col gap-6 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseComponent groupId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspenseComponent({ groupId }: { groupId: string }) {
  const [groupResult, profile] = await Promise.all([
    fetchGroupById(groupId),
    getCurrentProfile()
  ]);
  const { data: group } = groupResult;

  if (!group) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Group Settings</h1>
      <div className="flex flex-col gap-2">
        <GroupSettingsItem
          title="Group Details"
          subtitle="
          Update your group's information and settings below."
        >
          <div className="flex flex-col gap-4">
            <GroupForm
              profile={profile}
              initialValues={{
                groupId: group.id,
                name: group.name,
                bio: group.bio,
                location: group.location,
                group_email: group.group_email,
                group_phone: group.group_phone,
                avatar: group.avatar
              }}
            />
          </div>
        </GroupSettingsItem>
        <GroupSettingsItem
          title="Social Media"
          subtitle="Link your group's social media accounts."
        >
          <div className="flex flex-col gap-4">
            <GroupSocialsForm
              initialValues={{
                groupId: group.id,
                twitter: group?.socials?.twitter,
                facebook: group?.socials?.facebook,
                instagram: group?.socials?.instagram,
                youtube: group?.socials?.youtube,
                tiktok: group?.socials?.tiktok
              }}
            />
          </div>
        </GroupSettingsItem>
        <GroupSettingsItem
          title="Delete Group"
          subtitle="Deleting a group is permanent and cannot be undone. All group
              data, including posts, comments, and member information, will be
              permanently removed. Please proceed with caution."
        >
          <div className="flex flex-col gap-4">
            <Button
              className="cursor-pointer w-auto self-start"
              variant="destructive"
            >
              <Trash />
              Delete Group
            </Button>
          </div>
        </GroupSettingsItem>
      </div>
    </div>
  );
}

function GroupSettingsItem({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
