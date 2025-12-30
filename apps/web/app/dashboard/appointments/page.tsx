// this page is for the Doctors
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/dashboard/components/data-table";
import { getAllAppointments, updateAppointments } from "@/api/api.appointment";
import type { ColumnDef } from "@tanstack/react-table";
import { FullPageSpinnerSub } from "@/components/child/page-spinner";
import { Checkbox } from "@workspace/ui/components/checkbox";

// TODO: need to move this to interface file and export from there
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

// Status values are provided via `tabs` and `dropdownItems` below.

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[] | undefined>();
  const [metaData, setMetaData] = useState<metaData | undefined>();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Appointment type for table rows
  interface Appointment {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phoneCountry?: string | null;
    phoneNo: string;
    email: string;
    appointmentDate: string;
    notes?: string | null;
    meetLink?: string | null;
    doctorId: string;
    slotId?: string | null;
    paymentStatus?: string | null;
    paymentId?: string | null;
    verified: boolean;
    status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }

  const columns: ColumnDef<Appointment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    },
    {
      id: "fullName",
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "phoneNo",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "meetLink",
      header: "Meet Link",
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
    },
    {
      accessorKey: "appointmentDate",
      header: "Appointment Date",
      cell: ({ row }) =>
        new Date(row.original.appointmentDate).toLocaleString(),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  // TODO: fix
  const tabs = [
    {
      value: "outline",
      label: "ALL",
      badgeCount:
        (metaData?.total_pending || 0) +
        (metaData?.total_confirmed || 0) +
        (metaData?.total_cancelled || 0) +
        (metaData?.total_completed || 0),
    },
    { value: "PENDING", label: "PENDING", badgeCount: metaData?.total_pending },
    {
      value: "CONFIRMED",
      label: "CONFIRMED",
      badgeCount: metaData?.total_confirmed,
    },
    {
      value: "CANCELLED",
      label: "CANCELLED",
      badgeCount: metaData?.total_cancelled,
    },
    {
      value: "COMPLETED",
      label: "COMPLETED",
      badgeCount: metaData?.total_completed,
    },
  ];

  const dropdownItems = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map(
    (v) => ({ value: v, label: v }),
  );

  // TODO: handle edge case and error handling check the cc/page.tsx
  const handleBulkUpdate = async (ids: string[], newStatus: string) => {
    return updateAppointments(ids, newStatus);
  };

  // TODO: implement delete appointment API - handle edge case and error handling
  const handleDelete = async (ids: string[]) => {
    console.log("delete", ids);
  };

  const handleRowsUpdated = (updatedRows: Appointment[], newStatus: string) => {
    setAppointments((prev) => {
      if (!prev) return prev;

      const updatedMap = new Map(updatedRows.map((r) => [r.id, r]));

      const updated = prev.map((apt) =>
        updatedMap.has(apt.id) ? { ...apt, status: newStatus } : apt,
      );

      return updated;
    });

    setMetaData((prev) => {
      if (!prev) return prev;

      const countDelta = updatedRows.length;

      return {
        ...prev,
        total_pending:
          prev.total_pending -
          updatedRows.filter((r) => r.status === "PENDING").length,
        total_confirmed:
          prev.total_confirmed -
          updatedRows.filter((r) => r.status === "CONFIRMED").length,
        total_completed:
          prev.total_completed -
          updatedRows.filter((r) => r.status === "COMPLETED").length,
        total_cancelled:
          prev.total_cancelled -
          updatedRows.filter((r) => r.status === "CANCELLED").length,
        [getStatusCountKey(newStatus)]:
          prev[getStatusCountKey(newStatus) as keyof metaData] + countDelta,
      };
    });
  };

  const getStatusCountKey = (status: string): string => {
    return `total_${status.toLowerCase()}`;
  };

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);

      const res = await getAllAppointments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status,
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
        columns={columns}
        meta={metaData}
        pageCount={metaData?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        tabs={tabs}
        dropdownItems={dropdownItems}
        currentTab={status || "outline"}
        onTabChange={(s) => setStatus(s)}
        onBulkAction={handleBulkUpdate}
        onDelete={handleDelete}
        onRowsUpdated={handleRowsUpdated}
        rowId={(r) => r.id}
        statusKey="status"
        enableDrag={true}
      />
    </div>
  );
}
