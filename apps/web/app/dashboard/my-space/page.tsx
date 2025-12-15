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
import { toast } from "@workspace/ui/components/sonner";

// Types
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
const SLOT_DURATIONS = [15, 30, 45, 60];

export default function DoctorAvailabilityManager() {
  const [isLoading, setIsLoading] = useState(true);

  // Availability state
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>(
    []
  );
  const [newAvailability, setNewAvailability] = useState<NewAvailability>({
    dayOfWeek: null,
    startTime: "",
    endTime: "",
  });
  const [editingAvailability, setEditingAvailability] = useState<string | null>(
    null
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

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch availabilities
      const availabilityRes = await fetch("/api/doctor/availability");
      if (availabilityRes.ok) {
        const data = await availabilityRes.json();
        setAvailabilities(data);
      }

      // Fetch slots
      const slotsRes = await fetch("/api/doctor/slots");
      if (slotsRes.ok) {
        const data = await slotsRes.json();
        setSlots(data);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Availability handlers
  const addAvailability = async () => {
    if (!newAvailability.dayOfWeek && newAvailability.dayOfWeek !== 0) {
      toast.warning("Validation Error", {
        description: "Please select a day of week",
      });
      return;
    }

    if (!newAvailability.startTime || !newAvailability.endTime) {
      toast.warning("Validation Error", {
        description: "Please select start and end times",
      });
      return;
    }

    if (newAvailability.startTime >= newAvailability.endTime) {
      toast("Validation Error", {
        description: "End time must be after start time",
      });
      return;
    }

    try {
      const res = await fetch("/api/doctor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAvailability),
      });

      if (res.ok) {
        const data = await res.json();
        setAvailabilities([...availabilities, data]);
        setNewAvailability({ dayOfWeek: null, startTime: "", endTime: "" });
        toast.success("Success", {
          description: "Availability added successfully",
        });
      } else {
        throw new Error("Failed to add availability");
      }
    } catch (error) {
      toast.error("Failed to add availability");
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const res = await fetch(`/api/doctor/availability/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAvailabilities(availabilities.filter((a) => a.id !== id));
        toast.success("Availability deleted successfully");
      } else {
        throw new Error("Failed to delete availability");
      }
    } catch (error) {
      toast.error("Failed to delete availability");
    }
  };

  // Slot handlers
  const addSlot = async () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      toast.warning("Please fill all slot details");
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.warning("End time must be after start time");
      return;
    }

    try {
      const res = await fetch("/api/doctor/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });

      if (res.ok) {
        const data = await res.json();
        setSlots([...slots, data]);
        setNewSlot({ date: "", startTime: "", endTime: "" });
        toast.success("Slot created successfully");
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to create slot");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create slot");
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      const res = await fetch(`/api/doctor/slots/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSlots(slots.filter((s) => s.id !== id));
        toast.success("Slot deleted successfully");
      } else {
        throw new Error("Failed to delete slot");
      }
    } catch (error) {
      toast.error("Failed to delete slot");
    }
  };

  const generateSlots = async () => {
    if (!autoGenerate.startDate || !autoGenerate.endDate) {
      toast.warning("Please select date range");
      return;
    }

    if (autoGenerate.startDate > autoGenerate.endDate) {
      toast.warning("End date must be after start date");
      return;
    }

    try {
      const res = await fetch("/api/doctor/slots/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoGenerate),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Generated ${data.count} slots successfully`);
        loadData(); // Reload all slots
        setShowAutoGenerate(false);
        setAutoGenerate({ startDate: "", endDate: "", slotDuration: 30 });
      } else {
        throw new Error("Failed to generate slots");
      }
    } catch (error) {
      toast.error("Failed to generate slots");
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-lg">
          Manage your availability and appointment slots
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 1: Weekly Availability */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Weekly Availability</CardTitle>
            </div>
            <CardDescription>
              Define your recurring weekly schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Availability */}
            <div className="grid gap-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    value={newAvailability.dayOfWeek?.toString() ?? ""}
                    onValueChange={(value) =>
                      setNewAvailability({
                        ...newAvailability,
                        dayOfWeek: Number.parseInt(value) as DayOfWeek,
                      })
                    }
                  >
                    <SelectTrigger id="dayOfWeek">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newAvailability.startTime}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newAvailability.endTime}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={addAvailability} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </div>

            {/* Existing Availabilities */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Current Schedule
              </h3>
              {availabilities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No availability set. Add your first time slot above.
                </div>
              ) : (
                <div className="grid gap-3">
                  {availabilities.map((availability) => (
                    <div
                      key={availability.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="font-semibold">
                          {DAYS_OF_WEEK[availability.dayOfWeek]}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {availability.startTime} – {availability.endTime}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAvailability(availability.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
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
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Auto-Generate Slots</CardTitle>
            </div>
            <CardDescription>
              Create slots from your availability schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showAutoGenerate ? (
              <Button
                onClick={() => setShowAutoGenerate(true)}
                className="w-full"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate Slots
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
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
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
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
                  <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                  <Select
                    value={autoGenerate.slotDuration.toString()}
                    onValueChange={(value) =>
                      setAutoGenerate({
                        ...autoGenerate,
                        slotDuration: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="slotDuration">
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

                <div className="flex gap-2">
                  <Button onClick={generateSlots} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    onClick={() => setShowAutoGenerate(false)}
                    variant="outline"
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
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle>Manual Slot Creation</CardTitle>
            </div>
            <CardDescription>Add individual appointment slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="slotDate">Date</Label>
                <Input
                  id="slotDate"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, date: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slotStartTime">Start Time</Label>
                  <Input
                    id="slotStartTime"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, startTime: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slotEndTime">End Time</Label>
                  <Input
                    id="slotEndTime"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button onClick={addSlot} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Slot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Existing Slots List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Appointment Slots</CardTitle>
                </div>
                <CardDescription>
                  View and manage your appointment slots
                </CardDescription>
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value: any) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-[150px]">
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
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No slots found. Create your first slot above.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSlots
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return a.startTime.localeCompare(b.startTime);
                  })
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 border rounded-lg transition-all ${
                        slot.isBooked
                          ? "bg-muted border-muted-foreground/20 opacity-75"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">
                              {new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {slot.startTime} – {slot.endTime}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              slot.isBooked ? "destructive" : "secondary"
                            }
                            className={
                              slot.isBooked
                                ? "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                                : "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                            }
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>

                        {!slot.isBooked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSlot(slot.id)}
                            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
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
