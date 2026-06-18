export type AppErrorCode =
  | 'network_error'
  | 'unauthorized'
  | 'forbidden'
  | 'rate_limited'
  | 'validation_error'
  | 'service_unavailable'
  | 'unknown';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export function toAppError(error: unknown, fallback: AppErrorCode = 'unknown'): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(fallback, error.message, error);
  return new AppError(fallback, 'Something went wrong.', error);
}

export function publicErrorMessage(error: unknown): string {
  const appError = toAppError(error);
  switch (appError.code) {
    case 'network_error':
      return 'Network connection failed. Please try again.';
    case 'unauthorized':
      return 'Please sign in to continue.';
    case 'forbidden':
      return 'You do not have access to this feature.';
    case 'rate_limited':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'validation_error':
      return appError.message;
    case 'service_unavailable':
      return 'This service is temporarily unavailable.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
