"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";

import { NavDocuments } from "@/app/dashboard/components/nav-documents";
import { NavMain } from "@/app/dashboard/components/nav-main";
import { NavUser } from "@/app/dashboard/components/nav-user";

import { getItem } from "@/lib/localStorage";
import { useEffect, useState } from "react";
import { toastService } from "@/lib/toast";
import { UserRole } from "@dentora/database";
import { SIDEBAR_CONFIG } from "@/lib/sidebar-config";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const role = getItem<UserRole>("role");
    if (!role) {
      toastService.error("User role not found");
      return;
    }
    setRole(role);
  }, []);

  if (!role) return null;

  const config = SIDEBAR_CONFIG[role];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="text-xl">DENTORA</SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavDocuments label={config.label} items={config.items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
