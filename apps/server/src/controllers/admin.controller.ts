import { prisma } from "@dentora/database";
import { Request, Response } from "express";

export const getControlCenterDetails = async (req: Request, res: Response) => {
  try {
    const admin = req.user;

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized admin" });
    }

    const users = await prisma.user.findMany({
      take: 20,
    });
  } catch (error) {}
};
