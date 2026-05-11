import { Separator } from '@aow/ui/components/separator';
import { useQueries } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import {
  categoryOptions,
  eventRequestOptions,
  eventTypeOptions,
  productOptions,
} from '@/lib/query-options';

export const Route = createFileRoute('/dashboard/')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(productOptions.list()),
      queryClient.ensureQueryData(categoryOptions.list()),
      queryClient.ensureQueryData(eventTypeOptions.list()),
      queryClient.ensureQueryData(eventRequestOptions.list()),
    ]),
  component: DashboardIndexContent,
});

function DashboardIndexContent() {
  const [
    { data: products },
    { data: categories },
    { data: eventType },
    { data: eventRequests },
  ] = useQueries({
    queries: [
      productOptions.list(),
      categoryOptions.list(),
      eventTypeOptions.list(),
      eventRequestOptions.list(),
    ],
  });

  const stats = [
    {
      label: 'Товары',
      value: products?.length || 0,
      link: '/dashboard/products',
    },
    {
      label: 'Категории товаров',
      value: categories?.length || 0,
      link: '/dashboard/product-categories',
    },
    {
      label: 'Типы праздников',
      value: eventType?.length || 0,
      link: '/dashboard/event-types',
    },
    {
      label: 'Заявки на праздники',
      value: eventRequests?.length || 0,
      link: '/dashboard/event-requests',
    },
  ];

  return (
    <div className='flex flex-col gap-10'>
      <div className='sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <h1 className='text-foreground text-4xl font-black'>Главная</h1>

        <Separator />
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both group border-border bg-card hover:border-muted-foreground relative overflow-hidden rounded-lg border p-6 transition-all duration-300 hover:shadow-2xl'
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <Link
              to={stat.link}
              className='cursor-pointer'
            >
              <div className='relative z-1 flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                  <span className='text-[10px] font-bold tracking-widest uppercase'>
                    {stat.label}
                  </span>
                  <span className='text-4xl font-black tracking-tighter italic'>
                    {stat.value}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
