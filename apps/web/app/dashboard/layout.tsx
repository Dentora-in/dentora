import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@dentora/auth/auth";
import { DashboardLayoutClient } from "./dashboard-layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient session={session}>{children}</DashboardLayoutClient>
  );
}
