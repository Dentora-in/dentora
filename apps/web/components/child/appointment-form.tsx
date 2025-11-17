'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Card } from '@workspace/ui/components/card';

interface AppointmentFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phoneNo: string;
  email: string;
  bookingDate: string;
  bookingTiming: string;
  acceptPolicy: boolean;
}

interface AppointmentProps {
  onSubmit?: (data: AppointmentFormData) => void;
  initialData?: Partial<AppointmentFormData>;
}

const AVAILABLE_TIMES = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
];

export function Appointment({
  onSubmit,
  initialData,
}: AppointmentProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    phoneNo: initialData?.phoneNo || '',
    email: initialData?.email || '',
    bookingDate: initialData?.bookingDate || '',
    bookingTiming: initialData?.bookingTiming || '',
    acceptPolicy: initialData?.acceptPolicy || false,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptPolicy: checked,
    }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      bookingTiming: time,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log('Form Data:', formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        APPOINTMENT
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
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

        {/* Age and Gender */}
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                handleSelectChange('gender', value)
              }
            >
              <SelectTrigger id="gender">
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

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input
            id="phoneNo"
            name="phoneNo"
            type="tel"
            value={formData.phoneNo}
            onChange={handleInputChange}
            placeholder="Phone number"
            required
          />
        </div>

        {/* Email */}
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

        {/* Date Picker */}
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

        {/* Time Slots */}
        <div className="space-y-2">
          <Label>Appointment Time</Label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {AVAILABLE_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`py-2 px-2 sm:px-3 rounded-md border-2 text-sm font-medium transition-colors ${
                  formData.bookingTiming === time
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background hover:border-primary'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Policy Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="acceptPolicy"
            checked={formData.acceptPolicy}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="acceptPolicy" className="font-normal cursor-pointer">
            Accept the policy & conditions
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!formData.acceptPolicy}
          className="w-full mt-6"
          size="lg"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}
