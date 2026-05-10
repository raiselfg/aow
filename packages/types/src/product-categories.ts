import { z } from 'zod';
import { ProductSchema, LandingProductSchema } from './products.js';

export interface ProductCategory {
  id: string;
  name: string;
  order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Введите название категории')
    .max(50, 'Название слишком длинное (максимум 50 символов)'),
  order: z.number(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ProductCategoryWithProductsSchema = ProductCategorySchema.extend({
  product: z.array(z.lazy(() => ProductSchema)),
});

export const LandingCategorySchema = ProductCategorySchema.pick({
  id: true,
  name: true,
}).extend({
  product: z.array(z.lazy(() => LandingProductSchema)),
});

export const CreateProductCategorySchema = ProductCategorySchema.pick({
  name: true,
  is_active: true,
});

export const UpdateProductCategorySchema =
  CreateProductCategorySchema.partial();

export type LandingCategory = z.infer<typeof LandingCategorySchema>;
export type CreateProductCategoryDTO = z.infer<
  typeof CreateProductCategorySchema
>;
export type UpdateProductCategoryDTO = z.infer<
  typeof UpdateProductCategorySchema
>;
export type ProductCategoryWithProducts = z.infer<
  typeof ProductCategoryWithProductsSchema
>;
