import AppSidebarHeader from '@/components/layout/AppSidebarHeader';

export default function HomePage() {
  return (
    <div className="@container/main">
      <AppSidebarHeader data={[{ title: 'Home' }]} />
      <div className="max-w-7xl mx-auto flex-col gap-6 p-6 md:p-10">
        Welcome to the Hiking App!
      </div>
    </div>
  );
}
