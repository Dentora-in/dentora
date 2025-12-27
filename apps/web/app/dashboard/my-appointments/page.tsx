// this page is for the patients - PatientAppoitments
"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Video,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
  Moon,
  Sun,
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
    appointmentDate: "2025-01-20T14:30:00Z",
    status: "PENDING",
    verified: false,
    notes: "Consultation for persistent knee pain.",
    doctor: {
      firstName: "Michael",
      lastName: "Chen",
      specialization: "Orthopedic Surgeon",
    },
    slot: {
      startTime: "2025-01-20T14:30:00Z",
      endTime: "2025-01-20T15:00:00Z",
    },
  },
  {
    id: "3",
    appointmentDate: "2024-12-10T09:00:00Z",
    status: "COMPLETED",
    verified: true,
    doctor: {
      firstName: "Emily",
      lastName: "Davis",
      specialization: "Dermatologist",
    },
    slot: {
      startTime: "2024-12-10T09:00:00Z",
      endTime: "2024-12-10T09:15:00Z",
    },
  },
  {
    id: "4",
    appointmentDate: "2024-11-05T11:00:00Z",
    status: "CANCELLED",
    verified: false,
    doctor: {
      firstName: "James",
      lastName: "Wilson",
      specialization: "General Practitioner",
    },
    slot: {
      startTime: "2024-11-05T11:00:00Z",
      endTime: "2024-11-05T11:30:00Z",
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
    <Card className="w-full mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex gap-4 mt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex md:flex-col items-start md:items-end gap-2 shrink-0">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-32" />
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
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false);

  const dateStr = format(new Date(appointment.appointmentDate), "PPP");
  const timeRange = appointment.slot
    ? `${format(new Date(appointment.slot.startTime), "p")} - ${format(new Date(appointment.slot.endTime), "p")}`
    : "Time not set";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="hover:shadow-md transition-all duration-200 group overflow-hidden border-l-4 border-l-primary/10 hover:border-l-primary/60 dark:bg-card/50">
        <CardContent className="px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Left Section: Info */}
            <div className="flex-1 space-y-1 w-full">
              <div className="flex items-center justify-between md:justify-start gap-2">
                <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                  Dr. {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName}
                </h3>
                {appointment.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 h-5 px-1.5 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shrink-0"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      Verified
                    </span>
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {appointment.doctor.specialization}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3">
                <div className="flex items-center text-xs md:text-sm text-muted-foreground bg-secondary/60 dark:bg-secondary/20 px-2 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-primary/70" />
                  {dateStr}
                </div>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground bg-secondary/60 dark:bg-secondary/20 px-2 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 mr-2 text-primary/70" />
                  {timeRange}
                </div>
              </div>
            </div>

            {/* Right Section: Badges & Actions */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
              <div className="flex flex-wrap gap-2 justify-end">
                {appointment.meetLink && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                    <Video className="w-3 h-3 mr-1" /> Online
                  </Badge>
                )}
                <StatusBadge status={appointment.status} />
              </div>

              <div className="flex items-center gap-2">
                {appointment.meetLink && appointment.status === "CONFIRMED" && (
                  <Button
                    size="sm"
                    className="hidden sm:flex bg-primary hover:bg-primary/90 shadow-sm"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meet
                  </Button>
                )}

                <Dialog
                  open={showDetailsDialog}
                  onOpenChange={setShowDetailsDialog}
                >
                  <DialogContent className="sm:max-w-[425px] gap-0 p-0 overflow-hidden border-none shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <DialogHeader className="p-6 pb-4 bg-primary/5 dark:bg-primary/10">
                      <DialogTitle className="text-xl">
                        Appointment Details
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground/80">
                        Detailed summary of your scheduled visit.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 p-6">
                      {/* Patient Mock Info */}
                      <div className="grid grid-cols-3 gap-4 border-b pb-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            Patient
                          </p>
                          <p className="text-sm font-medium">John Doe</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            Age
                          </p>
                          <p className="text-sm font-medium">32 Years</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            Gender
                          </p>
                          <p className="text-sm font-medium">Male</p>
                        </div>
                      </div>

                      {/* Doctor & Timing */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                            <span className="font-bold text-lg">
                              {appointment.doctor.firstName[0]}
                              {appointment.doctor.lastName[0]}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-base">
                              Dr. {appointment.doctor.firstName}{" "}
                              {appointment.doctor.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium">
                              {appointment.doctor.specialization}
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/40 dark:bg-muted/20 rounded-xl p-4 space-y-4 border border-border/50">
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <div className="p-1.5 rounded-md bg-background shadow-sm">
                              <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <span>{dateStr}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <div className="p-1.5 rounded-md bg-background shadow-sm">
                              <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <span>{timeRange}</span>
                          </div>
                          {appointment.meetLink && (
                            <div className="flex items-center gap-3 text-sm font-medium">
                              <div className="p-1.5 rounded-md bg-background shadow-sm">
                                <Video className="w-4 h-4 text-primary" />
                              </div>
                              <a
                                href={appointment.meetLink}
                                className="text-primary hover:underline font-medium break-all"
                              >
                                {appointment.meetLink}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status & Verification */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            Status
                          </p>
                          <StatusBadge status={appointment.status} />
                        </div>
                        {appointment.verified && (
                          <div className="text-right space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                              Verification
                            </p>
                            <div className="flex items-center text-green-600 text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            Notes
                          </p>
                          <div className="text-sm bg-muted/60 dark:bg-muted/30 p-4 rounded-xl italic border-l-4 border-primary/30 text-foreground/90">
                            "{appointment.notes}"
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="p-2 bg-muted/20 dark:bg-muted/10 border-t border-border/50 flex flex-col-reverse sm:flex-row gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowDetailsDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Close
                      </Button>
                      {appointment.meetLink &&
                        appointment.status === "CONFIRMED" && (
                          <Button className="w-full sm:w-auto shadow-md">
                            Join Meeting
                          </Button>
                        )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {isUpcoming && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Manage</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setShowDetailsDialog(true)}
                      >
                        View Full Details
                      </DropdownMenuItem>
                      {appointment.meetLink &&
                        appointment.status === "CONFIRMED" && (
                          <DropdownMenuItem>Copy Meet Link</DropdownMenuItem>
                        )}
                      <DropdownMenuSeparator />
                      <Dialog
                        open={showCancelDialog}
                        onOpenChange={setShowCancelDialog}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Appointment?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel your appointment
                              with Dr. {appointment.doctor.lastName}? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                              variant="ghost"
                              onClick={() => setShowCancelDialog(false)}
                            >
                              Keep Appointment
                            </Button>
                            <Button variant="destructive">
                              Confirm Cancellation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-xl bg-muted/20 animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground">
        No appointments found
      </h3>
      <p className="text-muted-foreground text-center max-w-[280px] mt-2">
        Your upcoming appointments will appear here once they are scheduled.
      </p>
      <Button className="mt-6 bg-transparent" variant="outline">
        Schedule Appointment
      </Button>
    </div>
  );
}

// --- Main Component ---

export default function PatientAppointments() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const upcomingAppointments = MOCK_APPOINTMENTS.filter(
    (app) => app.status === "PENDING" || app.status === "CONFIRMED",
  );
  const pastAppointments = MOCK_APPOINTMENTS.filter(
    (app) => app.status === "COMPLETED" || app.status === "CANCELLED",
  );

  return (
    <div className="w-full mx-auto p-4 md:p-8 space-y-4 min-h-screen">
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex w-full justify-between items-center mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[600px]">
            <TabsTrigger value="upcoming" className="text-sm font-semibold">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="text-sm font-semibold">
              Past
            </TabsTrigger>
          </TabsList>
          <Button
            className="hidden md:flex shadow-sm"
            variant="default"
            onClick={() => router.push("/appointment")}
          >
            Schedule New
          </Button>
        </div>

        <TabsContent
          value="upcoming"
          className="grid md:grid-cols-2 gap-4 space-y-4 outline-none"
        >
          {loading ? (
            <>
              <AppointmentCardSkeleton />
              <AppointmentCardSkeleton />
            </>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                isUpcoming={true}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent
          value="past"
          className="grid md:grid-cols-2 space-y-4 outline-none"
        >
          {loading ? (
            <>
              <AppointmentCardSkeleton />
              <AppointmentCardSkeleton />
            </>
          ) : pastAppointments.length > 0 ? (
            pastAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                isUpcoming={false}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
