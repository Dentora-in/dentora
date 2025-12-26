"use client";

import * as React from "react";
import { IconDatabase, IconReport } from "@tabler/icons-react";

import { NavDocuments } from "@/app/dashboard/components/nav-documents";
import { NavMain } from "@/app/dashboard/components/nav-main";
import { NavUser } from "@/app/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";

const data = {
  documents: [
    {
      name: "Appointments",
      url: "/dashboard/appointments",
      icon: IconDatabase,
    },
    {
      name: "My Space",
      url: "/dashboard/my-space",
      icon: IconReport,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="text-xl">DENTORA</SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
