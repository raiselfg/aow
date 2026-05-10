import { z } from 'zod';

export interface EventType {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export const EventTypeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Введите название типа события'),
});

export const CreateEventTypeSchema = EventTypeSchema.omit({
  id: true,
});

export const UpdateEventTypeSchema = CreateEventTypeSchema.partial();

export type CreateEventTypeDTO = z.infer<typeof CreateEventTypeSchema>;
export type UpdateEventTypeDTO = z.infer<typeof UpdateEventTypeSchema>;
