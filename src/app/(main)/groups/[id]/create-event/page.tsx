import AppSidebarHeader from '@/components/layout/AppSidebarHeader';
import EventForm from '@/features/events/components/EventForm';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function CreateEventPage(props: Props) {
  return (
    <Suspense>
      <SuspensePage params={props.params} />
    </Suspense>
  );
}

async function SuspensePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  return (
    <div className="@container/main">
      <AppSidebarHeader
        data={[
          {
            title: 'Hiking Groups',
            href: '/groups'
          },
          {
            title: 'Group Details',
            href: `/groups/${id}`
          },
          {
            title: 'Create Event'
          }
        ]}
      />
      <div className="max-w-3xl mx-auto flex-col gap-6 p-4 mb-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-0">
            <h1 className="text-3xl font-bold mb-2">Create Event</h1>
            <p className="text-muted-foreground">
              Fill in the details below to create a new event for your group.
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SuspenseComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function SuspenseComponent() {
  return <EventForm />;
}
