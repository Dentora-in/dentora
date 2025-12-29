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
  Trash2,
  Info,
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
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { GenericAlertDialog } from "@/components/child/alert-dialog";
import {
  editPatientAppointment,
  getAllPatientAppointment,
} from "@/api/dashboard/api.patient";
import { toastService } from "@/lib/toast";

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
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-[10px] px-2 py-0.5 h-5",
        config.className,
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function AppointmentCardSkeleton() {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-4">
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
  onAppointmentChange,
}: {
  appointment: Appointment;
  isUpcoming: boolean;
  onAppointmentChange: (updatedApp: Appointment) => void;
}) {
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  const dateStr = format(new Date(appointment.appointmentDate), "PPP");
  const timeRange = appointment.slot
    ? `${format(new Date(appointment.slot.startTime), "p")} - ${format(new Date(appointment.slot.endTime), "p")}`
    : "Time not set";

  const cancelAppointmentHandler = async (id: string) => {
    setIsCancelling(true);
    try {
      const response = await editPatientAppointment(id);
      if (response && response.success) {
        toastService.success("Appointment cancelled successfully");
        onAppointmentChange(response.appointment || response.data);
      } else {
        toastService.error(response.message || "Failed to cancel");
      }
    } catch (e: any) {
      toastService.error(e.message || "Error cancelling appointment");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="group h-full">
      {/* Click handler on Card opens details */}
      <Card
        className="py-0 h-full hover:shadow-md transition-all duration-200 overflow-hidden dark:bg-card/50 cursor-pointer"
        onClick={() => setShowDetailsDialog(true)}
      >
        <CardContent className="p-3 sm:p-4 flex flex-col h-full justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Dr. {appointment.doctor.firstName}{" "}
                    {appointment.doctor.lastName}
                  </h3>
                  {appointment.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {appointment.doctor.specialization}
                </p>
                <div className="flex items-center text-xs text-muted-foreground/80 mt-1 gap-2">
                  <Calendar className="w-3 h-3" /> {dateStr}
                </div>
              </div>

              <div className="flex justify-end items-end space-y-1 flex-col gap-2">
                <StatusBadge status={appointment.status} />

                {isUpcoming && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDetailsDialog(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            <span>Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                          <GenericAlertDialog
                            actionButtonColor="destructive"
                            title="Cancel this appointment?"
                            description="Are you sure you want to cancel? This action cannot be undone."
                            confirmText="Yes, Cancel"
                            cancelText="No"
                            onResult={(confirmed) => {
                              if (confirmed) {
                                cancelAppointmentHandler(appointment.id);
                              }
                            }}
                            trigger={
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Cancel</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Responsive Details Dialog --- */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[90vw] max-w-[400px] gap-0 p-0 overflow-hidden border-none shadow-2xl rounded-xl bg-background">
          {/* Header */}
          <DialogHeader className="p-4 bg-primary/5 dark:bg-primary/10 shrink-0">
            <DialogTitle className="text-lg">Appointment Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground/80">
              Detailed summary of your scheduled visit.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="grid gap-4 p-5">
            {/* Doctor Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="font-bold text-lg">
                  {appointment.doctor.firstName[0]}
                  {appointment.doctor.lastName[0]}
                </span>
              </div>
              <div>
                <p className="font-bold text-base">
                  Dr. {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.doctor.specialization}
                </p>
              </div>
            </div>

            {/* Date & Time Box */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <Clock className="w-4 h-4 text-primary" />
                <span>{timeRange}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Status
              </span>
              <StatusBadge status={appointment.status} />
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="text-xs bg-muted/60 p-3 rounded-md italic text-muted-foreground">
                "{appointment.notes}"
              </div>
            )}
          </div>

          {/* Footer with Right Aligned Buttons */}
          <DialogFooter className="p-4 bg-muted/20 border-t border-border/50 flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>

            {appointment.meetLink && appointment.status === "CONFIRMED" && (
              <Button asChild>
                <a href={appointment.meetLink} target="_blank" rel="noreferrer">
                  <Video className="w-4 h-4 mr-2" />
                  Join Meeting
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Empty State ---
function EmptyState({ type }: { type: "upcoming" | "past" }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[40vh] text-center p-8">
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-muted/10">
        {type === "upcoming" ? (
          <Calendar className="w-8 h-8 text-muted-foreground/60" />
        ) : (
          <Clock className="w-8 h-8 text-muted-foreground/60" />
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        No {type} appointments
      </h3>
      <p className="text-sm text-muted-foreground max-w-[300px] mb-6">
        {type === "upcoming"
          ? "You don't have any scheduled visits at the moment."
          : "You haven't completed any appointments yet."}
      </p>
      {type === "upcoming" && (
        <Button className="shadow-sm">Schedule Now</Button>
      )}
    </div>
  );
}

// --- Main Component ---

export default function PatientAppointments() {
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming");
  const router = useRouter();

  // Handler to update a single appointment in the state without refreshing
  const handleAppointmentUpdate = (updatedApp: Appointment) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app)),
    );
  };

  React.useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await getAllPatientAppointment(tab);

        if (!response || response.success === false) {
          throw new Error(response?.message || "Failed to fetch");
        }

        if (isMounted) {
          setAppointments(response.appointments ?? []);
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
        toastService.error(error?.message || "Error fetching appointments");
        if (isMounted) setAppointments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();
    return () => {
      isMounted = false;
    };
  }, [tab]);

  const renderContent = (list: Appointment[], type: "upcoming" | "past") => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
        {list.map((app) => (
          <AppointmentCard
            key={app.id}
            appointment={app}
            isUpcoming={type === "upcoming"}
            onAppointmentChange={handleAppointmentUpdate}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-6">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "upcoming" | "past")}
        defaultValue="upcoming"
        className="w-full flex flex-col h-full"
      >
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <p className="text-muted-foreground text-sm">
              Manage your visits and history.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <TabsList className="grid w-full sm:w-[200px] grid-cols-2">
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
            {renderContent(appointments, "upcoming")}
          </TabsContent>
          <TabsContent
            value="past"
            className="mt-0 h-full focus-visible:ring-0"
          >
            {renderContent(appointments, "past")}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
