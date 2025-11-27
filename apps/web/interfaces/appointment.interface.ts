
export interface AppointmentFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phoneCountry: string;
  phoneNo: string;
  email: string;
  bookingDate: string;
  bookingTiming: string;
  acceptPolicy: boolean;
}

export interface AppointmentProps {
  onSubmit?: (data: AppointmentFormData) => void;
  initialData?: Partial<AppointmentFormData>;
}