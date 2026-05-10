import { z } from 'zod';
import { EventTypeSchema } from './event-types.js';

export enum RequestStatus {
  unconfirmed = 'unconfirmed',
  confirmed = 'confirmed',
  completed = 'completed',
  cancelled = 'cancelled',
}

export interface EventRequest {
  id: string;
  name: string;
  phone: string;
  event_type_id: string;
  start_date: Date;
  end_date: Date;
  guests: number;
  budget: number;
  status: RequestStatus;
  address: string;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
}

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

export const EventRequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Введите имя клиента'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона'),
  event_type_id: z.string().uuid('Выберите тип события'),
  start_date: z.date(),
  end_date: z.date(),
  guests: z
    .number()
    .int()
    .min(0, 'Количество гостей не может быть отрицательным'),
  budget: z
    .number()
    .int()
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
    .min(1, 'Введите номер телефона'),
  event_type_id: z.string().uuid('Выберите тип события'),
  start_date: z.date(),
  end_date: z.date(),
  guests: z
    .number()
    .int()
    .min(0, 'Количество гостей не может быть отрицательным'),
  budget: z
    .number()
    .int()
    .min(0, 'Бюджет не может быть отрицательным'),
  status: RequestStatusEnum,
  address: z.string().min(1, 'Введите адрес мероприятия'),
  comment: z.string().nullable().optional(),
});

export const UpdateEventRequestSchema = CreateEventRequestSchema.partial();

export type EventRequestWithEventType = z.infer<
  typeof EventRequestWithEventTypeSchema
>;
export type CreateEventRequestDTO = z.infer<typeof CreateEventRequestSchema>;
export type UpdateEventRequestDTO = z.infer<typeof UpdateEventRequestSchema>;
