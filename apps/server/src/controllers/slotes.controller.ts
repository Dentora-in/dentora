import { Request, Response } from "express";
import { prisma } from "@dentora/database";
import { COUNTRY_CODES } from "@dentora/shared/country-codes";

export const getAllSlotes = async (req: Request, res: Response) => {
    try {
        const availableSlots = await prisma.doctorSlot.findMany({
            where: {
                isBooked: false,
            }
        });

        console.log(">>>>>>>>>>>>availableSlots", availableSlots);

        if (availableSlots) {
            return res.status(200).json({
                "success": true,
                "slotes": availableSlots,
                "country-codes": COUNTRY_CODES
            })
        } else {
            return res.status(200).json({
                "success": false,
                "slotes": [],
            })
        }

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            "success": false,
            "message": "Fail to get all slotes"
        });
    }
};