import prisma from '@/prisma/prisma-client';
import { UpdateEventRequestSchema } from '@aow/types/event-requests';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NotFoundError } from '@/lib/errors';
import { z } from 'zod';

const IdParamSchema = z.object({ id: z.string().uuid() });

export const GET = createHandler(async (_req, { params }) => {
  const { id } = IdParamSchema.parse(await params);
  
  const eventRequest = await prisma.eventRequest.findUnique({
    where: { id },
    include: { event_type: true },
  });
  
  if (!eventRequest) throw new NotFoundError('Event request not found');
  return eventRequest;
});

export const PATCH = createHandler(async (req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);
  const body = await req.json();
  
  const validatedData = UpdateEventRequestSchema.parse({
    ...body,
    ...(body.start_date ? { start_date: new Date(body.start_date) } : {}),
    ...(body.end_date ? { end_date: new Date(body.end_date) } : {}),
  });

  const existing = await prisma.eventRequest.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Event request not found');

  const eventRequest = await prisma.eventRequest.update({
    where: { id },
    data: validatedData,
  });

  return eventRequest;
});

export const DELETE = createHandler(async (_req, { params }) => {
  await requireAdminAuth();
  const { id } = IdParamSchema.parse(await params);

  const existing = await prisma.eventRequest.findUnique({
    where: { id },
  });

  if (!existing) throw new NotFoundError('Event request not found');

  await prisma.eventRequest.delete({ where: { id } });

  return { success: true };
});
