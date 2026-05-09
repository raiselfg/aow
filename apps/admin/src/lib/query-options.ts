import { queryOptions } from '@tanstack/react-query';

import { productCategories } from '@/product-category/lib/product-categories';
import { products } from '@/products/lib/products';

export const productQueries = {
  all: ['products'] as const,
  list: () => [...productQueries.all, 'list'] as const,
  detail: (id: string) => [...productQueries.all, 'detail', id] as const,
};

export const categoryQueries = {
  all: ['product-categories'] as const,
  list: () => [...categoryQueries.all, 'list'] as const,
  detail: (id: string) => [...categoryQueries.all, 'detail', id] as const,
};

export const productOptions = {
  list: () =>
    queryOptions({
      queryKey: productQueries.list(),
      queryFn: () => products.getProducts(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: productQueries.detail(id),
      queryFn: () => products.getProductById(id),
    }),
};

export const categoryOptions = {
  list: () =>
    queryOptions({
      queryKey: categoryQueries.list(),
      queryFn: () => productCategories.getCategories(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: categoryQueries.detail(id),
      queryFn: () => productCategories.getCategoryById(id),
    }),
};
