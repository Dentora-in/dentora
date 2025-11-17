"use client";
import { Appointment } from "@/components/child/appointment-form";

export default function AppointmentPage() {
  const handleAppointmentSubmit = (data: any) => {
    console.log('Appointment booked:', data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Appointment onSubmit={handleAppointmentSubmit} />
    </main>
  );
}
