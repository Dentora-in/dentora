"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CalendarDays,
  Zap,
} from "lucide-react";
import { toastService } from "@/lib/toast";
import {
  addDoctorAvailability,
  AvailabilityInterface,
  deleteDoctorAvailability,
  getMySpaceData,
} from "@/api/api.my-space";

// Types
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface DoctorSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface NewAvailability {
  dayOfWeek: DayOfWeek | null;
  startTime: string;
  endTime: string;
}

interface NewSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface AutoGenerateParams {
  startDate: string;
  endDate: string;
  slotDuration: number;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAYS_AVAILABLE = [1, 2, 3, 4, 5, 6, 7];
const SLOT_DURATIONS = [15, 30, 45, 60];

const isoToTime = (iso: string) => new Date(iso).toISOString().slice(11, 16);

export default function DoctorAvailabilityManager() {
  const [isLoading, setIsLoading] = useState(true);

  // Availability state
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>(
    [],
  );
  const [newAvailability, setNewAvailability] = useState<AvailabilityInterface>(
    {
      dayOfWeek: "Sunday",
      startTime: "",
      endTime: "",
    },
  );

  // Slots state
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [newSlot, setNewSlot] = useState<NewSlot>({
    date: "",
    startTime: "",
    endTime: "",
  });

  // Auto-generate state
  const [autoGenerate, setAutoGenerate] = useState<AutoGenerateParams>({
    startDate: "",
    endDate: "",
    slotDuration: 30,
  });
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<
    "all" | "available" | "booked"
  >("all");

  // Load data on mount (simulated)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getMySpaceData();
      if (response.success) {
        setAvailabilities(response.data.weeklyAvailability);
        // setSlots();
      }
    } catch (error) {
      toastService.error("Error", {
        description: "Failed to load data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Availability handlers
  const addAvailability = async () => {
    if (!newAvailability.startTime || !newAvailability.endTime) {
      toastService.warning("Please select start and end times");
      return;
    }

    if (newAvailability.startTime >= newAvailability.endTime) {
      toastService.warning("End time must be after start time");
      return;
    }

    try {
      const payload: AvailabilityInterface = {
        dayOfWeek: newAvailability.dayOfWeek!.toUpperCase(),
        startTime: newAvailability.startTime,
        endTime: newAvailability.endTime,
      };

      const response = await addDoctorAvailability(payload);
      const data = response.data;

      const availabilityToAdd: DoctorAvailability = {
        id: data.id,
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      };

      setAvailabilities((prev) => [...prev, availabilityToAdd]);

      setNewAvailability({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      });

      toastService.success("Availability added successfully");
    } catch (error) {
      toastService.error("Weekday already exists!!");
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const response = await deleteDoctorAvailability(id);
      const updatedAvailabilities = availabilities.filter((a) => a.id !== id);
      setAvailabilities(updatedAvailabilities);

      toastService.success("Availability deleted successfully");
    } catch (error) {
      toastService.error("Failed to delete availability");
    }
  };

  // Slot handlers
  const addSlot = async () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      toastService.warning("Please fill all slot details");
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toastService.warning("End time must be after start time");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const res = await fetch("/api/doctor/slots", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newSlot),
      // });

      const newData: DoctorSlot = {
        id: Date.now().toString(),
        doctorId: "doctor-1",
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isBooked: false,
      };

      const updatedSlots = [...slots, newData];
      setSlots(updatedSlots);
      localStorage.setItem("slots", JSON.stringify(updatedSlots));

      setNewSlot({ date: "", startTime: "", endTime: "" });
      toastService.success("Slot created successfully");
    } catch (error) {
      toastService.error("Failed to create slot");
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // const res = await fetch(`/api/doctor/slots/${id}`, {
      //   method: "DELETE",
      // });

      const updatedSlots = slots.filter((s) => s.id !== id);
      setSlots(updatedSlots);
      localStorage.setItem("slots", JSON.stringify(updatedSlots));

      toastService.success("Slot deleted successfully");
    } catch (error) {
      toastService.error("Failed to delete slot");
    }
  };

  const generateSlots = async () => {
    if (!autoGenerate.startDate || !autoGenerate.endDate) {
      toastService.warning("Please select date range");
      return;
    }

    if (autoGenerate.startDate > autoGenerate.endDate) {
      toastService.warning("End date must be after start date");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const res = await fetch("/api/doctor/slots/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(autoGenerate),
      // });

      // Generate slots from availabilities
      const generatedSlots: DoctorSlot[] = [];
      const start = new Date(autoGenerate.startDate);
      const end = new Date(autoGenerate.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay() as DayOfWeek;
        const dayAvailabilities = availabilities.filter(
          (a) => a.dayOfWeek === dayOfWeek,
        );

        dayAvailabilities.forEach((avail) => {
          const [startHour, startMin] = avail.startTime.split(":").map(Number);
          const [endHour, endMin] = avail.endTime.split(":").map(Number);

          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;

          for (
            let time = startMinutes;
            time < endMinutes;
            time += autoGenerate.slotDuration
          ) {
            const slotStartHour = Math.floor(time / 60);
            const slotStartMin = time % 60;
            const slotEndTime = time + autoGenerate.slotDuration;
            const slotEndHour = Math.floor(slotEndTime / 60);
            const slotEndMin = slotEndTime % 60;

            generatedSlots.push({
              id: `${d.toISOString().split("T")[0]}-${time}-${Date.now()}`,
              doctorId: "doctor-1",
              date: d.toISOString().split("T")[0],
              startTime: `${String(slotStartHour).padStart(2, "0")}:${String(slotStartMin).padStart(2, "0")}`,
              endTime: `${String(slotEndHour).padStart(2, "0")}:${String(slotEndMin).padStart(2, "0")}`,
              isBooked: false,
            });
          }
        });
      }

      const updatedSlots = [...slots, ...generatedSlots];
      setSlots(updatedSlots);
      localStorage.setItem("slots", JSON.stringify(updatedSlots));

      toastService.success(
        `Generated ${generatedSlots.length} slots successfully`,
      );
      setShowAutoGenerate(false);
      setAutoGenerate({ startDate: "", endDate: "", slotDuration: 30 });
    } catch (error) {
      toastService.error("Failed to generate slots");
    }
  };

  const filteredSlots = slots.filter((slot) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "available") return !slot.isBooked;
    if (filterStatus === "booked") return slot.isBooked;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-muted-foreground text-base sm:text-lg">
          Manage your availability and appointment slots
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* SECTION 1: Weekly Availability */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl">
                Weekly Availability
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Define your recurring weekly schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Add New Availability */}
            <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg bg-muted/30">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek" className="text-sm">
                    Total days
                  </Label>
                  <Select
                    value={newAvailability.dayOfWeek?.toString()}
                    onValueChange={(value) => {
                      console.log(value);
                      setNewAvailability({
                        ...newAvailability,
                        dayOfWeek: value,
                      });
                    }}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select total days" />
                    </SelectTrigger>

                    <SelectContent>
                      {DAYS_OF_WEEK.map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="h-10"
                    value={newAvailability?.startTime}
                    onChange={(e) => {
                      console.log(e);
                      setNewAvailability({
                        ...newAvailability,
                        startTime: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="h-10"
                    value={newAvailability?.endTime}
                    onChange={(e) => {
                      setNewAvailability({
                        ...newAvailability,
                        endTime: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={addAvailability}
                className="w-full sm:w-auto h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </div>

            {/* Existing Availabilities */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                Current Schedule
              </h3>
              {availabilities.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground">
                  No availability set. Add your first time slot above.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
                  {availabilities.map((availability, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Badge
                          variant="secondary"
                          className="font-semibold text-xs sm:text-sm w-fit"
                        >
                          {availability.dayOfWeek}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {availability.startTime} – {availability.endTime}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAvailability(availability.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-0 mr-2" />
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Auto-Generate Slots */}
        <Card>
          <CardHeader className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl">
                Auto-Generate Slots
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Create slots from your availability schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {!showAutoGenerate ? (
              <Button
                onClick={() => setShowAutoGenerate(true)}
                className="w-full h-10"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate Slots
              </Button>
            ) : (
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border border-border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="h-10"
                    value={autoGenerate.startDate}
                    onChange={(e) =>
                      setAutoGenerate({
                        ...autoGenerate,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="h-10"
                    value={autoGenerate.endDate}
                    onChange={(e) =>
                      setAutoGenerate({
                        ...autoGenerate,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slotDuration" className="text-sm">
                    Slot Duration (minutes)
                  </Label>
                  <Select
                    value={autoGenerate.slotDuration.toString()}
                    onValueChange={(value) =>
                      setAutoGenerate({
                        ...autoGenerate,
                        slotDuration: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="slotDuration" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SLOT_DURATIONS.map((duration) => (
                        <SelectItem key={duration} value={duration.toString()}>
                          {duration} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={generateSlots}
                    className="flex-1 h-10 order-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    onClick={() => setShowAutoGenerate(false)}
                    variant="outline"
                    className="h-10 order-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3: Manual Slot Creation */}
        <Card>
          <CardHeader className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl">
                Manual Slot Creation
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Add individual appointment slots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border border-border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="slotDate" className="text-sm">
                  Date
                </Label>
                <Input
                  id="slotDate"
                  type="date"
                  className="h-10"
                  value={newSlot.date}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, date: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slotStartTime" className="text-sm">
                    Start Time
                  </Label>
                  <Input
                    id="slotStartTime"
                    type="time"
                    className="h-10"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, startTime: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slotEndTime" className="text-sm">
                    End Time
                  </Label>
                  <Input
                    id="slotEndTime"
                    type="time"
                    className="h-10"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button onClick={addSlot} className="w-full h-10">
                <Plus className="h-4 w-4 mr-2" />
                Create Slot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Existing Slots List */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <CardTitle className="text-lg sm:text-xl">
                    Appointment Slots
                  </CardTitle>
                </div>
                <CardDescription className="text-sm">
                  View and manage your appointment slots
                </CardDescription>
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value: any) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-full sm:w-[150px] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Slots</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSlots.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <CalendarDays className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">
                  No slots found. Create your first slot above.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSlots
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return a.startTime.localeCompare(b.startTime);
                  })
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 sm:p-4 border rounded-lg transition-all ${
                        slot.isBooked
                          ? "bg-muted border-muted-foreground/20 opacity-75"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="font-semibold text-xs sm:text-sm truncate">
                              {new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                {slot.startTime} – {slot.endTime}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              slot.isBooked ? "destructive" : "secondary"
                            }
                            className={`text-xs flex-shrink-0 ${
                              slot.isBooked
                                ? "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                                : "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                            }`}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>

                        {!slot.isBooked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSlot(slot.id)}
                            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete Slot
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
