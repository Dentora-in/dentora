import { Request, Response } from "express";
import { prisma } from "@dentora/database";
import { COUNTRY_CODES } from "@dentora/shared/country-codes";

export const getAllSlotes = async (req: Request, res: Response) => {
    try {
        const date = req.query.date as string;

        const startOfDay = new Date(date + "T00:00:00.000Z");
        const endOfDay = new Date(date + "T23:59:59.999Z");

        const availableSlots = await prisma.doctorSlot.findMany({
            where: {
                isBooked: false,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        return res.status(200).json({
            success: true,
            slotes: availableSlots,
            country_codes: COUNTRY_CODES
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Fail to get all slotes",
        });
    }
};
