import { getPrisma } from '@aow/database';
import {
  EventRequestSchema,
  EventRequestWithEventTypeSchema as BaseEventRequestWithEventTypeSchema,
  CreateEventRequestSchema,
  UpdateEventRequestSchema,
} from '@aow/types/event-requests.js';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { NotFoundError } from '../lib/errors.js';

const prisma = getPrisma();

const EventRequestWithEventTypeSchema =
  BaseEventRequestWithEventTypeSchema.openapi('EventRequestWithEventType');
const EventRequestOpenApiSchema = EventRequestSchema.openapi('EventRequest');

const IdParamSchema = z.object({
  id: z.uuid().openapi({
    param: { name: 'id', in: 'path' },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const eventRequestsRoutes = new OpenAPIHono();

// GET /
eventRequestsRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(EventRequestWithEventTypeSchema),
          },
        },
        description: 'Retrieve all event requests with their types',
      },
    },
  }),
  async c => {
    const eventRequests = await prisma.eventRequest.findMany({
      orderBy: [{ start_date: 'desc' }],
      include: { event_type: true },
    });
    return c.json(eventRequests);
  },
);

// GET /:id
eventRequestsRoutes.openapi(
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
            schema: EventRequestWithEventTypeSchema,
          },
        },
        description: 'Retrieve an event request by ID',
      },
      404: {
        description: 'Event request not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const eventRequest = await prisma.eventRequest.findUnique({
      where: { id },
      include: { event_type: true },
    });
    if (!eventRequest) throw new NotFoundError('Event request not found');
    return c.json(eventRequest);
  },
);

// POST /
eventRequestsRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateEventRequestSchema.openapi('CreateEventRequest'),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: EventRequestOpenApiSchema,
          },
        },
        description: 'Create a new event request',
      },
    },
  }),
  async c => {
    const body = c.req.valid('json');
    const eventRequest = await prisma.eventRequest.create({
      data: body,
    });
    return c.json(eventRequest, 201);
  },
);

// PATCH /:id
eventRequestsRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateEventRequestSchema.openapi('UpdateEventRequest'),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: EventRequestOpenApiSchema,
          },
        },
        description: 'Update an event request',
      },
      404: {
        description: 'Event request not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');

    const existing = await prisma.eventRequest.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError('Event request not found');

    const eventRequest = await prisma.eventRequest.update({
      where: { id },
      data: body,
    });

    return c.json(eventRequest);
  },
);

// DELETE /:id
eventRequestsRoutes.openapi(
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
        description: 'Delete an event request',
      },
      404: {
        description: 'Event request not found',
      },
    },
  }),
  async c => {
    const { id } = c.req.valid('param');

    const existing = await prisma.eventRequest.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundError('Event request not found');

    await prisma.eventRequest.delete({ where: { id } });

    return c.json({ success: true });
  },
);
