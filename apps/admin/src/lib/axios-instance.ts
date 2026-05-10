import axios, { isAxiosError } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
): never => {
  if (isAxiosError(error)) {
    const serverMessage = error.response?.data?.message || error.message;
    throw new Error(`${defaultMessage}: ${serverMessage}`);
  }

  throw new Error(defaultMessage);
};
