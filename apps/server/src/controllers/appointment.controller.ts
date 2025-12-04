import { Request, Response, NextFunction } from "express";
import { prisma } from "@dentora/database";
import { appointmentSchema } from "@dentora/shared/zod";
import { UserRole, AppointmentStatus } from "@dentora/database";
import { queue } from "@dentora/shared/queue";

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

        const result = await prisma.$transaction(async (tx) => {
            // Ensure user exists
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

            // Lock slot row
            const slot = await tx.doctorSlot.findUnique({
                where: { id: data.slotId },
            });

            if (!slot) throw new Error("Slot does not exist");
            if (slot.isBooked) throw new Error("Slot already booked");

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
        });

        await queue.add("SEND_EMAIL_AND_MEET", {
            appointmentId: result.appointment.id,
            email: result.appointment.email,
            patientName: `${result.appointment.firstName} ${result.appointment.lastName}`,
            slotStart: result.slot.startTime,
            slotEnd: result.slot.endTime,
        }, {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 1000 * 60,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully"
        });

    } catch (e: any) {
        console.error("❌ Appointment booking error:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal server error",
        });
    }
};

export const getAllAppointment = async (req: Request, res:Response) => {
    try {
        // const doctorID = req.user;

        // console.log(">>>>>>>>>>inside the getallappoitment", doctorID);

        return res.status(200).json({
            message: "hitted"
        });
        

    } catch (e: any) {
        console.error("❌ Appointment booking error:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal server error",
        });
    }
}