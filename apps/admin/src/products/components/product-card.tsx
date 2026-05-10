import type { ProductWithProductCategory } from '@aow/types/products';

import { Badge } from '@aow/ui/components/badge';
import { memo } from 'react';

import { DeleteProductButton } from './delete-product-button';
import { EditProductForm } from './edit-product-form';

export const ProductCard = memo(
  ({ product }: { product: ProductWithProductCategory }) => {
    const isActive = product.is_active;

    return (
      <div className='group border-border bg-card relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl'>
        <div className='bg-muted relative aspect-3/4 overflow-hidden'>
          <img
            src={product.image}
            alt={product.name || 'Товар'}
            className='h-full w-full object-cover'
          />

          <Badge
            variant={isActive ? 'green' : 'red'}
            className='absolute top-1 left-1'
          >
            {isActive ? 'Отображается на сайте' : 'Не отображается на сайте'}
          </Badge>
        </div>

        <div className='flex flex-col gap-1 p-4'>
          <div className='flex flex-col items-start justify-between gap-2'>
            {product.product_category && (
              <Badge
                variant={'purple'}
                className='shrink-0'
              >
                {product.product_category.name}
              </Badge>
            )}
            <span className='line-clamp-1 text-sm font-semibold'>
              {product.name}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <EditProductForm product={product} />
            <DeleteProductButton productId={product.id} />
          </div>
        </div>
      </div>
    );
  },
);
