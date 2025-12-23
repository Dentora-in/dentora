"use client";

import { useEffect } from "react";
import { toastService } from "@/lib/toast";
import { getSession } from "@dentora/auth/client";
import { useRouter } from "next/navigation";

export default function AuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromGoogle = params.get("google_oauth");

    if (!fromGoogle) return;

    getSession().then((session: any) => {
      if (session?.data?.user) {
        toastService.success("Successfully signed in with Google!");

        const url = new URL(window.location.href);
        url.searchParams.delete("google_oauth");
        window.history.replaceState({}, "", url.toString());

        router.push("/dashboard");
      }
    });
  }, [router]);

  return null;
}
