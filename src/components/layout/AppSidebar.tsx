'use client';
import { Component, HomeIcon, MapPlus, Mountain } from 'lucide-react';
import { type ComponentProps } from 'react';
import Logo from '../Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import { ProfileButton } from '@/features/auth/components/ProfileButton';
import { getCurrentProfile } from '@/utils/getCurrentUser';

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
    href: '/hiking-groups',
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
  ...props
}: { profile?: Awaited<ReturnType<typeof getCurrentProfile>> } & ComponentProps<
  typeof Sidebar
>) {
  const pathname = usePathname();

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
                    size="lg"
                    isActive={pathname === item.href}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ProfileButton profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
