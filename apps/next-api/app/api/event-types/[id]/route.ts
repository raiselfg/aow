import prisma from '@/prisma/prisma-client';
import { UpdateEventTypeSchema, IdParamSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NotFoundError, ValidationError } from '@/lib/errors';

export const GET = createHandler(async (_req, { params }) => {
  const { id } = IdParamSchema.parse(await params);
  
  const eventType = await prisma.eventType.findUnique({
    where: { id },
  });
  
  if (!eventType) throw new NotFoundError('Event type not found');
  return eventType;
});

export const PATCH = createHandler(async (req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);
  const body = await req.json();
  const validatedData = UpdateEventTypeSchema.parse(body);

  const existing = await prisma.eventType.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Event type not found');

  const eventType = await prisma.eventType.update({
    where: { id },
    data: validatedData,
  });

  return eventType;
});

export const DELETE = createHandler(async (_req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);

  const existing = await prisma.eventType.findUnique({
    where: { id },
    include: { _count: { select: { event_requests: true } } },
  });

  if (!existing) throw new NotFoundError('Event type not found');

  if (existing._count.event_requests > 0) {
    throw new ValidationError(
      'Cannot delete event type that still has requests',
    );
  }

  await prisma.eventType.delete({ where: { id } });

  return { success: true };
});
