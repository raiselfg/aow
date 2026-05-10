import { getPrisma } from '@aow/database';
import {
  ProductCategoryWithProductsSchema as BaseProductCategoryWithProductsSchema,
  CreateProductCategorySchema,
  ProductCategorySchema,
  UpdateProductCategorySchema,
} from '@aow/types/product-categories.js';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { NotFoundError, ValidationError } from '../lib/errors.js';

const prisma = getPrisma();

const ProductCategoryWithProductsSchema =
  BaseProductCategoryWithProductsSchema.openapi('ProductCategoryWithProducts');

const IdParamSchema = z.object({
  id: z.uuid().openapi({
    param: { name: 'id', in: 'path' },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const productCategoriesRoutes = new OpenAPIHono();

// GET /
productCategoriesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProductCategoryWithProductsSchema),
          },
        },
        description: 'Retrieve all product categories with their products',
      },
    },
  }),
  async c => {
    const productCategories = await prisma.productCategory.findMany({
      orderBy: [{ order: 'asc' }],
      include: { product: true },
    });
    return c.json(productCategories);
  },
);

// POST /reorder
productCategoriesRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/reorder',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.array(z.string().uuid()),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Reorder product categories',
      },
    },
  }),
  async c => {
    const categoryIds = c.req.valid('json');

    await prisma.$transaction(
      categoryIds.map((id, index) =>
        prisma.productCategory.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    return c.json({ success: true });
  },
);

// GET /:id
productCategoriesRoutes.openapi(
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
            schema: ProductCategoryWithProductsSchema,
          },
        },
        description: 'Retrieve a product category by ID',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!productCategory) throw new NotFoundError('Product category not found');
    return c.json(productCategory);
  },
);

// POST /
productCategoriesRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProductCategorySchema.openapi(
              'CreateProductCategory',
            ),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ProductCategorySchema.openapi('ProductCategory'),
          },
        },
        description: 'Create a new product category',
      },
    },
  }),
  async c => {
    const body = c.req.valid('json');
    const { name, is_active } = body;

    const result = await prisma.$transaction(async tx => {
      const lastCategory = await tx.productCategory.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

      return await tx.productCategory.create({
        data: {
          name,
          is_active,
          order: nextOrder,
        },
      });
    });

    return c.json(result, 201);
  },
);

// PATCH /:id
productCategoriesRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateProductCategorySchema.openapi(
              'UpdateProductCategory',
            ),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductCategorySchema.openapi('ProductCategory'),
          },
        },
        description: 'Update a product category',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');

    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError('Product category not found');

    const { name, is_active } = body;

    const productCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        is_active,
      },
    });

    return c.json(productCategory);
  },
);

// DELETE /:id
productCategoriesRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Delete a product category',
      },
      400: {
        description: 'Cannot delete category with products',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');

    const existing = await prisma.productCategory.findUnique({
      where: { id },
      include: { _count: { select: { product: true } } },
    });

    if (!existing) throw new NotFoundError('Product category not found');

    if (existing._count.product > 0) {
      throw new ValidationError(
        'Cannot delete category that still has products',
      );
    }

    await prisma.productCategory.delete({ where: { id } });

    return c.json({ success: true });
  },
);
