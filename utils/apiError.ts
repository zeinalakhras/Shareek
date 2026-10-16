import { isAxiosError } from 'axios';

interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[] | string> | string[];
}
const firstFieldError = (errors: ApiErrorBody['errors']): string | undefined => {
  if (!errors) return undefined;

  if (Array.isArray(errors)) {
    return typeof errors[0] === 'string' ? errors[0] : undefined;
  }

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && value.length > 0) return value[0];
    if (typeof value === 'string' && value.trim()) return value;
  }

  return undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Check your connection and try again.';
    }

    const body = error.response.data as ApiErrorBody | string | undefined;

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    if (body && typeof body === 'object') {
      return (
        firstFieldError(body.errors) ||
        body.message ||
        body.detail ||
        body.error ||
        fallback
      );
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
