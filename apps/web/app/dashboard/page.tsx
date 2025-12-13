"use client";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { DataTable } from "@/app/dashboard/components/data-table";
import { SiteHeader } from "@/app/dashboard/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

import { useEffect, useState } from "react";
import { getAllAppointments } from "@/api/api.appointment";
import { FullPageSpinner } from "@/components/child/full-page-spinner";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  const [activePage, setActivePage] = useState<"appointments" | "mySpace">(
    "appointments"
  );
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      const data = await getAllAppointments();
      console.log("Fetched appointments:", data);
      setAppointments(data.appointments);
      setIsLoading(false);
    }
    fetch();
  }, []);

  console.log(appointments);
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        onSelectPage={setActivePage}
        variant="inset"
        className="!top-14 !h-[calc(100svh-3.5rem)] z-40"
      />

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable data={appointments} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
