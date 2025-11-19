import { Request, Response, NextFunction } from "express";
import { prisma } from "@dentora/database";

export const getAllAppointments = (req: Request, res: Response) => {
    try {
        return {
            "success": true,
            "message": "write the full function"
        }

    } catch (e) {
        console.error(e);
        return {
            "success": false,
            "message": "Fail to get all appoiments"
        }
    }
};

export const getAllSlotes = async (req: Request, res: Response) => {
    try {
        const availableSlots = await prisma.doctorSlot.findMany({
            where: {
                isBooked: false,
            }
        });

        if (availableSlots) {
            return res.status(200).json({
                "success": true,
                "slotes": availableSlots,
            })
        } else {
            return res.status(200).json({
                "success": false,
                "slotes": [],
            })
        }

    } catch (e) {
        console.error(e);
        return {
            "success": false,
            "message": "Fail to get all slotes"
        }
    }
};
