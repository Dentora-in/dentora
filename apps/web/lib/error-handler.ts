/**
 * Centralized Error Handler
 *
 * This module provides a unified way to handle errors across the application.
 * It normalizes different error types and provides user-friendly messages.
 *
 * Features:
 * - HTTP status code mapping
 * - Network error handling
 * - Axios error normalization
 * - Automatic toast notifications
 * - Detailed error logging for debugging
 *
 * Usage:
 *   import { handleError } from '@/lib/error-handler';
 *
 *   try {
 *     await someApiCall();
 *   } catch (error) {
 *     handleError(error, {
 *       fallbackMessage: 'Failed to complete operation'
 *     });
 *   }
 */

import { toastService } from "./toast";
import { AxiosError } from "axios";

/**
 * Standard error response from the API
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Options for error handling
 */
interface ErrorHandlerOptions {
  /** Fallback message if no specific message can be determined */
  fallbackMessage?: string;
  /** Whether to show a toast notification (default: true) */
  showToast?: boolean;
  /** Whether to log the error to console (default: true) */
  logError?: boolean;
  /** Custom error message overrides for specific status codes */
  statusMessages?: Record<number, string>;
  /** Context information for better error messages */
  context?: string;
  /** Callback to execute after handling the error */
  onError?: (error: Error) => void;
}

/**
 * User-friendly messages for common HTTP status codes
 */
const DEFAULT_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  408: "Request timeout. Please check your connection and try again.",
  409: "This action conflicts with existing data.",
  422: "The data provided is invalid. Please check and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "We're experiencing technical difficulties. Please try again later.",
  502: "Service temporarily unavailable. Please try again in a moment.",
  503: "Service is currently under maintenance. Please try again later.",
  504: "Request timeout. The server took too long to respond.",
};

/**
 * Extract error message from various error types
 */
function extractErrorMessage(error: unknown): string | null {
  // Axios error
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Check response data for error message
    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Try different message fields
      if (data.message) return data.message;
      if (data.error) return data.error;

      // Handle validation errors
      if (data.errors && typeof data.errors === "object") {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }

    // Check for network errors
    if (axiosError.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection.";
    }

    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    // Use axios error message as fallback
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === "string") {
    return error;
  }

  // Object with message property
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return null;
}

/**
 * Get HTTP status code from error
 */
function getStatusCode(error: unknown): number | null {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status || null;
  }

  if (error && typeof error === "object" && "status" in error) {
    return Number(error.status) || null;
  }

  if (error && typeof error === "object" && "statusCode" in error) {
    return Number(error.statusCode) || null;
  }

  return null;
}

/**
 * Get user-friendly message based on status code
 */
function getStatusMessage(
  statusCode: number,
  customMessages?: Record<number, string>,
): string | null {
  // Check custom messages first
  if (customMessages && customMessages[statusCode]) {
    return customMessages[statusCode];
  }

  // Fall back to default messages
  return DEFAULT_STATUS_MESSAGES[statusCode] || null;
}

/**
 * Main error handler function
 *
 * This function should be used as the primary way to handle errors
 * throughout the application. It will:
 * 1. Extract a meaningful error message
 * 2. Map status codes to user-friendly messages
 * 3. Show a toast notification
 * 4. Log the error for debugging
 *
 * @param error - The error to handle (can be any type)
 * @param options - Configuration options
 * @returns The error message that was displayed
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {},
): string {
  const {
    fallbackMessage = "An unexpected error occurred. Please try again.",
    showToast = true,
    logError = true,
    statusMessages,
    context,
    onError,
  } = options;

  // Log error for debugging
  if (logError) {
    const contextPrefix = context ? `[${context}]` : "";
    console.error(`${contextPrefix} Error:`, error);
  }

  // Determine the message to show
  let message: string;

  // Try to get status-based message first
  const statusCode = getStatusCode(error);
  if (statusCode) {
    const statusMessage = getStatusMessage(statusCode, statusMessages);
    if (statusMessage) {
      message = statusMessage;
    } else {
      // If no status message, try to extract from error
      message = extractErrorMessage(error) || fallbackMessage;
    }
  } else {
    // No status code, extract message directly
    message = extractErrorMessage(error) || fallbackMessage;
  }

  // Show toast notification
  if (showToast) {
    toastService.error(message, {
      description: context,
      preventDuplicate: true,
    });
  }

  // Execute callback if provided
  if (onError && error instanceof Error) {
    try {
      onError(error);
    } catch (callbackError) {
      console.error("Error in onError callback:", callbackError);
    }
  }

  return message;
}

/**
 * Handle authentication errors specifically
 * Provides more context for auth-related failures
 */
export function handleAuthError(
  error: unknown,
  action: string = "authenticate",
) {
  const statusCode = getStatusCode(error);

  const customMessages: Record<number, string> = {
    401: "Invalid credentials. Please check your email and password.",
    403: "Access denied. Please contact support if this persists.",
    500: `We're having trouble ${action === "login" ? "logging you in" : action === "signup" ? "creating your account" : "processing your request"}. Please try again later.`,
  };

  return handleError(error, {
    fallbackMessage: `Failed to ${action}. Please try again.`,
    statusMessages: customMessages,
    context: "Authentication",
  });
}

/**
 * Handle API call errors with specific context
 */
export function handleApiError(
  error: unknown,
  operation: string,
  options?: Omit<ErrorHandlerOptions, "context">,
) {
  return handleError(error, {
    ...options,
    context: operation,
    fallbackMessage:
      options?.fallbackMessage || `Failed to ${operation}. Please try again.`,
  });
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError;
    return (
      axiosError.code === "ERR_NETWORK" || axiosError.code === "ECONNABORTED"
    );
  }
  return false;
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const statusCode = getStatusCode(error);
  return statusCode === 401 || statusCode === 403;
}

/**
 * Check if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  const statusCode = getStatusCode(error);
  return statusCode === 400 || statusCode === 422;
}

/**
 * Safely execute an async function with error handling
 *
 * Usage:
 *   const result = await safeAsync(
 *     () => apiCall(),
 *     { fallbackMessage: 'Operation failed' }
 *   );
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  options?: ErrorHandlerOptions,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, options);
    return null;
  }
}
