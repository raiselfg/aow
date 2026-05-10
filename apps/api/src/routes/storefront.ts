import { getPrisma } from '@aow/database';
import { LandingCategorySchema as BaseLandingCategorySchema } from '@aow/types/product-categories.js';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const prisma = getPrisma();

export const storefrontRoutes = new OpenAPIHono();

const LandingCategorySchema =
  BaseLandingCategorySchema.openapi('LandingCategory');

storefrontRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/landing',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(LandingCategorySchema),
          },
        },
        description: 'Retrieve categories with products for the landing page',
      },
    },
  }),
  async c => {
    const categories = await prisma.productCategory.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        product: {
          where: { is_active: true },
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return c.json(categories);
  },
);
