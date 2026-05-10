import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z.uuid(),
});

// Product Schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  image: z.url(),
  product_category_id: z.uuid(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Product Category Schemas
export const CreateProductCategorySchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().default(true),
});

export const UpdateProductCategorySchema =
  CreateProductCategorySchema.partial();

// Event Type Schemas
export const CreateEventTypeSchema = z.object({
  name: z.string().min(1),
});

export const UpdateEventTypeSchema = CreateEventTypeSchema.partial();

// Event Request Schemas
export const RequestStatusSchema = z.enum([
  'unconfirmed',
  'confirmed',
  'completed',
  'cancelled',
]);

export const CreateEventRequestSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  event_type_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  guests: z.number().int().positive(),
  budget: z.number().int().nonnegative(),
  status: RequestStatusSchema.default('unconfirmed'),
  address: z.string().min(1),
  comment: z.string().optional(),
});

export const UpdateEventRequestSchema = CreateEventRequestSchema.partial();
