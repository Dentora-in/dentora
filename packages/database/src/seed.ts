import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Generate unique emails with timestamps to avoid conflicts
  const timestamp = Date.now();

  // -----------------------------------------
  // 1. USERS - Always create new ones
  // -----------------------------------------
  const adminUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: `Admin User ${timestamp}`,
      email: `admin${timestamp}@example.com`,
      role: "ADMIN",
      password: "admin123",
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: `John Patient ${timestamp}`,
      email: `patient${timestamp}@example.com`,
      role: "PATIENT",
      password: "patient123",
    },
  });

  const doctorUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: `Dr. Alice ${timestamp}`,
      email: `doctor${timestamp}@example.com`,
      role: "DOCTOR",
      password: "doctor123",
    },
  });

  console.log(`✅ Created ${3} new users`);

  // -----------------------------------------
  // 2. DOCTOR PROFILE - Always create new
  // -----------------------------------------
  const doctor = await prisma.doctor.create({
    data: {
      id: randomUUID(),
      userId: doctorUser.id,
      firstName: "Alice",
      lastName: "Williams",
      specialization: "Cardiology",
      experienceYears: 12,
      place: "City Hospital",
      phoneNo: `+123456789${timestamp % 10000}`,
      email: `alice.williams${timestamp}@hospital.com`,
    },
  });

  console.log(`✅ Created doctor profile`);

  // -----------------------------------------
  // 3. DOCTOR AVAILABILITY - Multiple new entries
  // -----------------------------------------
  const availabilities = [
    {
      dayOfWeek: 1, // Monday
      startTime: new Date(`2025-12-${(timestamp % 28) + 1}T09:00:00`),
      endTime: new Date(`2025-12-${(timestamp % 28) + 1}T12:00:00`),
    },
    {
      dayOfWeek: 3, // Wednesday
      startTime: new Date(`2025-12-${(timestamp % 28) + 1}T14:00:00`),
      endTime: new Date(`2025-12-${(timestamp % 28) + 1}T18:00:00`),
    },
    {
      dayOfWeek: 5, // Friday
      startTime: new Date(`2025-12-${(timestamp % 28) + 3}T10:00:00`),
      endTime: new Date(`2025-12-${(timestamp % 28) + 3}T13:00:00`),
    },
  ];

  for (const a of availabilities) {
    await prisma.doctorAvailability.create({
      data: {
        id: randomUUID(),
        doctorId: doctor.id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      },
    });
  }

  console.log(`✅ Created ${availabilities.length} new availabilities`);

  // -----------------------------------------
  // 4. DOCTOR SLOTS - Generate 10 new slots each run
  // -----------------------------------------
  const slotDates = [
    new Date(`2025-12-${(timestamp % 25) + 5}`),
    new Date(`2025-12-${(timestamp % 25) + 7}`),
    new Date(`2025-12-${(timestamp % 25) + 9}`),
  ];

  const slotsPerDay = 4;
  let slotCount = 0;

  for (const date of slotDates) {
    for (let i = 0; i < slotsPerDay; i++) {
      const startHour = 9 + Math.floor(i / 2);
      const startMinute = (i % 2) * 30;
      
      await prisma.doctorSlot.create({
        data: {
          id: randomUUID(),
          doctorId: doctor.id,
          date: date,
          startTime: new Date(date.setHours(startHour, startMinute, 0, 0)),
          endTime: new Date(date.setHours(startHour, startMinute + 30, 0, 0)),
        },
      });
      slotCount++;
    }
  }

  console.log(`✅ Created ${slotCount} new slots`);

  // -----------------------------------------
  // 5. SAMPLE APPOINTMENTS - 2 new ones
  // -----------------------------------------
  const firstSlot = await prisma.doctorSlot.findFirst({
    where: { doctorId: doctor.id, isBooked: false },
    orderBy: { createdAt: 'asc' },
  });

  if (firstSlot) {
    await prisma.appointment.create({
      data: {
        id: randomUUID(),
        firstName: "Jane",
        lastName: `Doe ${timestamp}`,
        age: 32,
        gender: "female",
        phoneNo: `+987654321${timestamp % 100}`,
        email: `jane${timestamp}@example.com`,
        appointmentDate: firstSlot.startTime,
        notes: "Routine checkup",
        doctorId: doctor.id,
        slotId: firstSlot.id,
        status: "PENDING",
      },
    });
  }

  console.log(`✅ Created sample appointment`);

  console.log("🌿 Seed completed successfully!");
  console.log(`📊 Total new records: Users(${3}), Doctor(1), Availability(${availabilities.length}), Slots(${slotCount}), Appointment(1)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
