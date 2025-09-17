import { ReactNode } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { getCurrentProfile } from '@/features/auth/utils/getCurrentUser';
import { Separator } from '@radix-ui/react-separator';
import { getGroupsByMemberId } from '@/features/group-members/actions/db';

export async function Layout({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const memberedGroups = await getGroupsByMemberId(profile.id);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        profile={profile}
        memberedGroups={memberedGroups}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main ">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h3 className="text-lg font-medium">{title}</h3>
              </div>
            </header>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
