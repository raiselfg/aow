import { z } from 'zod';
import type { EventRequest, EventType, RequestStatus } from '@aow/database';

export const RequestStatusEnum = z.enum([
  'new',
  'in_progress',
  'confirmed',
  'completed',
  'cancelled',
]);

export const EventTypeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Введите название типа события'),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const EventRequestSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Введите имя клиента'),
  phone: z.string().min(1, 'Введите номер телефона'),
  event_type_id: z.uuid('Выберите тип события'),
  start_date: z.iso.datetime(),
  end_date: z.iso.datetime(),
  guests: z
    .number()
    .int()
    .min(0, 'Количество гостей не может быть отрицательным'),
  budget: z.number().int().min(0, 'Бюджет не может быть отрицательным'),
  status: RequestStatusEnum,
  address: z.string().min(1, 'Введите адрес мероприятия'),
  comment: z.string().nullish(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const EventRequestWithEventTypeSchema = EventRequestSchema.extend({
  event_type: EventTypeSchema,
});

export const CreateEventRequestSchema = EventRequestSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  status: RequestStatusEnum.default('new'),
});

export const UpdateEventRequestSchema = CreateEventRequestSchema.partial();

export const CreateEventTypeSchema = EventTypeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateEventTypeSchema = CreateEventTypeSchema.partial();

export type { EventRequest, EventType, RequestStatus };
export type EventRequestWithEventType = z.infer<
  typeof EventRequestWithEventTypeSchema
>;
export type CreateEventRequestDTO = z.infer<typeof CreateEventRequestSchema>;
export type UpdateEventRequestDTO = z.infer<typeof UpdateEventRequestSchema>;
export type CreateEventTypeDTO = z.infer<typeof CreateEventTypeSchema>;
export type UpdateEventTypeDTO = z.infer<typeof UpdateEventTypeSchema>;
