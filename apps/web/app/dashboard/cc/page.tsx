// this page is for the Doctors
"use client";

import { Suspense, useEffect, useState } from "react";
import { DataTable } from "@/app/dashboard/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { FullPageSpinnerSub } from "@/components/child/page-spinner";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  getControlCenterData,
  updateControlCenterData,
} from "@/api/dashboard/api.admin";
import { UserRole } from "@dentora/database";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { toastService } from "@/lib/toast";

// TODO: need to move this to interface file and export from there
interface metaData {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  total_users: number;
  total_doctors: number;
  total_patients: number;
  total_admins: number;
}

interface Appointment {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminControlCenterPage() {
  return (
    <Suspense fallback={null}>
      <AdminControlCenter />
    </Suspense>
  );
}

function AdminControlCenter() {
  const [isLoading, setIsLoading] = useState(true);
  const [controlCenterData, setControlCenterData] = useState<
    Appointment[] | undefined
  >();
  const [metaData, setMetaData] = useState<metaData | undefined>();
  const [role, setRole] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.getValue("image") as string | null;
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center justify-center">
            <Avatar>
              <AvatarImage src={image || undefined} alt={name} />
              <AvatarFallback>{name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
    },
  ];

  const tabs = [
    {
      value: "outline",
      label: "ALL",
      badgeCount:
        (metaData?.total_doctors || 0) +
        (metaData?.total_patients || 0) +
        (metaData?.total_admins || 0),
    },
    {
      value: UserRole.DOCTOR,
      label: "DOCTORS",
      badgeCount: metaData?.total_doctors ?? 0,
    },
    {
      value: UserRole.PATIENT,
      label: "PATIENTS",
      badgeCount: metaData?.total_patients ?? 0,
    },
    {
      value: UserRole.ADMIN,
      label: "ADMINS",
      badgeCount: metaData?.total_admins ?? 0,
    },
  ];

  const dropdownItems = ["PATIENT", "DOCTOR", "ADMIN"].map((v) => ({
    value: v,
    label: v,
  }));

  const handleBulkUpdate = async (ids: string[], role: string) => {
    if (!ids || ids.length === 0) {
      toastService.error("Please select at least one user.");
      return;
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      toastService.error("Invalid role selected.");
      return;
    }

    try {
      const res = await updateControlCenterData(ids, role as UserRole);

      if (!res || !res.success) {
        toastService.error("Failed to update users.");
        return;
      }

      setControlCenterData((prev) => {
        if (!prev) return prev;

        const idSet = new Set(ids);

        return prev.map((user) =>
          idSet.has(user.id) ? { ...user, role: role as UserRole } : user,
        );
      });

      toastService.success(`Updated ${ids.length} user(s) successfully.`);

      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while updating users.";

      toastService.error(message);
      throw err;
    }
  };

  // TODO: implement delete appointment API @anmol - handle edge case and error handling
  const handleDelete = async (ids: string[]) => {
    console.log(ids);
  };

  const handleRowsUpdated = (updatedRows: Appointment[], newStatus: string) => {
    setControlCenterData((prev) => {
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
        total_doctors:
          prev.total_doctors -
          updatedRows.filter((r) => r.role === UserRole.DOCTOR).length,
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

      const res = await getControlCenterData({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        role,
      });

      setControlCenterData(res.users);
      setMetaData(res.meta_data);
      setIsLoading(false);
    }

    fetch();
  }, [pagination.pageIndex, pagination.pageSize, role]);

  if (isLoading || !metaData) {
    return <FullPageSpinnerSub />;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable
        data={controlCenterData}
        columns={columns}
        meta={metaData}
        pageCount={metaData?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        tabs={tabs}
        dropdownItems={dropdownItems}
        currentTab={role || "outline"}
        onTabChange={(s) => setRole(s === "outline" ? undefined : s)}
        onBulkAction={handleBulkUpdate}
        onDelete={handleDelete}
        onRowsUpdated={handleRowsUpdated}
        rowId={(r) => r.id}
        statusKey="role"
      />
    </div>
  );
}
