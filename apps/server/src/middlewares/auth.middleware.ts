import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "@dentora/auth/client";
import { auth } from "@dentora/auth/auth";

export interface userSessionType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: userSessionType;
    }
  }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

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
