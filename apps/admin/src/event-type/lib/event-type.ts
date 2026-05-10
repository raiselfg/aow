import type {
  CreateEventTypeDTO,
  EventType,
  UpdateEventTypeDTO,
} from '@aow/types/event-types';

import { api, handleApiError } from '../../lib/axios-instance';

export const eventTypes = {
  getEventTypes: async () => {
    try {
      const { data } = await api.get<EventType[]>('/event-types');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch event types');
    }
  },
  getEventTypeById: async (id: string) => {
    try {
      const { data } = await api.get<EventType>(`/event-types/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch event type');
    }
  },
  createEventType: async (createData: CreateEventTypeDTO) => {
    try {
      const { data } = await api.post<EventType>('/event-types', createData);
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create event type');
    }
  },
  updateEventType: async (id: string, updateData: UpdateEventTypeDTO) => {
    try {
      const { data } = await api.patch<EventType>(
        `/event-types/${id}`,
        updateData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to update event type');
    }
  },
  deleteEventType: async (id: string) => {
    try {
      const { data } = await api.delete<{ success: boolean }>(
        `/event-types/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to delete event type');
    }
  },
};
