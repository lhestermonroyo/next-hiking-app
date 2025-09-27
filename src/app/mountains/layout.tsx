import { Layout } from '@/components/layout/Layout';

export default function MountainsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <Layout title="Mountains">{children}</Layout>;
}
