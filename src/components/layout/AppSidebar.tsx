'use client';
import { Component, HomeIcon, MapPlus, Mountain, PlusIcon } from 'lucide-react';
import { type ComponentProps } from 'react';
import Logo from '../Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar';
import { redirect, usePathname } from 'next/navigation';
import { ProfileButton } from '@/features/auth/components/ProfileButton';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import Link from 'next/link';
import { GroupMenu } from '@/features/groups/components/GroupMenu';
import { getGroupsByMemberId } from '@/features/group-members/actions/db';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
};

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon
  },
  {
    label: 'Explore',
    href: '/explore',
    icon: MapPlus
  },
  {
    label: 'Hiking Groups',
    href: '/groups',
    icon: Component
  },
  {
    label: 'Mountains',
    href: '/mountains',
    icon: Mountain
  }
];

export function AppSidebar({
  profile,
  memberedGroups,
  ...props
}: {
  profile?: Awaited<ReturnType<typeof getCurrentProfile>>;
  memberedGroups?: Awaited<ReturnType<typeof getGroupsByMemberId>>;
} & ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = '/' + pathname.split('/')[1];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="#">
                <Logo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={currentPath === item.href}
                    size="lg"
                    asChild
                  >
                    <Link href={item.href}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Hiking Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Create Group" asChild>
            <Link href="/groups/create">
              <PlusIcon />
              <span className="sr-only">Create Group</span>
            </Link>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <GroupMenu memberedGroups={memberedGroups} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ProfileButton profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
