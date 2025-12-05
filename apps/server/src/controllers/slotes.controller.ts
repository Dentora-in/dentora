import { Request, Response } from "express";
import { prisma } from "@dentora/database";
import { COUNTRY_CODES } from "@dentora/shared/country-codes";

export const getAllSlotes = async (req: Request, res: Response) => {
    try {
        const date = req.query.date as string;
        const doctorId = req.query.doctorId as string | undefined;
        const specialization = req.query.specialization as string | undefined;
        const place = req.query.place as string | undefined;

        // Edge Case 1: Missing or invalid date parameter
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date parameter is required",
            });
        }

        // Edge Case 2: Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        // Edge Case 3: Handle timezone issues - use UTC for consistency
        const startOfDay = new Date(date + "T00:00:00.000Z");
        const endOfDay = new Date(date + "T23:59:59.999Z");

        // Edge Case 4: Prevent querying past dates (optional - remove if you want to show past slots)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startOfDay < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot query slots for past dates",
            });
        }

        // Edge Case 5: Validate date is not invalid
        if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date provided",
            });
        }

        // Build where clause with filters
        const whereClause: any = {
            isBooked: false,
            startTime: {
                gte: startOfDay,
                lte: endOfDay,
            },
        };

        // Edge Case 6: Filter by doctorId if provided
        if (doctorId) {
            whereClause.doctorId = doctorId;
        }

        // Edge Case 7: Filter by specialization or place (requires nested filter)
        if (specialization || place) {
            whereClause.doctor = {};
            if (specialization) {
                whereClause.doctor.specialization = specialization;
            }
            if (place) {
                whereClause.doctor.place = place;
            }
        }

        // Edge Case 8: Include doctor information to handle multiple doctors with same slot time
        const availableSlots = await prisma.doctorSlot.findMany({
            where: whereClause,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        place: true,
                        experienceYears: true,
                        email: true,
                        phoneNo: true,
                    },
                },
            },
            orderBy: [
                { startTime: 'asc' },
                { doctorId: 'asc' }, // Secondary sort to ensure consistent ordering
            ],
        });

        // Edge Case 9: Group slots by time for easier frontend handling (optional)
        // This helps when multiple doctors have the same slot time
        const slotsByTime = availableSlots.reduce((acc: any, slot: any) => {
            const timeKey = slot.startTime.toISOString();
            if (!acc[timeKey]) {
                acc[timeKey] = [];
            }
            acc[timeKey].push(slot);
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            slotes: availableSlots,
            slotsByTime: slotsByTime, // Grouped by time for convenience
            filters: {
                date,
                doctorId: doctorId || null,
                specialization: specialization || null,
                place: place || null,
            },
            country_codes: COUNTRY_CODES,
        });

    } catch (e: any) {
        console.error("Error fetching slots:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "Failed to get all slots",
        });
    }
};
