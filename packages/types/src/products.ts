import { z } from 'zod';
import { ProductCategorySchema } from './product-categories.js';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  image: string;
  created_at: Date;
  updated_at: Date;
  product_category_id: string;
}

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Введите название товара')
    .max(50, 'Название слишком длинное (максимум 50 символов)'),
  description: z
    .string()
    .max(255, 'Описание не должно превышать 255 символов')
    .nullish(),
  is_active: z.boolean(),
  image: z.string().url('Некорректная ссылка на изображение'),
  created_at: z.date(),
  updated_at: z.date(),
  product_category_id: z.string().min(1, 'Выберите категорию из списка').uuid(),
});

export const ProductWithProductCategorySchema = ProductSchema.extend({
  product_category: z.lazy(() => ProductCategorySchema).optional(),
});

export const CreateProductApiSchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).extend({
  image: z.string().url('Некорректная ссылка на изображение'),
});

export const CreateProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).extend({
  file: z.any().optional(),
});

export const UpdateProductBodySchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).partial();

export const LandingProductSchema = ProductSchema.pick({
  id: true,
  name: true,
  image: true,
});

export const ProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  is_active: true,
  product_category_id: true,
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
export type LandingProduct = z.infer<typeof LandingProductSchema>;
export type CreateProductApiDTO = z.infer<typeof CreateProductApiSchema>;
export type CreateProductFormDTO = z.infer<typeof CreateProductFormSchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
export type ProductWithProductCategory = z.infer<
  typeof ProductWithProductCategorySchema
>;

export type CreateProductDTO = CreateProductApiDTO;
export type UpdateProductDTO = z.infer<typeof UpdateProductBodySchema>;
