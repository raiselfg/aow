import prisma from '@/prisma/prisma-client';
import { UpdateProductCategorySchema, IdParamSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NotFoundError, ValidationError } from '@/lib/errors';

export const GET = createHandler(async (_req, { params }) => {
  const { id } = IdParamSchema.parse(await params);
  
  const productCategory = await prisma.productCategory.findUnique({
    where: { id },
    include: { product: true },
  });
  
  if (!productCategory) throw new NotFoundError('Product category not found');
  return productCategory;
});

export const PATCH = createHandler(async (req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);
  const body = await req.json();
  const validatedData = UpdateProductCategorySchema.parse(body);

  const existing = await prisma.productCategory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product category not found');

  const productCategory = await prisma.productCategory.update({
    where: { id },
    data: {
      name: validatedData.name,
      is_active: validatedData.is_active,
    },
  });

  return productCategory;
});

export const DELETE = createHandler(async (_req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);

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

  return { success: true };
});
