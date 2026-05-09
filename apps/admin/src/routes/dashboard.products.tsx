import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@aow/ui/components/badge';
import { Separator } from '@aow/ui/components/separator';
import { Skeleton } from '@aow/ui/components/skeleton';

import { productOptions } from '@/lib/query-options';
import { CreateProductForm } from '@/products/components/create-product-form';
import { ProductCard } from '@/products/components/product-card';

export const Route = createFileRoute('/dashboard/products')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productOptions.list()),
  component: DashboardProductsContent,
});

const SKELETONS = Array.from({ length: 16 }, (_, i) => (
  <div
    key={i}
    className='flex flex-col items-center justify-center gap-2'
  >
    <Skeleton className='h-64 w-48' />
    <div className='flex w-full max-w-48 items-center justify-between'>
      <Skeleton className='h-8 w-32' />
      <Skeleton className='h-8 w-8' />
    </div>
  </div>
));

function DashboardProductsContent() {
  const { data: products } = useSuspenseQuery(productOptions.list());

  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-background sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-black'>Товары</h1>
          <CreateProductForm />
        </div>
        <Badge variant={'indigo'}>Всего товаров: {products?.length || 0}</Badge>
        <Separator />
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {products
          ? products.map((product, index) => (
              <div
                key={product.id}
                className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          : SKELETONS}
      </div>
    </div>
  );
}
