import prisma from '@/prisma/prisma-client';
import { CreateEventTypeSchema } from '@/lib/validations';
import { createHandler } from '@/lib/route-handler';
import { requireAdminAuth } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

export const GET = createHandler(async () => {
  const eventTypes = await prisma.eventType.findMany({
    orderBy: [{ name: 'asc' }],
  });
  return eventTypes;
});

export const POST = createHandler(async (req) => {
  await requireAdminAuth();
  const body = await req.json();
  const validatedData = CreateEventTypeSchema.parse(body);

  const eventType = await prisma.eventType.create({
    data: validatedData,
  });

  return NextResponse.json(eventType, { status: 201 });
});
