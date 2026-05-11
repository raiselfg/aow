import { Badge } from '@aow/ui/components/badge';
import { Separator } from '@aow/ui/components/separator';
import { Skeleton } from '@aow/ui/components/skeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { CreateEventTypeForm } from '@/event-type/components/create-event-type-form';
import { EventTypeCard } from '@/event-type/components/event-type-card';
import { eventTypeOptions } from '@/lib/query-options';

export const Route = createFileRoute('/dashboard/event-types')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventTypeOptions.list()),
  component: DashboardEventTypesContent,
});

const SKELETONS = Array.from({ length: 6 }, (_, i) => (
  <Skeleton
    key={i}
    className='h-20 w-full rounded-lg'
  />
));

function DashboardEventTypesContent() {
  const { data: types } = useSuspenseQuery(eventTypeOptions.list());

  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-background sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-black'>Типы праздников</h1>
          <CreateEventTypeForm />
        </div>
        <Badge variant={'indigo'}>Всего типов: {types?.length || 0}</Badge>
        <Separator />
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {types
          ? types.map((type, index) => (
              <div
                key={type.id}
                className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventTypeCard eventType={type} />
              </div>
            ))
          : SKELETONS}
      </div>
    </div>
  );
}
