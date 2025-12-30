import { Prisma, prisma, UserRole } from "@dentora/database";
import { editControlCenterSchema } from "@dentora/shared/zod";
import { Request, Response } from "express";

export const getControlCenterDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const pageQuery = Number(req.query.page ?? 1);
    const limitQuery = Number(req.query.limit ?? 10);

    const roleQuery = Object.values(UserRole).includes(
      req.query.role as UserRole,
    )
      ? (req.query.role as UserRole)
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

    if (roleQuery) {
      where.role = roleQuery;
    }

    // counts
    const [total, total_users, total_doctors, total_patients, total_admins] =
      await prisma.$transaction([
        prisma.user.count({ where }),
        prisma.user.count(),
        prisma.user.count({ where: { role: UserRole.DOCTOR } }),
        prisma.user.count({ where: { role: UserRole.PATIENT } }),
        prisma.user.count({ where: { role: UserRole.ADMIN } }),
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
        total_patients,
        total_admins,
      },
      users,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const editControlCenterDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin = await prisma.user.findUnique({
      where: { id: user.id, role: UserRole.ADMIN },
      select: { id: true },
    });

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = editControlCenterSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { ids, role } = parsed.data;
    const userIds = ids.map((i) => i.id);

    const updatedUsers = await prisma.$transaction(async (tx) => {
      const existing = await tx.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, role: true },
      });

      const newDoctors =
        role === UserRole.DOCTOR
          ? existing.filter((u) => u.role !== UserRole.DOCTOR)
          : [];

      const users = await tx.user.updateManyAndReturn({
        where: { id: { in: userIds } },
        data: { role },
      });

      if (newDoctors.length > 0) {
        await tx.doctor.createMany({
          data: newDoctors.map((u) => ({
            userId: u.id,
            firstName: "",
            lastName: "",
            phoneNo: "",
          })),
          skipDuplicates: true,
        });
      }

      return users;
    });

    return res.json({
      success: true,
      message: "Users updated successfully",
      data: updatedUsers,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
