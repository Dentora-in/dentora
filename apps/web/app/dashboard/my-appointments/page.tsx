"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  Calendar,
  Clock,
  Video,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { GenericAlertDialog } from "@/components/child/alert-dialog";

// --- Mock Data Types ---
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Appointment {
  id: string;
  appointmentDate: string;
  status: AppointmentStatus;
  verified: boolean;
  meetLink?: string;
  notes?: string;
  doctor: {
    firstName: string;
    lastName: string;
    specialization?: string;
  };
  slot?: {
    startTime: string;
    endTime: string;
  };
}

// --- Mock Data ---
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    appointmentDate: "2025-01-15T10:00:00Z",
    status: "CONFIRMED",
    verified: true,
    meetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Regular check-up following last month's blood test.",
    doctor: {
      firstName: "Sarah",
      lastName: "Johnson",
      specialization: "Cardiologist",
    },
    slot: {
      startTime: "2025-01-15T10:00:00Z",
      endTime: "2025-01-15T10:30:00Z",
    },
  },
  {
    id: "2",
    appointmentDate: "2025-01-20T14:00:00Z",
    status: "PENDING",
    verified: false,
    doctor: {
      firstName: "Emily",
      lastName: "Davis",
      specialization: "Dermatologist",
    },
    slot: {
      startTime: "2025-01-20T14:00:00Z",
      endTime: "2025-01-20T14:30:00Z",
    },
  },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const variants: Record<
    AppointmentStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    PENDING: {
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: <Clock3 className="w-3 h-3 mr-1" />,
    },
    CONFIRMED: {
      label: "Confirmed",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
    },
  };

  const config = variants[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

function AppointmentCardSkeleton() {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-4 mt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentCard({
  appointment,
  isUpcoming,
}: {
  appointment: Appointment;
  isUpcoming: boolean;
}) {
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false);

  const dateStr = format(new Date(appointment.appointmentDate), "PPP");
  const timeRange = appointment.slot
    ? `${format(new Date(appointment.slot.startTime), "p")} - ${format(new Date(appointment.slot.endTime), "p")}`
    : "Time not set";

  return (
    <div className="group h-full">
      <Card className="py-0 h-full hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-l-primary/10 hover:border-l-primary dark:bg-card/50">
        <CardContent className="p-4 sm:p-5 flex flex-col h-full justify-between gap-4">
          {/* --- Card Main Content --- */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Dr. {appointment.doctor.firstName}{" "}
                    {appointment.doctor.lastName}
                  </h3>
                  {appointment.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {appointment.doctor.specialization}
                </p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center bg-secondary/50 px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
                {dateStr}
              </div>
              <div className="flex items-center bg-secondary/50 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 mr-2 text-primary" />
                {timeRange}
              </div>
            </div>
          </div>

          {/* --- Bottom Actions --- */}
          <div className="pt-4 mt-auto border-t border-border/40 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {appointment.meetLink && appointment.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs cursor-pointer"
                >
                  <Video className="w-3 h-3 mr-2" />
                  Join
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs cursor-pointer"
                onClick={() => setShowDetailsDialog(true)}
              >
                Details
              </Button>
            </div>

            {isUpcoming && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <GenericAlertDialog
                    actionButtonColor="destructive"
                    trigger={
                      <Button className="cursor-pointer" variant="destructive">
                        Cancel Appointment
                      </Button>
                    }
                    title="Cancel this appointment?"
                    description="Are you sure you want to cancel?"
                    confirmText="Yes"
                    cancelText="No"
                    onResult={(confirmed) => {
                      if (confirmed) {
                        // cancelAppointmentHandler();
                      }
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Responsive Details Dialog --- */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent
          className="
            w-[90vw] max-w-[360px] 
            md:w-full md:max-w-[500px] 
            gap-0 p-0 overflow-hidden border-none shadow-2xl 
            rounded-xl bg-background
          "
        >
          {/* Header */}
          <DialogHeader className="p-4 pb-2 md:p-6 md:pb-4 bg-primary/5 dark:bg-primary/10 shrink-0">
            <DialogTitle className="text-base md:text-xl">
              Appointment Details
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-muted-foreground/80">
              Detailed summary of your scheduled visit.
            </DialogDescription>
          </DialogHeader>

          {/* Body: Compact on Mobile, Spacious on Desktop */}
          <div className="grid gap-3 p-4 md:gap-6 md:p-6">
            {/* Patient Info */}
            <div className="flex justify-between md:grid md:grid-cols-3 md:gap-4 items-end border-b pb-3 md:pb-4">
              <div>
                <p className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground tracking-widest">
                  Patient
                </p>
                <p className="text-sm md:text-base font-semibold truncate">
                  John Doe
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground tracking-widest">
                  Age
                </p>
                <p className="text-sm md:text-base font-medium">32 Years</p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground tracking-widest">
                  Gender
                </p>
                <p className="text-sm md:text-base font-medium">Male</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-3 md:gap-4 py-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="font-bold text-base md:text-lg">
                  {appointment.doctor.firstName[0]}
                  {appointment.doctor.lastName[0]}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-sm md:text-base">
                  Dr. {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {appointment.doctor.specialization}
                </p>
              </div>
            </div>

            {/* Date & Time Box */}
            <div className="bg-muted/40 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 border border-border/50">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium">
                <div className="p-1 rounded bg-background shadow-sm">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium">
                <div className="p-1 rounded bg-background shadow-sm">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
                <span>{timeRange}</span>
              </div>
              {appointment.meetLink && (
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium pt-1 md:pt-0">
                  <div className="p-1 rounded bg-background shadow-sm shrink-0">
                    <Video className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  </div>
                  <a
                    href={appointment.meetLink}
                    className="text-primary hover:underline truncate"
                  >
                    {appointment.meetLink}
                  </a>
                </div>
              )}
            </div>

            {/* Status Row */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="hidden md:block text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  Current Status
                </p>
                <StatusBadge status={appointment.status} />
              </div>
              {appointment.verified && (
                <div className="flex flex-col md:items-end">
                  <p className="hidden md:block text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    Verification
                  </p>
                  <div className="flex items-center text-green-600 text-xs md:text-sm font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />{" "}
                    Verified
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="text-xs md:text-sm bg-muted/60 p-3 md:p-4 rounded-md italic text-muted-foreground border-l-2 md:border-l-4 border-primary/30">
                "{appointment.notes}"
              </div>
            )}
          </div>

          {/* Footer - Always shows Close */}
          <DialogFooter className="p-3 md:p-6 bg-muted/20 border-t border-border/50 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowDetailsDialog(false)}
              className="w-full sm:w-auto h-9 md:h-10 text-sm order-2 sm:order-1"
            >
              Close
            </Button>
            {appointment.meetLink && appointment.status === "CONFIRMED" && (
              <Button className="w-full sm:w-auto h-9 md:h-10 text-sm shadow-sm order-1 sm:order-2">
                Join Meeting
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Empty State (No Animation) ---
function EmptyState({ type }: { type: "upcoming" | "past" }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] text-center p-8">
      <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-muted/10">
        {type === "upcoming" ? (
          <Calendar className="w-10 h-10 text-muted-foreground/60" />
        ) : (
          <Clock className="w-10 h-10 text-muted-foreground/60" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">
        No {type} appointments
      </h3>
      <p className="text-muted-foreground max-w-[300px] mb-8">
        {type === "upcoming"
          ? "You don't have any scheduled visits at the moment."
          : "You haven't completed any appointments yet."}
      </p>
      {type === "upcoming" && (
        <Button className="shadow-lg">Schedule Now</Button>
      )}
    </div>
  );
}

// --- Main Component ---

export default function PatientAppointments() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const upcomingAppointments = useMemo(
    () =>
      MOCK_APPOINTMENTS.filter(
        (app) => app.status === "PENDING" || app.status === "CONFIRMED",
      ),
    [],
  );

  const pastAppointments = useMemo(
    () =>
      MOCK_APPOINTMENTS.filter(
        (app) => app.status === "COMPLETED" || app.status === "CANCELLED",
      ),
    [],
  );

  const renderContent = (list: Appointment[], type: "upcoming" | "past") => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <EmptyState type={type} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        {list.map((app) => (
          <AppointmentCard
            key={app.id}
            appointment={app}
            isUpcoming={type === "upcoming"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 space-y-6">
      <Tabs defaultValue="upcoming" className="w-full flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-muted-foreground text-sm">
              Manage your visits and history.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <TabsList className="grid w-full sm:w-[250px] grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <Button
              className="w-full sm:w-auto shadow-sm"
              onClick={() => router.push("/appointment")}
            >
              Schedule New
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[400px]">
          <TabsContent
            value="upcoming"
            className="mt-0 h-full focus-visible:ring-0"
          >
            {renderContent(upcomingAppointments, "upcoming")}
          </TabsContent>

          <TabsContent
            value="past"
            className="mt-0 h-full focus-visible:ring-0"
          >
            {renderContent(pastAppointments, "past")}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
