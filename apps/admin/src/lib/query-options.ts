import { queryOptions } from '@tanstack/react-query';

import { eventRequests } from '@/event-request/lib/event-request';
import { eventTypes } from '@/event-type/lib/event-type';
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

export const eventRequestQueries = {
  all: ['event-requests'] as const,
  list: () => [...eventRequestQueries.all, 'list'] as const,
  detail: (id: string) => [...eventRequestQueries.all, 'detail', id] as const,
};

export const eventTypeQueries = {
  all: ['event-types'] as const,
  list: () => [...eventTypeQueries.all, 'list'] as const,
  detail: (id: string) => [...eventTypeQueries.all, 'detail', id] as const,
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

export const eventRequestOptions = {
  list: () =>
    queryOptions({
      queryKey: eventRequestQueries.list(),
      queryFn: () => eventRequests.getEventRequests(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: eventRequestQueries.detail(id),
      queryFn: () => eventRequests.getEventRequestById(id),
    }),
};

export const eventTypeOptions = {
  list: () =>
    queryOptions({
      queryKey: eventTypeQueries.list(),
      queryFn: () => eventTypes.getEventTypes(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: eventTypeQueries.detail(id),
      queryFn: () => eventTypes.getEventTypeById(id),
    }),
};
