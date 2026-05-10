import prisma from '@/prisma/prisma-client';
import { UpdateProductSchema, IdParamSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NotFoundError } from '@/lib/errors';
import { deleteFile } from '@/lib/s3cloud';

export const GET = createHandler(async (_req, { params }) => {
  const { id } = IdParamSchema.parse(await params);
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { product_category: true },
  });
  
  if (!product) throw new NotFoundError('Product not found');
  return product;
});

export const PATCH = createHandler(async (req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);
  const data = await req.json();
  const validatedData = UpdateProductSchema.parse(data);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product not found');

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

  return product;
});

export const DELETE = createHandler(async (_req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('Product not found');

  await prisma.product.delete({ where: { id } });

  try {
    await deleteFile(product.image);
  } catch (err) {
    console.error(`[Cleanup] Failed to delete file for product ${id}:`, err);
  }

  return { success: true };
});
