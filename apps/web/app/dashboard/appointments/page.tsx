"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/dashboard/components/data-table";
import { getAllAppointments } from "@/api/api.appointment";
import { FullPageSpinnerSub } from "@/components/child/page-spinner";

interface metaData {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  total_pending: number;
  total_confirmed: number;
  total_completed: number;
  total_cancelled: number;
}

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState();
  const [metaData, setMetaData] = useState<metaData>();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);

      const res = await getAllAppointments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status
      });

      setAppointments(res.appointments);
      setMetaData(res.meta_data);
      setIsLoading(false);
    }

    fetch();
  }, [pagination.pageIndex, pagination.pageSize, status]);

  if (isLoading || !metaData) {
    return <FullPageSpinnerSub />;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable
        data={appointments}
        metaData={metaData}
        pagination={pagination}
        setPagination={setPagination}
        setStatus={setStatus}
        currentStatus={status || "outline"}
      />
    </div>
  );
}