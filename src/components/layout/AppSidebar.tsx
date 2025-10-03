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
import { ProfileButton } from '@/features/auth/components/ProfileButton';
import { GroupMenuSection } from '@/features/groups/components/GroupMenuSection';
import MainMenuSection from './MainMenuSection';

export function AppSidebar({ ...props }: {} & ComponentProps<typeof Sidebar>) {
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
        <MainMenuSection />
        <GroupMenuSection />
      </SidebarContent>

      <SidebarFooter>
        <ProfileButton />
      </SidebarFooter>
    </Sidebar>
  );
}
