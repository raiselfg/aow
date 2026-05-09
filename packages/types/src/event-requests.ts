import { z } from 'zod';
import type { EventRequest, EventType, RequestStatus } from '@aow/database';

export const RequestStatusEnum = z.enum([
  'unconfirmed',
  'confirmed',
  'completed',
  'cancelled',
]);

export type RequestStatusLabels = z.infer<typeof RequestStatusEnum>;

export const statusLabels: Record<RequestStatusLabels, string> = {
  unconfirmed: 'Не подтвержден',
  confirmed: 'Подтвержден',
  completed: 'Выполнен',
  cancelled: 'Отменен',
};

export const statusColors: Record<
  RequestStatusLabels,
  'indigo' | 'default' | 'secondary' | 'destructive'
> = {
  unconfirmed: 'indigo',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
};

export const EventTypeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Введите название типа события'),
});

export const EventRequestSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Введите имя клиента'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/, 'Введите номер телефона'),
  event_type_id: z.uuid('Выберите тип события'),
  start_date: z.date(),
  end_date: z.date(),
  guests: z
    .number('Введите число')
    .int('Введите целое число')
    .min(0, 'Количество гостей не может быть отрицательным'),
  budget: z
    .number('Введите число')
    .int('Введите целое число')
    .min(0, 'Бюджет не может быть отрицательным'),
  status: RequestStatusEnum,
  address: z.string().min(1, 'Введите адрес мероприятия'),
  comment: z.string().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const EventRequestWithEventTypeSchema = EventRequestSchema.extend({
  event_type: EventTypeSchema,
});

export const CreateEventRequestSchema = z.object({
  name: z.string().min(1, 'Введите имя клиента'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/, 'Введите номер телефона'),
  event_type_id: z.uuid('Выберите тип события'),
  start_date: z.date(),
  end_date: z.date(),
  guests: z
    .number('Введите число')
    .int('Введите целое число')
    .min(0, 'Количество гостей не может быть отрицательным'),
  budget: z
    .number('Введите число')
    .int('Введите целое число')
    .min(0, 'Бюджет не может быть отрицательным'),
  status: RequestStatusEnum,
  address: z.string().min(1, 'Введите адрес мероприятия'),
  comment: z.string().nullable().optional(),
});

export const UpdateEventRequestSchema = CreateEventRequestSchema.partial();

export const CreateEventTypeSchema = EventTypeSchema.omit({
  id: true,
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
