import { Prisma, prisma, UserRole } from "@dentora/database";
import { Request, Response } from "express";

export const getControlCenterDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const pageQuery = Number(req.query.page ?? 1);
    const limitQuery = Number(req.query.limit ?? 10);

    const sortQuery = Object.values(UserRole).includes(
      req.query.sort as UserRole,
    )
      ? (req.query.sort as UserRole)
      : undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin_details = await prisma.user.findUnique({
      where: {
        id: user.id,
        role: UserRole.ADMIN,
      },
    });

    if (!admin_details) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // sanitize pagination
    const page =
      Number.isFinite(pageQuery) && pageQuery > 0 ? Math.floor(pageQuery) : 1;

    const limit =
      Number.isFinite(limitQuery) && limitQuery > 0
        ? Math.min(Math.floor(limitQuery), 100)
        : 10;

    const where: Prisma.UserWhereInput = {};

    if (sortQuery) {
      where.role = sortQuery;
    }

    // counts
    const [total, total_users, total_doctors] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.DOCTOR } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      meta_data: {
        totalPages,
        page,
        limit,
        total,
        total_users,
        total_doctors,
      },
      users,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
