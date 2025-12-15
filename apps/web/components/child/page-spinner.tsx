"use client";

import { Spinner } from "@workspace/ui/components/spinner";

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-xs">
      <Spinner className="h-10 w-10" />
    </div>
  );
}

export function FullPageSpinnerSub({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading {title ? `your ${title}` : ""}...</p>
      </div>
    </div>
  );
}
