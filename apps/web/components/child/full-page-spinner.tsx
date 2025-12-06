"use client";

import { Spinner } from "@workspace/ui/components/spinner";

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-xs">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
