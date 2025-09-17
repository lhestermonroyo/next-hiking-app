import { Layout } from '@/components/layout/Layout';

export default function GroupsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <Layout title="Hiking Groups">{children}</Layout>;
}
