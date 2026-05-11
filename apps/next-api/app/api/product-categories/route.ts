import prisma from '@/prisma/prisma-client';
import { CreateProductCategorySchema } from '@aow/types/product-categories';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

export const GET = createHandler(async () => {
  const productCategories = await prisma.productCategory.findMany({
    orderBy: [{ order: 'asc' }],
    include: { product: true },
  });
  return productCategories;
});

export const POST = createHandler(async req => {
  await requireAdminAuth();
  const body = await req.json();
  const validatedData = CreateProductCategorySchema.parse(body);

  const result = await prisma.$transaction(async tx => {
    const lastCategory = await tx.productCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

    return await tx.productCategory.create({
      data: {
        name: validatedData.name,
        is_active: validatedData.is_active,
        order: nextOrder,
      },
    });
  });

  return NextResponse.json(result, { status: 201 });
});
