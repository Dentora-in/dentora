import { Request, Response } from "express";
import { AppointmentStatus, Prisma, prisma, UserRole } from "@dentora/database";
import { appointmentSchema, editAppointmentSchema } from "@dentora/shared/zod";
import { appointmentQueue } from "@dentora/shared/queue";

type AppointmentTimeline = "upcoming" | "past";

// TODO: optimization
// FOR DOCTORS:
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

// FOR PATIENT:
export const getAllPatientAppointment = async (req: Request, res: Response) => {
  try {
    const patient = req.user;

    if (!patient) {
      return res.status(401).json({ message: "Un-authorized Patient!!" });
    }

    const timelineParam = req.query.timeline;

    const timeline: "upcoming" | "past" =
      timelineParam === "past" || timelineParam === "upcoming"
        ? timelineParam
        : "upcoming";

    const statusFilter =
      timeline === "upcoming"
        ? [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
        : [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED];

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: patient.id,
        status: { in: statusFilter },
      },
      orderBy: {
        appointmentDate: "asc",
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        slot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    const formattedAppointments = appointments.map((a) => ({
      id: a.id,
      appointmentDate: a.appointmentDate.toISOString(),
      status: a.status,
      verified: a.verified,
      meetLink: a.meetLink ?? undefined,
      notes: a.notes ?? undefined,

      doctor: a.doctor
        ? {
            firstName: a.doctor.firstName,
            lastName: a.doctor.lastName,
            specialization: a.doctor.specialization ?? undefined,
          }
        : null,

      slot: a.slot
        ? {
            startTime: a.slot.startTime.toISOString(),
            endTime: a.slot.endTime.toISOString(),
          }
        : undefined,
    }));

    return res.status(200).json({
      success: true,
      timeline,
      count: formattedAppointments.length,
      appointments: formattedAppointments,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const editPatientAppointmentDetails = async (
  req: Request,
  res: Response,
) => {
  try {
    const patient = req.user;

    if (!patient) {
      return res.status(401).json({ message: "Unauthorized patient" });
    }

    const { cancelId } = req.body;

    if (!cancelId) {
      return res.status(400).json({ message: "cancelId is required" });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: cancelId,
        userId: patient.id,
      },
      select: {
        id: true,
        status: true,
        slotId: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      return res.status(400).json({
        message: "Appointment already cancelled",
      });
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled",
      });
    }

    const updatedAppointment = await prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          meetLink: null,
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          slot: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      });

      if (appointment.slotId) {
        await tx.doctorSlot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        });
      }

      return updated;
    });

    // 🔁 Same formatting as getAllPatientAppointment
    const formattedAppointment = {
      id: updatedAppointment.id,
      appointmentDate: updatedAppointment.appointmentDate.toISOString(),
      status: updatedAppointment.status,
      verified: updatedAppointment.verified,
      meetLink: updatedAppointment.meetLink ?? undefined,
      notes: updatedAppointment.notes ?? undefined,

      doctor: updatedAppointment.doctor
        ? {
            firstName: updatedAppointment.doctor.firstName,
            lastName: updatedAppointment.doctor.lastName,
            specialization:
              updatedAppointment.doctor.specialization ?? undefined,
          }
        : null,

      slot: updatedAppointment.slot
        ? {
            startTime: updatedAppointment.slot.startTime.toISOString(),
            endTime: updatedAppointment.slot.endTime.toISOString(),
          }
        : undefined,
    };

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: formattedAppointment,
    });
  } catch (error: any) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      message: "Failed to cancel appointment",
      error: error?.message,
    });
  }
};
