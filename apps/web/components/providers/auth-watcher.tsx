"use client";

import { useEffect } from "react";
import { toast } from "@workspace/ui/components/sonner";
import { getSession } from "@dentora/auth/client";

export default function AuthWatcher() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromGoogle = params.get("google_oauth");

    if (!fromGoogle) return;

    getSession().then((session: any) => {
      if (session?.data?.user) {
        toast.success("Successfully signed in with Google!");

        const url = new URL(window.location.href);
        url.searchParams.delete("google_oauth");
        window.history.replaceState({}, "", url.toString());
      }
    });
  }, []);

  return null;
}
