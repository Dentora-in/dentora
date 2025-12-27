"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getItem } from "@/lib/localStorage";
import { UserRole } from "@dentora/database";
import { SIDEBAR_CONFIG } from "@/lib/sidebar-config";
import { toastService } from "@/lib/toast";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const role = getItem<UserRole>("role");

    if (!role) {
      toastService.error("User role not found");
      return;
    }

    const defaultRoute = SIDEBAR_CONFIG[role]?.items?.[0]?.url;

    if (!defaultRoute) {
      toastService.error("No default route configured");
      return;
    }

    router.replace(defaultRoute);
  }, [router]);

  return null;
}
