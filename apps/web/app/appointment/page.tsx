
"use client";

import { Appointment } from "@/components/child/appointment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export default function AppointmentPage() {

  const handleAppointmentSubmit = (data: any) => {
    console.log("Appointment booked:", data);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-background px-4 py-3 md:justify-center relative">

      {/* Background dental faint pattern */}
      <div className="absolute inset-0 bg-[url('/dentora-bg.svg')] opacity-[0.08] pointer-events-none bg-cover bg-center" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-lg md:max-w-5xl">

        <Card className={cn(
          "backdrop-blur-xl bg-white/40 dark:bg-neutral-900/40 shadow-xl rounded-3xl border border-white/10 dark:border-neutral-700/20"
        )}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              {/* Dental SVG Icon */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-blue-600 dark:text-blue-400"
              >
                <path
                  d="M12 2C9 2 7 4 7 7c0 3-1 5-2 6 0 4 2 8 4 8 2 0 2-3 3-6 1 3 1 6 3 6 2 0 4-4 4-8-1-1-2-3-2-6 0-3-2-5-5-5z"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Book Your Appointment
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Schedule your dental consultation in minutes
            </p>
          </CardHeader>

          <CardContent>
            <Appointment onSubmit={handleAppointmentSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}