import { Badge } from '@aow/ui/components/badge';
import { Separator } from '@aow/ui/components/separator';
import { Skeleton } from '@aow/ui/components/skeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { CreateEventRequestForm } from '@/event-request/components/create-event-request-form';
import { EventRequestCard } from '@/event-request/components/event-request-card';
import { eventRequestOptions } from '@/lib/query-options';

export const Route = createFileRoute('/dashboard/event-requests')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventRequestOptions.list()),
  component: DashboardEventRequestsContent,
});

const SKELETONS = Array.from({ length: 8 }, (_, i) => (
  <Skeleton
    key={i}
    className='h-64 w-full rounded-xl'
  />
));

function DashboardEventRequestsContent() {
  const { data: requests } = useSuspenseQuery(eventRequestOptions.list());

  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-background sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-black'>Заявки</h1>
          <CreateEventRequestForm />
        </div>
        <Badge variant={'indigo'}>Всего заявок: {requests?.length || 0}</Badge>
        <Separator />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        {requests
          ? requests.map((request, index) => (
              <div
                key={request.id}
                className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventRequestCard request={request} />
              </div>
            ))
          : SKELETONS}
      </div>
    </div>
  );
}
