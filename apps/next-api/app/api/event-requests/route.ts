import prisma from '@/prisma/prisma-client';
import { CreateEventRequestSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

export const GET = createHandler(async () => {
  const eventRequests = await prisma.eventRequest.findMany({
    orderBy: [{ start_date: 'desc' }],
    include: { event_type: true },
  });
  return eventRequests;
});

export const POST = createHandler(async req => {
  // POST usually doesn't require admin auth for event requests (public form)
  // but let's check Hono setup.
  // Actually, Hono's index.ts says:
  // app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/event-requests/*', requireAdminAuth);
  // app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/event-requests', requireAdminAuth);
  // So it DOES require admin auth.
  await requireAdminAuth();

  const body = await req.json();
  const validatedData = CreateEventRequestSchema.parse(body);

  const eventRequest = await prisma.eventRequest.create({
    data: validatedData,
  });

  return NextResponse.json(eventRequest, { status: 201 });
});
