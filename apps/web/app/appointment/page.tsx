"use client";
import { Appointment } from "@/components/child/appointment-form";

export default function AppointmentPage() {
  const handleAppointmentSubmit = (data: any) => {
    console.log("Appointment booked:", data);
  };

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <div className="w-full flex justify-center md:hidden h-40">
        <img
          src="https://www.shutterstock.com/image-photo/book-your-appointment-text-on-600nw-2400843205.jpg"
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Appointment onSubmit={handleAppointmentSubmit} />
      </div>
    </div>
  );
}
