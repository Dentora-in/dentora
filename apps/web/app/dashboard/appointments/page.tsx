"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/dashboard/components/data-table";
import { getAllAppointments } from "@/api/api.appointment";
import { FullPageSpinner } from "@/components/child/full-page-spinner";

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable data={appointments} />
    </div>
  );
}

