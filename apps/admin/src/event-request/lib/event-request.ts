import type {
  CreateEventRequestDTO,
  EventRequest,
  EventRequestWithEventType,
  UpdateEventRequestDTO,
} from '@aow/types/event-requests';

import { api, handleApiError } from '../../lib/axios-instance';

export const eventRequests = {
  getEventRequests: async () => {
    try {
      const { data } =
        await api.get<EventRequestWithEventType[]>('/event-requests');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch event requests');
    }
  },
  getEventRequestById: async (id: string) => {
    try {
      const { data } = await api.get<EventRequestWithEventType>(
        `/event-requests/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch event request');
    }
  },
  createEventRequest: async (createData: CreateEventRequestDTO) => {
    try {
      const { data } = await api.post<EventRequest>(
        '/event-requests',
        createData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create event request');
    }
  },
  updateEventRequest: async (id: string, updateData: UpdateEventRequestDTO) => {
    try {
      const { data } = await api.patch<EventRequest>(
        `/event-requests/${id}`,
        updateData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to update event request');
    }
  },
  deleteEventRequest: async (id: string) => {
    try {
      const { data } = await api.delete<{ success: boolean }>(
        `/event-requests/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to delete event request');
    }
  },
};
