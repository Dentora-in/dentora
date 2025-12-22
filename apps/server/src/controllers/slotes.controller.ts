import { Request, Response } from "express";
import { prisma } from "@dentora/database";
import { COUNTRY_CODES } from "@dentora/shared/country-codes";
import { addDoctorAvailabilitySchema, ZodError } from "@dentora/shared/zod";
import {
  generateTimeSlots,
  getWeekStartAndEnd,
  timeToTodayDateTime,
} from "@dentora/shared/globals";

// TODO: here only this week data should be visible

type SearchType = "all" | "available" | "booked";
const allowedTypes = ["all", "available", "booked"] as const;

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

export const mySpacePageData = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const doctorId = req.user.id;

    const searchType: SearchType =
      typeof req.query.search_type === "string" &&
      allowedTypes.includes(req.query.search_type as SearchType)
        ? (req.query.search_type as SearchType)
        : "all";

    if (!["all", "available", "booked"].includes(searchType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid search type. Use all | available | booked",
      });
    }

    const { startOfWeek, endOfWeek } = getWeekStartAndEnd(new Date());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d.getDay();
    });

    const slotWhere: any = {
      doctorId,
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    };

    if (searchType === "available") {
      slotWhere.isBooked = false;
    }

    if (searchType === "booked") {
      slotWhere.isBooked = true;
    }

    const [weeklyAvailability, weeklySlots] = await Promise.all([
      prisma.doctorAvailability.findMany({
        where: {
          doctorId,
          dayOfWeek: { in: weekDays },
        },
        orderBy: { dayOfWeek: "asc" },
      }),

      prisma.doctorSlot.findMany({
        where: slotWhere,
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        filter: searchType,
        weekRange: {
          start: startOfWeek.toISOString(),
          end: endOfWeek.toISOString(),
        },
        weeklyAvailability,
        weeklySlots,
      },
    });
  } catch (error) {
    console.error("Error mySpacePageData:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch My Space page data",
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

    const { day, startTime, endTime } = validationResult.data;

    const startDateTime = timeToTodayDateTime(startTime);
    const endDateTime = timeToTodayDateTime(endTime);

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
        dayOfWeek: day,
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
        dayOfWeek: day,
        startTime: startDateTime,
        endTime: endDateTime,
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

export const slotCreation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const doctorId = req.user.id;

    const { duration } = req.body as { duration: number };

    if (!duration || ![15, 30, 45, 60].includes(duration)) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot duration",
      });
    }

    const { startOfWeek, endOfWeek } = getWeekStartAndEnd(new Date());

    const availabilities = await prisma.doctorAvailability.findMany({
      where: { doctorId },
    });

    if (availabilities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No availability found to generate slots",
      });
    }

    await prisma.doctorSlot.deleteMany({
      where: {
        doctorId,
        isBooked: false,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    const slotsToCreate = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayOfWeek = currentDate.getDay();

      const todaysAvailability = availabilities.filter(
        (a) => a.dayOfWeek === dayOfWeek,
      );

      for (const availability of todaysAvailability) {
        const slots = generateTimeSlots(
          currentDate,
          availability.startTime,
          availability.endTime,
          duration,
        );

        for (const slot of slots) {
          slotsToCreate.push({
            doctorId,
            date: currentDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        }
      }
    }

    const slotes = await prisma.doctorSlot.createMany({
      data: slotsToCreate,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: "Slots generated successfully",
      count: slotsToCreate.length,
      slotes,
    });
  } catch (error) {
    console.error("Slot generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate slots",
    });
  }
};

export const deleteDoctorSlot = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const doctorId = req.user.id;
    const { slotId } = req.params;

    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: "Slot ID is required",
      });
    }

    const slot = await prisma.doctorSlot.findFirst({
      where: {
        id: slotId,
        doctorId,
      },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or not authorized",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a booked slot",
      });
    }

    await prisma.doctorSlot.delete({
      where: { id: slotId },
    });

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    console.error("Delete doctor slot error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete slot",
    });
  }
};
