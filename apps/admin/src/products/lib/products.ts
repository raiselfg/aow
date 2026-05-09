import type {
  CreateProductApiDTO,
  ProductWithProductCategory,
  UpdateProductDTO,
} from '@aow/types/products';

import { api, handleApiError } from '../../lib/axios-instance';

export const products = {
  getProducts: async () => {
    try {
      const { data } = await api.get<ProductWithProductCategory[]>('/products');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch products');
    }
  },

  getProductById: async (id: string) => {
    try {
      const { data } = await api.get<ProductWithProductCategory>(
        `/products/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch product');
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    } catch (error) {
      handleApiError(error, 'Failed to upload image');
      throw error;
    }
  },

  createProduct: async (productData: CreateProductApiDTO) => {
    try {
      const { data } = await api.post<ProductWithProductCategory>(
        '/products',
        productData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create product');
    }
  },

  updateProduct: async (id: string, productData: UpdateProductDTO) => {
    try {
      const { data } = await api.patch<UpdateProductDTO>(
        `/products/${id}`,
        productData,
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to update product ${id}`);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const { data } = await api.delete<ProductWithProductCategory>(
        `/products/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to delete product ${id}`);
    }
  },
};
