import { Request, Response, NextFunction } from "express";

export const getAllAppointments = (req: Request, res: Response) => {
    res.json({ message: "All appointments" });
};