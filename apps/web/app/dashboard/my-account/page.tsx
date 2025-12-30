import { auth } from "@dentora/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DoctorProfileView } from "@/components/dashboard/profile/doctor-view";
import { PatientProfileView } from "@/components/dashboard/profile/patient-view";
import { AdminProfileView } from "@/components/dashboard/profile/admin-view";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const role = user.role || "PATIENT";

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile settings and personal information.
        </p>
      </div>

      {role === "DOCTOR" && <DoctorProfileView />}
      {role === "ADMIN" && <AdminProfileView user={user} />}
      {(role === "PATIENT" || !role) && <PatientProfileView user={user} />}
    </div>
  );
}
