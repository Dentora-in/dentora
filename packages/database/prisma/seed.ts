import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // -----------------------------------------
  // 1. USERS
  // -----------------------------------------
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
      password: "admin123",
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "John Patient",
      email: "patient@example.com",
      role: "PATIENT",
      password: "patient123",
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@example.com" },
    update: {},
    create: {
      id: randomUUID(),
      name: "Dr. Alice",
      email: "doctor@example.com",
      role: "DOCTOR",
      password: "doctor123",
    },
  });

  // -----------------------------------------
  // 2. DOCTOR PROFILE
  // -----------------------------------------
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: doctorUser.id,
      firstName: "Alice",
      lastName: "Williams",
      specialization: "Cardiology",
      experienceYears: 12,
      place: "City Hospital",
      phoneNo: "+1234567890",
      email: "alice.williams@hospital.com",
    },
  });

  // -----------------------------------------
  // 3. DOCTOR AVAILABILITY
  // -----------------------------------------
  const availabilities = [
    {
      uniqueKey: "mon_morning",
      dayOfWeek: 1,
      startTime: new Date("2025-01-01T09:00:00"),
      endTime: new Date("2025-01-01T12:00:00"),
    },
    {
      uniqueKey: "wed_evening",
      dayOfWeek: 3,
      startTime: new Date("2025-01-01T14:00:00"),
      endTime: new Date("2025-01-01T18:00:00"),
    },
  ];

  for (const a of availabilities) {
    await prisma.doctorAvailability.upsert({
      where: { id: a.uniqueKey }, // using custom ID to prevent duplicates
      update: {},
      create: {
        id: a.uniqueKey,
        doctorId: doctor.id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      },
    });
  }

  // -----------------------------------------
  // 4. DOCTOR SLOTS
  // -----------------------------------------
  const slot1 = await prisma.doctorSlot.upsert({
    where: { id: "slot_1" },
    update: {},
    create: {
      id: "slot_1",
      doctorId: doctor.id,
      date: new Date("2025-01-10"),
      startTime: new Date("2025-01-10T10:00:00"),
      endTime: new Date("2025-01-10T10:30:00"),
    },
  });

  const slot2 = await prisma.doctorSlot.upsert({
    where: { id: "slot_2" },
    update: {},
    create: {
      id: "slot_2",
      doctorId: doctor.id,
      date: new Date("2025-01-10"),
      startTime: new Date("2025-01-10T10:30:00"),
      endTime: new Date("2025-01-10T11:00:00"),
    },
  });

  console.log("🌿 Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
