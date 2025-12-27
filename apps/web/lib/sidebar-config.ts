import {
  IconDatabase,
  IconReport,
  IconDeviceDesktopCog,
} from "@tabler/icons-react";
import { UserRole } from "@dentora/database";
import type { Icon } from "@tabler/icons-react";

export type SideBarItem = {
  name: string;
  url: string;
  icon: Icon;
};

export type SideBarConfig = {
  label: string;
  items: SideBarItem[];
};

export const SIDEBAR_CONFIG: Record<UserRole, SideBarConfig> = {
  [UserRole.DOCTOR]: {
    label: "Doctor",
    items: [
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
  },
  [UserRole.ADMIN]: {
    label: "Admin",
    items: [
      {
        name: "Control Center",
        url: "/dashboard/cc",
        icon: IconDeviceDesktopCog,
      },
    ],
  },
  [UserRole.PATIENT]: {
    label: "Patient",
    items: [
      {
        name: "My Appointments",
        url: "/dashboard/my-appointments",
        icon: IconDatabase,
      },
    ],
  },
};
