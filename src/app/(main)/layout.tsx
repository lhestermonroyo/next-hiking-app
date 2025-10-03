import { AppSidebarLayout } from '@/components/layout/AppSidebarLayout';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
