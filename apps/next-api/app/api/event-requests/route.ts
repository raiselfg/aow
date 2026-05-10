import prisma from '@/prisma/prisma-client';
import { CreateEventRequestSchema } from '@aow/types/event-requests';
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

export const POST = createHandler(async (req) => {
  await requireAdminAuth();

  const body = await req.json();
  const validatedData = CreateEventRequestSchema.parse({
    ...body,
    start_date: body.start_date ? new Date(body.start_date) : undefined,
    end_date: body.end_date ? new Date(body.end_date) : undefined,
  });

  const eventRequest = await prisma.eventRequest.create({
    data: validatedData,
  });

  return NextResponse.json(eventRequest, { status: 201 });
});

