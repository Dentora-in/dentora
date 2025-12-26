import { Request, Response } from "express";
import { Prisma, prisma, UserRole } from "@dentora/database";
import { appointmentSchema, editAppointmentSchema } from "@dentora/shared/zod";
import { appointmentQueue } from "@dentora/shared/queue";

// TODO: optimization
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const parsed = appointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment data",
        errors: parsed.error.flatten(),
      });
    }

    const data = parsed.data;

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        let user = await tx.user.findUnique({ where: { email: data.email } });

        if (!user) {
          user = await tx.user.create({
            data: {
              id: crypto.randomUUID(),
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              role: UserRole.PATIENT,
            },
          });
        }

        const slot = await tx.doctorSlot.findUnique({
          where: { id: data.slotId },
        });

        if (!slot) throw new Error("Slot does not exist");
        if (slot.isBooked) throw new Error("Slot already booked");

        const existingAppointment = await tx.appointment.findUnique({
          where: { slotId: data.slotId },
        });

        if (existingAppointment) {
          throw new Error("An appointment already exists for this slot");
        }

        // Mark slot booked
        const updatedSlot = await tx.doctorSlot.update({
          where: { id: slot.id },
          data: { isBooked: true },
        });

        // Create appointment record
        const appointment = await tx.appointment.create({
          data: {
            ...data,
            userId: user.id,
          },
        });

        return { appointment, slot: updatedSlot };
      },
    );

    await appointmentQueue.add(
      "SEND_EMAIL_AND_MEET",
      {
        appointmentId: result.appointment.id,
        email: result.appointment.email,
        patientName: `${result.appointment.firstName} ${result.appointment.lastName}`,
        slotStart: result.slot.startTime,
        slotEnd: result.slot.endTime,
      },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 1000 * 60,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (e: any) {
    console.error("❌ Appointment booking error:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Internal server error",
    });
  }
};

export const getAllAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const statusQuery = (req.query.status as string) || undefined;
    const pageQuery = Number(req.query.page ?? 1);
    const limitQuery = Number(req.query.limit ?? 10);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doctor_details = await prisma.user.findUnique({
      where: {
        id: user.id,
        role: user.role as UserRole,
      },
    });

    if (!doctor_details) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // sanitize the inputs
    const page =
      Number.isFinite(pageQuery) && pageQuery > 0 ? Math.floor(pageQuery) : 1;
    const limit =
      Number.isFinite(limitQuery) && limitQuery > 0
        ? Math.min(Math.floor(limitQuery), 100)
        : 10; // max 100

    const where: any = { doctorId: doctor_details.id };

    if (statusQuery) {
      where.status = statusQuery;
    }

    // find the total count for pagination
    const total = await prisma.appointment.count({ where });
    const total_pending = await prisma.appointment.count({
      where: {
        status: "PENDING",
        doctorId: doctor_details.id,
      },
    });
    const total_confirmed = await prisma.appointment.count({
      where: {
        status: "CONFIRMED",
        doctorId: doctor_details.id,
      },
    });
    const total_completed = await prisma.appointment.count({
      where: {
        status: "COMPLETED",
        doctorId: doctor_details.id,
      },
    });
    const total_cancelled = await prisma.appointment.count({
      where: {
        status: "CANCELLED",
        doctorId: doctor_details.id,
      },
    });

    // based the the query have to calc the page and limit
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: "desc" },
      skip,
      take: limit,
    });

    return res.status(200).json({
      success: true,
      meta_data: {
        totalPages,
        page,
        limit,
        total,
        total_pending,
        total_confirmed,
        total_completed,
        total_cancelled,
      },
      appointments,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doctor_details = await prisma.user.findUnique({
      where: {
        id: user.id,
        role: user.role as UserRole,
      },
    });

    if (!doctor_details) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = editAppointmentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.error.flatten(),
      });
    }

    const { ids, status } = result.data;

    const all_ids = ids.map((a) => a.id);

    const updatedAppointments = await prisma.appointment.updateManyAndReturn({
      where: {
        id: { in: all_ids },
        doctorId: user.id,
      },
      data: { status },
    });

    return res.json({
      success: true,
      message: "Appointments updated successfully",
      data: updatedAppointments,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
