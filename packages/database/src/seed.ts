// packages/database/src/seed.ts
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

/**
 * Helpers
 */
const YEAR = 2025;
const MONTH_ZERO_INDEXED = 11; // 11 = December

function buildDate(day: number, hour = 9, minute = 0): Date {
  return new Date(YEAR, MONTH_ZERO_INDEXED, day, hour, minute, 0, 0);
}

function safeDay(seed: number, offset = 0): number {
  return ((seed % 28) + offset) % 28 + 1;
}

// Default hashed password for all users and accounts - Doctor@1234
const DEFAULT_PASSWORD =
  "40728939fdbc413fa0ab053b927020a7:df51032f4c60a4fecb20df1e843f219ff03be3a0df8f2eba9dc544fec341f1baf0a7e6ef99f619cf9d700f521ee2d5f9871f5e8dab20da65b624386754029da4";

async function main() {
  console.log("🌱 Starting seed");

  const timestamp = Date.now();
  const seed = Math.floor(timestamp / 1000);

  const createUser = async (data: {
    name: string;
    email: string;
    role?: "PATIENT" | "DOCTOR" | "ADMIN";
    password?: string | null;
    image?: string | null;
  }) => {
    const id = randomUUID();
    return prisma.user.create({
      data: {
        id,
        name: data.name,
        email: data.email,
        role: data.role ?? "PATIENT",
        password: data.password ?? DEFAULT_PASSWORD,
        image: data.image ?? null,
      },
    });
  };

  try {
    // ---------- USERS ----------
    const adminEmail = `admin${seed}@example.com`;
    const patientEmail = `patient${seed}@example.com`;
    const doctorEmail = `doctor${seed}@example.com`;

    const [adminUser, patientUser, doctorUser] = await Promise.all([
      createUser({ name: `Admin User ${seed}`, email: adminEmail, role: "ADMIN", password: DEFAULT_PASSWORD }),
      createUser({ name: `John Patient ${seed}`, email: patientEmail, role: "PATIENT", password: DEFAULT_PASSWORD }),
      createUser({ name: `Dr. Alice ${seed}`, email: doctorEmail, role: "DOCTOR", password: DEFAULT_PASSWORD }),
    ]);

    console.log(`✅ Users created: ${adminUser.email}, ${patientUser.email}, ${doctorUser.email}`);

    // ---------- SESSIONS ----------
    const session1 = await prisma.session.create({
      data: {
        id: randomUUID(),
        userId: patientUser.id,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: "127.0.0.1",
        userAgent: "seed-script",
      },
    });
    const session2 = await prisma.session.create({
      data: {
        id: randomUUID(),
        userId: adminUser.id,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: "127.0.0.2",
        userAgent: "seed-script",
      },
    });
    console.log(`✅ Sessions created: ${session1.id}, ${session2.id}`);

    // ---------- CREDENTIAL ACCOUNTS ----------
    const credentialAccounts = await Promise.all([
      prisma.account.create({ data: { id: randomUUID(), userId: adminUser.id, accountId: adminEmail, providerId: "credentials", password: DEFAULT_PASSWORD } }),
      prisma.account.create({ data: { id: randomUUID(), userId: patientUser.id, accountId: patientEmail, providerId: "credentials", password: DEFAULT_PASSWORD } }),
      prisma.account.create({ data: { id: randomUUID(), userId: doctorUser.id, accountId: doctorEmail, providerId: "credentials", password: DEFAULT_PASSWORD } }),
    ]);
    console.log(`✅ Credential accounts created: ${credentialAccounts.map(a => a.id).join(", ")}`);

    // ---------- VERIFICATIONS ----------
    const verification1 = await prisma.verification.create({
      data: { id: randomUUID(), identifier: patientEmail, value: randomUUID(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    const verification2 = await prisma.verification.create({
      data: { id: randomUUID(), identifier: doctorEmail, value: randomUUID(), expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
    });
    console.log(`✅ Verifications created: ${verification1.id}, ${verification2.id}`);

    // ---------- DOCTOR PROFILE ----------
    const doctorProfile = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        firstName: "Alice",
        lastName: "Williams",
        specialization: "Cardiology",
        experienceYears: 12,
        place: "City Hospital",
        phoneNo: `+1234567${String(seed).slice(-4)}`,
        email: `alice.williams${seed}@hospital.com`,
      },
    });
    console.log(`✅ Doctor profile created: ${doctorProfile.id}`);

    // ---------- DOCTOR AVAILABILITY ----------
    const baseDay = safeDay(seed, 1);
    const availabilityData = [
      { dayOfWeek: 1, start: buildDate(baseDay, 9), end: buildDate(baseDay, 12) },
      { dayOfWeek: 3, start: buildDate(baseDay + 1, 14), end: buildDate(baseDay + 1, 18) },
      { dayOfWeek: 5, start: buildDate(baseDay + 2, 10), end: buildDate(baseDay + 2, 13) },
    ];
    const createdAvailabilities = [];
    for (const a of availabilityData) {
      const created = await prisma.doctorAvailability.create({
        data: { doctorId: doctorProfile.id, dayOfWeek: a.dayOfWeek, startTime: a.start, endTime: a.end },
      });
      createdAvailabilities.push(created);
    }
    console.log(`✅ Created ${createdAvailabilities.length} availabilities`);

    // ---------- DOCTOR SLOTS ----------
    const slotDays = [safeDay(seed, 3), safeDay(seed, 5), safeDay(seed, 7)];
    const slotsPerDay = 4;
    const createdSlots: string[] = [];

    for (const day of slotDays) {
      for (let i = 0; i < slotsPerDay; i++) {
        const startHour = 9 + Math.floor(i / 2);
        const startMinute = (i % 2) * 30;
        const startTime = buildDate(day, startHour, startMinute);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        const slot = await prisma.doctorSlot.create({
          data: { doctorId: doctorProfile.id, date: buildDate(day, 0, 0), startTime, endTime },
        });
        createdSlots.push(slot.id);
      }
    }
    console.log(`✅ Created ${createdSlots.length} slots`);

    // ---------- APPOINTMENTS ----------
    let appointmentCount = 0;

    if (createdSlots.length > 0) {
      const slotId = createdSlots[0];
      const slotObj = await prisma.doctorSlot.findUnique({ where: { id: slotId } });
      const appointmentDate = slotObj?.startTime ?? buildDate(safeDay(seed, 10), 9);

      await prisma.appointment.create({
        data: {
          firstName: "Jane",
          lastName: `Doe ${seed}`,
          age: 32,
          gender: "female",
          phoneNo: `+9876543${String(seed).slice(-2)}`,
          email: `jane${seed}@example.com`,
          appointmentDate,
          notes: "Routine checkup",
          doctorId: doctorProfile.id,
          slotId,
          status: "PENDING",
          userId: patientUser.id,
        },
      });
      await prisma.doctorSlot.update({ where: { id: slotId }, data: { isBooked: true } });
      appointmentCount++;
    }

    if (createdSlots.length > 1) {
      const slotId = createdSlots[1];
      const slotObj = await prisma.doctorSlot.findUnique({ where: { id: slotId } });
      const appointmentDate = slotObj?.startTime ?? buildDate(safeDay(seed, 11), 10);

      await prisma.appointment.create({
        data: {
          firstName: "Bob",
          lastName: `Smith ${seed}`,
          age: 45,
          gender: "male",
          phoneNo: `+1112223${String(seed).slice(-2)}`,
          email: `bob${seed}@example.com`,
          appointmentDate,
          notes: "Follow-up appointment",
          doctorId: doctorProfile.id,
          slotId,
          status: "CONFIRMED",
          verified: true,
          meetLink: `https://meet.example.com/${seed}`,
          userId: patientUser.id,
        },
      });
      await prisma.doctorSlot.update({ where: { id: slotId }, data: { isBooked: true } });
      appointmentCount++;
    }

    await prisma.appointment.create({
      data: {
        firstName: "Charlie",
        lastName: `Brown ${seed}`,
        age: 28,
        gender: "male",
        phoneNo: `+4445556${String(seed).slice(-2)}`,
        email: `charlie${seed}@example.com`,
        appointmentDate: buildDate(safeDay(seed, 12), 14),
        notes: "General consultation",
        status: "PENDING",
        userId: patientUser.id,
      },
    });
    appointmentCount++;

    console.log(`✅ Created ${appointmentCount} appointments`);
    console.log("🌿 Seed completed!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("✅ Done seeding.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Uncaught seed error:", e);
    process.exit(1);
  });
