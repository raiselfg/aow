import prisma from '@/prisma/prisma-client';
import { createHandler } from '@/lib/route-handler';

export const GET = createHandler(async () => {
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
  return categories;
});
