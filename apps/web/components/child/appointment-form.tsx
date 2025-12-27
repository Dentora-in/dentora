"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
// 1. Import the constant
import { COUNTRY_CODES } from "@dentora/shared/country-codes";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Card } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/spinner";
import { toastService } from "@/lib/toast";
import { getAllSlotes, newAppointment } from "@/api/api.appointment";
import { AppointmentFormData } from "@/interfaces/appointment.interface";

const today = new Date().toISOString().split("T")[0];

export function Appointment({ setIsSuccess }: any) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AppointmentFormData>({
    firstName: "",
    lastName: "",
    age: undefined,
    gender: "",
    phoneCountry: "+91", // Default value matching your constant
    phoneNo: "",
    email: "",
    bookingDate: today,
    bookingTiming: "",
    acceptPolicy: false,
  });

  const [slotes, setSlotes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllSlotes(formData.bookingDate);
      setSlotes(data.slotes || []);
    };
    fetch();
  }, [formData.bookingDate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, bookingTiming: id }));
  };

  // ... (Keep isFormValid and handleSubmit logic as is) ...
  const isFormValid = () => {
    return Object.values({
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age,
      gender: formData.gender,
      phoneNo: formData.phoneNo,
      email: formData.email,
      bookingDate: formData.bookingDate,
      bookingTiming: formData.bookingTiming,
      acceptPolicy: formData.acceptPolicy,
    }).every(Boolean);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      toastService.warning("Missing Information", {
        description: "Please fill all fields before submitting.",
      });
      return;
    }

    const payload = {
      ...formData,
      age: Number(formData.age),
      appointmentDate: formData.bookingDate,
      slotId: formData.bookingTiming,
    };

    delete (payload as any).bookingDate;
    delete (payload as any).bookingTiming;

    setLoading(true);

    const result = await newAppointment(payload);

    if (result?.success) {
      setLoading(false);
      setIsSuccess(true);
      return;
    }

    toastService.error(
      result?.response?.data?.message ||
        "Could not book your appointment. Please try again.",
    );

    setLoading(false);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <Card className="w-full max-w-md mx-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (Keep Name, Age, Gender inputs as is) ... */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                min="0"
                max="150"
                required
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Updated Phone Code Logic */}
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <div className="flex gap-2">
              <Select
                value={formData.phoneCountry}
                onValueChange={(value) =>
                  handleSelectChange("phoneCountry", value)
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {/* Map directly over the imported constant */}
                  {COUNTRY_CODES.map((item: any) => (
                    <SelectItem key={item.id} value={`+${item.phone_code}`}>
                      {/* Display format: IN (+91) */}
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {item.country_en.slice(0, 2).toUpperCase()}
                        </span>
                        <span>+{item.phone_code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="flex-1"
                required
              />
            </div>
          </div>

          {/* ... (Rest of the form remains unchanged) ... */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingDate">Appointment Date</Label>
            <Input
              id="bookingDate"
              name="bookingDate"
              type="date"
              value={formData.bookingDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2 mb-4">
            <Label>Appointment Time</Label>
            <div
              className="overflow-x-auto max-h-36 sm:max-h-52 w-full"
              style={{ scrollbarWidth: "thin" }}
            >
              {slotes.length === 0 && (
                <p className="text-sm text-red-500">
                  No slots available for this date.
                </p>
              )}

              <div className="grid gap-2 grid-cols-3 sm:gap-3 pb-2 pr-1 sm:w-full">
                {slotes.map((slot: any) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleTimeSelect(slot.id)}
                    className={`py-2 px-2 sm:px-3 rounded-md border-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      formData.bookingTiming === slot.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:border-primary"
                    }`}
                  >
                    {formatTime(slot.startTime)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="acceptPolicy"
              checked={formData.acceptPolicy}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  acceptPolicy: Boolean(checked),
                }))
              }
            />
            <Label
              htmlFor="acceptPolicy"
              className="font-normal cursor-pointer"
            >
              Accept the policy & conditions
            </Label>
          </div>

          <Button
            type="submit"
            disabled={!formData.acceptPolicy}
            className="w-full mt-3"
            size="lg"
          >
            {loading ? <Spinner /> : "Book Appointment"}
          </Button>
        </form>
      </Card>
    </>
  );
}

export default Appointment;
