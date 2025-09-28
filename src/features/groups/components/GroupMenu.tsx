import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { fetchGroupsByMemberId } from '@/features/group-members/actions/db';

type GroupItem = {
  id: string;
  name: string;
  avatar: string | null;
};

export function GroupMenu({
  memberedGroups
}: {
  memberedGroups?: Awaited<ReturnType<typeof fetchGroupsByMemberId>>;
}) {
  if (
    memberedGroups &&
    Array.isArray(memberedGroups.data) &&
    memberedGroups.data.length
  ) {
    return (
      <SidebarMenu>
        {memberedGroups.data.map((item) => {
          const groups = Array.isArray(item.group) ? item.group : [item.group];

          return groups.map((group: GroupItem) => (
            <SidebarMenuItem key={group.id} className="flex items-center gap-2">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 overflow-hidden">
                  <AvatarImage
                    src={group.avatar ?? undefined}
                    alt={group.name}
                    className="object-cover object-top h-full w-full"
                  />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{group.name}</span>
                  <span className="text-muted-foreground truncate text-xs capitalize">
                    {item.role}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ));
        })}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <p className="my-6 text-center text-xs text-muted-foreground">
        You are not part of any groups yet.
      </p>
    </SidebarMenu>
  );
}
