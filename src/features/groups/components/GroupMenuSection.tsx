import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { fetchGroupsByMemberId } from '@/features/group-members/actions/db';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';

type GroupItem = {
  id: string;
  name: string;
  avatar: string | null;
};

export function GroupMenuSection() {
  return (
    <Suspense>
      <SidebarGroup>
        <SidebarGroupLabel>Your Hiking Groups</SidebarGroupLabel>
        <SuspenseComponent />
      </SidebarGroup>
    </Suspense>
  );
}

async function SuspenseComponent() {
  const profile = await getCurrentProfile();
  const groupsResult = await fetchGroupsByMemberId(profile.id);

  if (groupsResult.error) {
    throw new Error(groupsResult.message);
  }

  const { data: groups } = groupsResult;

  const isMaxGroupsReached =
    Array.isArray(groups) &&
    groups.filter((item) => item.role === 'admin').length >= 2;

  return (
    <Fragment>
      {!isMaxGroupsReached && (
        <SidebarGroupAction title="Create Group" asChild>
          <Link href="/groups/create">
            <PlusIcon />
            <span className="sr-only">Create Group</span>
          </Link>
        </SidebarGroupAction>
      )}

      <SidebarGroupContent>
        <SidebarMenu>
          {Array.isArray(groups) && groups.length ? (
            <SidebarMenu>
              {groups.map((item) => {
                const groups = Array.isArray(item.group)
                  ? item.group
                  : [item.group];

                return groups.map((group: GroupItem) => (
                  <SidebarMenuItem
                    key={group.id}
                    className="flex items-center gap-2"
                  >
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      asChild
                    >
                      <Link href={`/groups/${group.id}`}>
                        <Avatar className="h-8 w-8 overflow-hidden">
                          <AvatarImage
                            src={group.avatar ?? undefined}
                            alt={group.name}
                            className="object-cover object-top h-full w-full"
                          />
                          <AvatarFallback>
                            {group.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {group.name}
                          </span>
                          <span className="text-muted-foreground truncate text-xs capitalize">
                            {item.role}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ));
              })}
            </SidebarMenu>
          ) : (
            <p className="my-6 text-center text-xs text-muted-foreground">
              You are not part of any groups yet.
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </Fragment>
  );
}
