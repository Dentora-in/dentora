import { Request, Response, NextFunction } from "express";
import { prisma } from "@dentora/database";
import { appointmentSchema } from "@dentora/shared/zod";
import { AppointmentStatus } from "@dentora/database";
import { createMeetEvent } from "@dentora/shared/meeting";

const activeStatuses: AppointmentStatus[] = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
];

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

        console.log(">>>>>>>>>>data", data);

        let userId = data.userId;

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                email: data.email,
                status: {
                    in: activeStatuses
                },
            },
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "You already have an active appointment. Please complete or cancel it before booking a new one.",
            });
        }

        if (!userId) {
            let user = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: crypto.randomUUID(),
                        name: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                        emailVerified: false,
                        password: null,
                        role: "PATIENT", //import from prisma
                    },
                });
            }

            userId = user.id;
        }

        if (data.doctorId) {
            const doctor = await prisma.doctor.findUnique({
                where: { id: data.doctorId },
            });

            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Selected doctor does not exist",
                });
            }
        }

        if (!data.slotId) {
            return res.status(400).json({
                success: false,
                message: "slotId is required"
            });
        }

        const slot = await prisma.doctorSlot.findUnique({
            where: { id: data.slotId }
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Selected time slot does not exist",
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked",
            });
        }

        const slot_details = await prisma.doctorSlot.findUnique({
            where: {
                id: data.slotId
            }
        });

        if (!slot_details) {
            return res.status(400).json({
                success: false,
                message: "slot has already taken. Please try with other time!!"
            });
        }

        const doctor_details = await prisma.doctorSlot.update({
            where: { id: data.slotId },
            data: { isBooked: true },
        });

        const meetLink = await createMeetEvent(
            data.email,
            slot_details.startTime.toISOString(),
            slot_details.endTime.toISOString()
        );

        const appointment = await prisma.appointment.create({
            data: {
                ...data,
                userId,
                meetLink,
                doctorId: doctor_details.doctorId
            },
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment,
        });

    } catch (error) {
        console.error("❌ Appointment booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while booking appointment",
        });
    }
};

