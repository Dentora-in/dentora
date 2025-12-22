import { z, ZodError, ZodSchema } from "zod";

export { ZodError, ZodSchema, z };

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const signupSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export type SignupSchemaType = z.infer<typeof signupSchema>;

export const AppointmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const appointmentSchema = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  gender: z.string(),
  phoneCountry: z.string().optional(),
  phoneNo: z.string(),
  email: z.string().email(),
  appointmentDate: z.coerce.date(),
  notes: z.string().optional(),
  doctorId: z.string().optional(),
  slotId: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentId: z.string().nullable().optional(),
  verified: z.boolean().default(false),
  status: AppointmentStatusSchema.default("PENDING"),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const addDoctorAvailabilitySchema = z
  .object({
    dayOfWeek: z.enum([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),
    startTime: z.string().regex(timeRegex, "Invalid time format HH:mm"),
    endTime: z.string().regex(timeRegex, "Invalid time format HH:mm"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });
