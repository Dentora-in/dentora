"use client";

import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { SessionProvider } from "@/components/providers/session-provider";
import { DashboardHeader } from "@/components/layouts/dashboard-header";

export function DashboardLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" className="z-40" />

        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
