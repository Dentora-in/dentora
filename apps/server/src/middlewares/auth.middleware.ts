import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders, getSession } from "@dentora/auth/client";

export interface userSessionType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}

declare global {
    namespace Express {
        interface Request {
            user?: userSessionType
        }
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(">>>>>>>>>>>>>>>>.req.headers", req.headers);
    try {
        const session = await getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session.data === null || session.error) {
            return res.status(session.error.status).json({
                error: session.error
            });
        }

        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = session.user;
        next();

    } catch (e) {
        console.error("Auth error:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default authMiddleware;
