"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "@/components/child/theme-toggler";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { UserRole } from "@dentora/database";
import { SIDEBAR_CONFIG } from "@/lib/sidebar-config";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/appointments": "Appointments",
  "/dashboard/my-space": "My Space",
  "/dashboard/my-account": "My Profile",
};

export function DashboardHeader({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const sidebarConfig = SIDEBAR_CONFIG[role];
  const title =
    sidebarConfig.items.find((item) => item.url === pathname)?.name ??
    "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
