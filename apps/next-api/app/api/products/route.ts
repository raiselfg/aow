import prisma from '@/prisma/prisma-client';
import { CreateProductSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export const GET = createHandler(async () => {
  const products = await prisma.product.findMany({
    include: { product_category: true },
  });
  return products;
});

export const POST = createHandler(async (req) => {
  await requireAdminAuth();
  const data = await req.json();
  const validatedData = CreateProductSchema.parse(data);

  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: validatedData.name,
      description: validatedData.description ?? null,
      is_active: validatedData.is_active,
      image: validatedData.image,
      product_category: { connect: { id: validatedData.product_category_id } },
    },
    include: { product_category: true },
  });

  return NextResponse.json(product, { status: 201 });
});
