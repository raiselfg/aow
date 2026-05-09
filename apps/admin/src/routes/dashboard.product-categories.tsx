import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@aow/ui/components/badge';
import { Separator } from '@aow/ui/components/separator';

import { categoryOptions } from '@/lib/query-options';
import { CategorySortableList } from '@/product-category/components/category-sortable-list';
import { CreateProductCategoryForm } from '@/product-category/components/create-product-category-form';

export const Route = createFileRoute('/dashboard/product-categories')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(categoryOptions.list()),
  component: DashboardProductCategoriesContent,
});

function DashboardProductCategoriesContent() {
  const { data: categories } = useSuspenseQuery(categoryOptions.list());

  return (
    <div className='flex flex-col gap-8'>
      <div className='bg-background sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-black'>Категории товаров</h1>
          <CreateProductCategoryForm />
        </div>
        <Badge variant={'indigo'}>
          Всего категорий: {categories?.length || 0}
        </Badge>
        <Separator />
      </div>

      {categories && <CategorySortableList initialCategories={categories} />}
    </div>
  );
}
