/**
 * Centralized Toast Utility
 *
 * This module provides a consistent interface for displaying toast notifications
 * across the application using Sonner. It ensures:
 * - Consistent styling and duration
 * - Duplicate prevention for errors
 * - Standardized positioning
 *
 * Usage:
 *   import { toastService } from '@/lib/toast';
 *   toastService.success('Operation completed!');
 *   toastService.error('Something went wrong');
 */

import { toast as sonnerToast, toast } from "@workspace/ui/components/sonner";

// Track recent toasts to prevent duplicates
const recentToasts = new Map<string, number>();
const DUPLICATE_THRESHOLD_MS = 3000; // Don't show same toast within 3 seconds

/**
 * Check if a toast with the same message was recently shown
 */
function isDuplicate(message: string): boolean {
  const now = Date.now();
  const lastShown = recentToasts.get(message);

  if (lastShown && now - lastShown < DUPLICATE_THRESHOLD_MS) {
    return true;
  }

  recentToasts.set(message, now);

  // Clean up old entries
  if (recentToasts.size > 50) {
    const entries = Array.from(recentToasts.entries());
    entries.sort((a, b) => a[1] - b[1]);
    recentToasts.delete(entries[0][0]);
  }

  return false;
}

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  preventDuplicate?: boolean;
}

/**
 * Centralized toast service with consistent behavior
 */
export const toastService = {
  /**
   * Show a success toast
   */
  success(message: string, options?: ToastOptions) {
    const { description, duration = 4000, action } = options || {};

    toast.success(message, {
      description,
      duration,
      action,
    });
  },

  /**
   * Show an error toast with duplicate prevention
   */
  error(message: string, options?: ToastOptions) {
    const {
      description,
      duration = 5000,
      action,
      preventDuplicate = true,
    } = options || {};

    // Prevent duplicate error toasts by default
    if (preventDuplicate && isDuplicate(message)) {
      return;
    }

    sonnerToast.error(message, {
      description,
      duration,
      action,
    });
  },

  /**
   * Show a warning toast
   */
  warning(message: string, options?: ToastOptions) {
    const { description, duration = 4000, action } = options || {};

    sonnerToast.warning(message, {
      description,
      duration,
      action,
    });
  },

  /**
   * Show an info toast
   */
  info(message: string, options?: ToastOptions) {
    const { description, duration = 4000, action } = options || {};

    sonnerToast.info(message, {
      description,
      duration,
      action,
    });
  },

  /**
   * Show a loading toast
   */
  loading(message: string, options?: Omit<ToastOptions, "duration">) {
    const { description, action } = options || {};

    return sonnerToast.loading(message, {
      description,
      action,
    });
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss(toastId?: string | number) {
    sonnerToast.dismiss(toastId);
  },

  /**
   * Promise-based toast for async operations
   */
  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
  ) {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Re-export the original toast for backward compatibility
// This allows gradual migration without breaking existing code
export { toast } from "@workspace/ui/components/sonner";
