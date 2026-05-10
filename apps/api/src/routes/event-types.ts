import { getPrisma } from '@aow/database';
import {
  EventTypeSchema,
  CreateEventTypeSchema,
  UpdateEventTypeSchema,
} from '@aow/types/event-requests.js';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { NotFoundError, ValidationError } from '../lib/errors.js';

const prisma = getPrisma();

export const eventTypesRoutes = new OpenAPIHono();

const EventTypeOpenApiSchema = EventTypeSchema.openapi('EventType');

const IdParamSchema = z.object({
  id: z.uuid().openapi({
    param: { name: 'id', in: 'path' },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

// GET /
eventTypesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(EventTypeOpenApiSchema),
          },
        },
        description: 'Retrieve all event types',
      },
    },
  }),
  async c => {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: [{ name: 'asc' }],
    });
    return c.json(eventTypes);
  },
);

// GET /:id
eventTypesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: EventTypeOpenApiSchema,
          },
        },
        description: 'Retrieve an event type by ID',
      },
      404: {
        description: 'Event type not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const eventType = await prisma.eventType.findUnique({
      where: { id },
    });
    if (!eventType) throw new NotFoundError('Event type not found');
    return c.json(eventType);
  },
);

// POST /
eventTypesRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateEventTypeSchema.openapi('CreateEventType'),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: EventTypeOpenApiSchema,
          },
        },
        description: 'Create a new event type',
      },
    },
  }),
  async c => {
    const body = c.req.valid('json');
    const eventType = await prisma.eventType.create({
      data: body,
    });
    return c.json(eventType, 201);
  },
);

// PATCH /:id
eventTypesRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateEventTypeSchema.openapi('UpdateEventType'),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: EventTypeOpenApiSchema,
          },
        },
        description: 'Update an event type',
      },
      404: {
        description: 'Event type not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');

    const existing = await prisma.eventType.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError('Event type not found');

    const eventType = await prisma.eventType.update({
      where: { id },
      data: body,
    });

    return c.json(eventType);
  },
);

// DELETE /:id
eventTypesRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Delete an event type',
      },
      400: {
        description: 'Cannot delete event type with requests',
      },
      404: {
        description: 'Event type not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');

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

    return c.json({ success: true });
  },
);
