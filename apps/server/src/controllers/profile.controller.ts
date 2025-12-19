import { prisma } from "@dentora/database";
import { Request, Response } from "express";

export const getProfileDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Please login or provide user ID" });
    }

    // TODO : @anmole - only doctor role can get profile
    const profile_details = await prisma.doctor.findUnique({
      where: { id: userId },
    });

    if (!profile_details) {
      return res
        .status(401)
        .json({ message: "Profile not found. check with the owner!" });
    }

    return res.status(200).json({
      success: true,
      profile_details: {
        first_name: profile_details.firstName,
        last_name: profile_details.lastName,
        specialization: profile_details.specialization,
        experienceYears: profile_details.experienceYears,
        place: profile_details.place,
        phoneNo: profile_details.phoneNo,
        email: profile_details.email,
        created_at: profile_details.createdAt,
        updated_at: profile_details.updatedAt,
      },
    });
  } catch (e: any) {
    console.error("Error fetching slots:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to get all slots",
    });
  }
};

export const editProfileDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      first_name,
      last_name,
      specialization,
      experienceYears,
      place,
      phoneNo,
      email,
    } = req.body;

    // Build update object (only defined fields)
    const updateData = {
      ...(first_name && { firstName: first_name }),
      ...(last_name && { lastName: last_name }),
      ...(specialization && { specialization }),
      ...(experienceYears !== undefined && { experienceYears }),
      ...(place && { place }),
      ...(phoneNo && { phoneNo }),
      ...(email && { email }),
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    // TODO : @anmole - only doctor role can edit profile
    const updatedDoctor = await prisma.doctor.update({
      where: {
        userId,
      },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      profile_details: {
        first_name: updatedDoctor.firstName,
        last_name: updatedDoctor.lastName,
        specialization: updatedDoctor.specialization,
        experienceYears: updatedDoctor.experienceYears,
        place: updatedDoctor.place,
        phoneNo: updatedDoctor.phoneNo,
        email: updatedDoctor.email,
        created_at: updatedDoctor.createdAt,
        updated_at: updatedDoctor.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
