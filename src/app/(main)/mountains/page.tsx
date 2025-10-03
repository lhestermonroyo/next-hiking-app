import AppSidebarHeader from '@/components/layout/AppSidebarHeader';

export default function MountainsPage() {
  return (
    <div className="@container/main">
      <AppSidebarHeader data={[{ title: 'Mountains' }]} />
      <div className="max-w-7xl mx-auto flex-col gap-6 p-6 md:p-10"></div>
    </div>
  );
}
