import type { ProductCategoryWithProducts } from '@aow/types/product-categories';

import { Badge } from '@aow/ui/components/badge';
import { memo } from 'react';

import { DeleteProductCategoryButton } from './delete-product-category-button';
import { EditProductCategoryForm } from './edit-product-category-form';

interface ProductCategoryCardProps {
  category: ProductCategoryWithProducts;
}

export const ProductCategoryCard = memo(
  ({ category }: ProductCategoryCardProps) => {
    const isActive = category.is_active;
    const categoryPosition = category.order + 1;

    return (
      <div className='group border-border bg-card hover:border-muted-foreground relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl'>
        <div className='flex flex-1 flex-col gap-6 p-6'>
          <h3 className='text-foreground text-xl font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-0.5'>
            {category.name}
          </h3>

          <div className='flex items-start justify-between border-t pt-6'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Товаров в категории
              </span>
              <span className='text-foreground text-2xl font-black tracking-tighter'>
                {category.product?.length || 0}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <Badge variant={isActive ? 'green' : 'red'}>
                {isActive
                  ? 'Отображается на сайте'
                  : 'Не отображается на сайте'}
              </Badge>
              <Badge variant={'cyan'}>
                Позиция на сайте: {categoryPosition}
              </Badge>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <EditProductCategoryForm category={category} />
            <DeleteProductCategoryButton categoryId={category.id} />
          </div>
        </div>
      </div>
    );
  },
);
