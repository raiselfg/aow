import prisma from '@/prisma/prisma-client';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { z } from 'zod';

export const POST = createHandler(async (req) => {
  await requireAdminAuth();
  const categoryIds = z.array(z.string().uuid()).parse(await req.json());

  await prisma.$transaction(
    categoryIds.map((id, index) =>
      prisma.productCategory.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );

  return { success: true };
});
