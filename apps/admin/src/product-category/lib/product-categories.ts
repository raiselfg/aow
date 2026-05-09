import type {
  CreateProductCategoryDTO,
  ProductCategoryWithProducts,
  UpdateProductCategoryDTO,
} from '@aow/types/product-categories';

import { api, handleApiError } from '../../lib/axios-instance';

export const productCategories = {
  getCategories: async () => {
    try {
      const { data } = await api.get<ProductCategoryWithProducts[]>(
        '/product-categories',
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch product categories');
    }
  },
  getCategoryById: async (id: string) => {
    try {
      const { data } = await api.get<ProductCategoryWithProducts>(
        `/product-categories/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch product category');
    }
  },
  updateCategory: async (id: string, updateData: UpdateProductCategoryDTO) => {
    try {
      const { data } = await api.patch<UpdateProductCategoryDTO>(
        `/product-categories/${id}`,
        updateData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to update product category');
    }
  },
  createCategory: async (createData: CreateProductCategoryDTO) => {
    try {
      const { data } = await api.post<CreateProductCategoryDTO>(
        '/product-categories',
        createData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create product category');
    }
  },
  reorderCategories: async (categoryIds: string[]) => {
    try {
      const { data } = await api.post<{ success: boolean }>(
        '/product-categories/reorder',
        categoryIds,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to reorder product categories');
    }
  },
  deleteCategory: async (id: string) => {
    try {
      const { data } = await api.delete<{ success: boolean }>(
        `/product-categories/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to delete product category');
    }
  },
};
