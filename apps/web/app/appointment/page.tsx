"use client";

import { Appointment } from "@/components/child/appointment-form";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowBigLeftDash,
  CalendarIcon,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AppointmentPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSuccess) {
      if (!toastShown.current) {
        toast.success("Appointment Booked Successfully", {
          description: "Redirecting to homepage in 5 seconds...",
          duration: 5000,
        });
        toastShown.current = true;
      }

      timer = setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      toastShown.current = false;
    }

    return () => clearTimeout(timer);
  }, [isSuccess, router]);

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 animate-pulse" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Thank you!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Your appointment has been processed successfully.
          </p>
          <p className="mt-2 text-muted-foreground">
            You will get your appointment details sent to your email address.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            You will be redirected automatically in 5 seconds...
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/")}>
              <ArrowBigLeftDash />
              Go to Homepage Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-6 md:justify-center relative overflow-hidden">
      {/* Optional Background Pattern */}
      <div className="absolute inset-0 bg-[url('/dentora-bg.svg')] opacity-[0.08] pointer-events-none bg-cover bg-center" />

      <div className="relative z-10 w-full max-w-lg md:max-w-2xl">
        <Card
          className={cn(
            "backdrop-blur-xl bg-white/60 dark:bg-neutral-900/60 shadow-xl rounded-3xl border border-white/20 dark:border-neutral-700/30"
          )}
        >
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">
              Book Your Appointment
            </CardTitle>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Schedule your dental consultation in minutes. Please fill out the
              form below.
            </p>
          </CardHeader>

          <CardContent>
            <Appointment setIsSuccess={setIsSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
