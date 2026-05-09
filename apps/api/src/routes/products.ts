import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '@aow/database';
import {
  ProductWithProductCategorySchema as BaseProductWithProductCategorySchema,
  CreateProductApiSchema as BaseCreateProductApiSchema,
  UpdateProductBodySchema as BaseUpdateProductBodySchema,
} from '@aow/types/products.js';
import { randomUUID } from 'crypto';

import { NotFoundError } from '../lib/errors.js';
import { deleteFile } from '../lib/s3cloud.js';

// Schemas
const ProductWithProductCategorySchema =
  BaseProductWithProductCategorySchema.openapi('ProductWithProductCategory');
const CreateProductApiSchema =
  BaseCreateProductApiSchema.openapi('CreateProduct');
const UpdateProductBodySchema =
  BaseUpdateProductBodySchema.openapi('UpdateProduct');

const IdParamSchema = z.object({
  id: z.uuid().openapi({
    param: { name: 'id', in: 'path' },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const productsRoutes = new OpenAPIHono();

// GET /
productsRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProductWithProductCategorySchema),
          },
        },
        description: 'Retrieve all products',
      },
    },
  }),
  async c => {
    const products = await prisma.product.findMany({
      include: { product_category: true },
    });
    return c.json(products);
  },
);

// GET /:id
productsRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductWithProductCategorySchema,
          },
        },
        description: 'Retrieve a product by ID',
      },
      404: { description: 'Product not found' },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const product = await prisma.product.findUnique({
      where: { id },
      include: { product_category: true },
    });
    if (!product) throw new NotFoundError('Product not found');
    return c.json(product);
  },
);

// POST /
productsRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': { schema: CreateProductApiSchema },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': { schema: ProductWithProductCategorySchema },
        },
        description: 'Create a new product',
      },
      400: { description: 'Invalid input' },
    },
  }),
  async c => {
    const data = c.req.valid('json');

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: data.name,
        description: data.description ?? null,
        is_active: data.is_active,
        image: data.image,
        product_category: { connect: { id: data.product_category_id } },
      },
      include: { product_category: true },
    });

    return c.json(product, 201);
  },
);

// PATCH /:id
productsRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': { schema: UpdateProductBodySchema },
          'multipart/form-data': { schema: UpdateProductBodySchema },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': { schema: ProductWithProductCategorySchema },
        },
        description: 'Update a product',
      },
      404: { description: 'Product not found' },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const validatedData = c.req.valid('json');

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Product findUnique failed');

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        is_active: validatedData.is_active,
        ...(validatedData.product_category_id
          ? {
              product_category: {
                connect: { id: validatedData.product_category_id },
              },
            }
          : {}),
      },
      include: { product_category: true },
    });

    return c.json(product);
  },
);

// DELETE /:id
productsRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: { params: IdParamSchema },
    responses: {
      200: {
        content: {
          'application/json': { schema: z.object({ success: z.boolean() }) },
        },
        description: 'Delete a product',
      },
      404: { description: 'Product not found' },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product not found');

    // We delete from DB first. If it fails (e.g. constraints), we don't delete the file.
    // If DB delete succeeds but S3 fails, we log it but still return success (the resource is gone from API perspective).
    await prisma.product.delete({ where: { id } });

    try {
      await deleteFile(product.image);
    } catch (err) {
      console.error(`[Cleanup] Failed to delete file for product ${id}:`, err);
    }

    return c.json({ success: true });
  },
);
