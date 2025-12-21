import { Request, Response } from "express";
import { prisma } from "@dentora/database";
import { COUNTRY_CODES } from "@dentora/shared/country-codes";
import { addDoctorAvailabilitySchema, ZodError } from "@dentora/shared/zod";

export const getAllSlotes = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const doctorId = req.query.doctorId as string | undefined;
    const specialization = req.query.specialization as string | undefined;
    const place = req.query.place as string | undefined;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startOfDay < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot query slots for past dates",
      });
    }

    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date provided",
      });
    }

    const whereClause: any = {
      isBooked: false,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    if (specialization || place) {
      whereClause.doctor = {};
      if (specialization) {
        whereClause.doctor.specialization = specialization;
      }
      if (place) {
        whereClause.doctor.place = place;
      }
    }

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
      orderBy: [{ startTime: "asc" }, { doctorId: "asc" }],
    });

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
      slotsByTime: slotsByTime,
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

export const addDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const validationResult = addDoctorAvailabilitySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: validationResult.error.flatten(),
      });
    }

    const parsedData = validationResult.data;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const doctorId = req.user.id;

    if (!doctorId) {
      return res.status(403).json({
        success: false,
        message: "Doctor access required",
      });
    }

    const overlap = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId,
        dayOfWeek: parsedData.day,
        OR: [
          {
            startTime: { lt: parsedData.endTime },
            endTime: { gt: parsedData.startTime },
          },
        ],
      },
    });

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: "Availability overlaps with an existing slot",
      });
    }

    const weeklyAvailability = await prisma.doctorAvailability.create({
      data: {
        doctorId,
        dayOfWeek: parsedData.day,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Doctor availability added successfully",
      data: {
        id: weeklyAvailability.id,
        dayOfWeek: weeklyAvailability.dayOfWeek,
        startTime: weeklyAvailability.startTime,
        endTime: weeklyAvailability.endTime,
      },
    });
  } catch (error) {
    console.error("Add doctor availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding doctor availability",
    });
  }
};

export const deleteDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const { availabilityId } = req.params;

    if (!availabilityId) {
      return res.status(400).json({
        success: false,
        message: "Availability ID is required",
      });
    }

    const doctorId = req.user!.id;

    const deleted = await prisma.doctorAvailability.deleteMany({
      where: {
        id: availabilityId,
        doctorId: doctorId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Availability not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor availability deleted successfully",
    });
  } catch (error) {
    console.error("Delete doctor availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting doctor availability",
    });
  }
};
