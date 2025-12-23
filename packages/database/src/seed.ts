// packages/database/src/seed.ts
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Default hashed password for all users - Doctor@1234
const DEFAULT_PASSWORD =
  "40728939fdbc413fa0ab053b927020a7:df51032f4c60a4fecb20df1e843f219ff03be3a0df8f2eba9dc544fec341f1baf0a7e6ef99f619cf9d700f521ee2d5f9871f5e8dab20da65b624386754029da4";

// Days of the week
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Helper to get a future date for appointments
 */
function getFutureDate(daysFromNow: number, hour = 9, minute = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
}

/**
 * Helper to format time as HH:MM
 */
function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

async function main() {
  console.log("🌱 Starting seed");

  const timestamp = Date.now();
  const seed = Math.floor(timestamp / 1000);

  try {
    // ---------- USERS ----------
    console.log("📝 Creating users...");
    const adminEmail = `admin${seed}@example.com`;
    const patientEmail = `patient${seed}@example.com`;
    const doctorEmail = `doctor${seed}@example.com`;

    const [adminUser, patientUser, doctorUser] = await Promise.all([
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: `Admin User`,
          email: adminEmail,
          role: "ADMIN",
          password: DEFAULT_PASSWORD,
          emailVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: `John Patient`,
          email: patientEmail,
          role: "PATIENT",
          password: DEFAULT_PASSWORD,
          emailVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: `Dr. Alice Williams`,
          email: doctorEmail,
          role: "DOCTOR",
          password: DEFAULT_PASSWORD,
          emailVerified: true,
        },
      }),
    ]);

    console.log(
      `✅ Users created: ${adminUser.email}, ${patientUser.email}, ${doctorUser.email}`,
    );

    // ---------- SESSIONS ----------
    console.log("📝 Creating sessions...");
    const [session1, session2] = await Promise.all([
      prisma.session.create({
        data: {
          id: randomUUID(),
          userId: patientUser.id,
          token: randomUUID(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: "127.0.0.1",
          userAgent: "seed-script",
        },
      }),
      prisma.session.create({
        data: {
          id: randomUUID(),
          userId: doctorUser.id,
          token: randomUUID(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: "127.0.0.2",
          userAgent: "seed-script",
        },
      }),
    ]);
    console.log(`✅ Sessions created: ${session1.id}, ${session2.id}`);

    // ---------- CREDENTIAL ACCOUNTS ----------
    console.log("📝 Creating credential accounts...");
    const credentialAccounts = await Promise.all([
      prisma.account.create({
        data: {
          id: randomUUID(),
          userId: adminUser.id,
          accountId: adminEmail,
          providerId: "credentials",
          password: DEFAULT_PASSWORD,
        },
      }),
      prisma.account.create({
        data: {
          id: randomUUID(),
          userId: patientUser.id,
          accountId: patientEmail,
          providerId: "credentials",
          password: DEFAULT_PASSWORD,
        },
      }),
      prisma.account.create({
        data: {
          id: randomUUID(),
          userId: doctorUser.id,
          accountId: doctorEmail,
          providerId: "credentials",
          password: DEFAULT_PASSWORD,
        },
      }),
    ]);
    console.log(
      `✅ Credential accounts created: ${credentialAccounts.length} accounts`,
    );

    // ---------- VERIFICATIONS ----------
    console.log("📝 Creating verifications...");
    const [verification1, verification2] = await Promise.all([
      prisma.verification.create({
        data: {
          id: randomUUID(),
          identifier: patientEmail,
          value: randomUUID(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      }),
      prisma.verification.create({
        data: {
          id: randomUUID(),
          identifier: doctorEmail,
          value: randomUUID(),
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      }),
    ]);
    console.log(`✅ Verifications created: 2 verifications`);

    // ---------- DOCTOR PROFILE ----------
    console.log("📝 Creating doctor profile...");
    const doctorProfile = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        firstName: "Alice",
        lastName: "Williams",
        specialization: "General Dentistry",
        experienceYears: 12,
        place: "City Dental Clinic",
        phoneNo: "+1234567890",
        email: doctorEmail,
      },
    });
    console.log(`✅ Doctor profile created: ${doctorProfile.id}`);

    // ---------- DOCTOR AVAILABILITY ----------
    console.log("📝 Creating doctor availability...");
    // Note: Schema has unique constraint on (doctorId, dayOfWeek)
    // So we can only have ONE availability record per day
    const availabilityData = [
      { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: "Tuesday", startTime: "09:00", endTime: "12:00" },
      { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "18:00" },
      { dayOfWeek: "Thursday", startTime: "09:00", endTime: "12:00" },
      { dayOfWeek: "Friday", startTime: "09:00", endTime: "13:00" },
    ];

    const createdAvailabilities = await Promise.all(
      availabilityData.map((a) =>
        prisma.doctorAvailability.create({
          data: {
            doctorId: doctorProfile.id,
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          },
        }),
      ),
    );
    console.log(`✅ Created ${createdAvailabilities.length} availabilities`);

    // ---------- DOCTOR SLOTS ----------
    console.log("📝 Creating doctor slots...");
    const slots: Array<{
      date: Date;
      startTime: Date;
      endTime: Date;
    }> = [];

    // Generate slots for the next 14 days
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const slotDate = getFutureDate(dayOffset, 0, 0);
      const dayName = DAYS_OF_WEEK[slotDate.getDay()];

      // Find availability for this day
      const dayAvailability = availabilityData.filter(
        (a) => a.dayOfWeek === dayName,
      );

      // Create 30-minute slots for each availability period
      for (const avail of dayAvailability) {
        const [startHour, startMin] = avail.startTime.split(":").map(Number);
        const [endHour, endMin] = avail.endTime.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        // Create 30-minute slots
        for (
          let currentMin = startMinutes;
          currentMin < endMinutes;
          currentMin += 30
        ) {
          const slotStartHour = Math.floor(currentMin / 60);
          const slotStartMin = currentMin % 60;
          const slotEndMin = currentMin + 30;
          const slotEndHour = Math.floor(slotEndMin / 60);
          const slotEndMinute = slotEndMin % 60;

          const startTime = getFutureDate(
            dayOffset,
            slotStartHour,
            slotStartMin,
          );
          const endTime = getFutureDate(dayOffset, slotEndHour, slotEndMinute);

          slots.push({
            date: slotDate,
            startTime,
            endTime,
          });
        }
      }
    }

    // Create all slots in the database
    const createdSlots = await Promise.all(
      slots.map((slot) =>
        prisma.doctorSlot.create({
          data: {
            doctorId: doctorProfile.id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          },
        }),
      ),
    );
    console.log(`✅ Created ${createdSlots.length} slots`);

    // ---------- APPOINTMENTS ----------
    console.log("📝 Creating appointments...");
    let appointmentCount = 0;

    // Create a few sample appointments with the doctor
    if (createdSlots.length >= 3) {
      // Appointment 1 - Pending
      const slot1 = createdSlots[0];
      await prisma.appointment.create({
        data: {
          firstName: "Jane",
          lastName: "Doe",
          age: 32,
          gender: "female",
          phoneCountry: "+1",
          phoneNo: "9876543210",
          email: `jane.doe${seed}@example.com`,
          appointmentDate: slot1.startTime,
          notes: "Routine dental checkup",
          doctorId: doctorProfile.id,
          slotId: slot1.id,
          status: "PENDING",
          userId: patientUser.id,
        },
      });
      await prisma.doctorSlot.update({
        where: { id: slot1.id },
        data: { isBooked: true },
      });
      appointmentCount++;

      // Appointment 2 - Confirmed
      const slot2 = createdSlots[1];
      await prisma.appointment.create({
        data: {
          firstName: "Bob",
          lastName: "Smith",
          age: 45,
          gender: "male",
          phoneCountry: "+1",
          phoneNo: "1112223344",
          email: `bob.smith${seed}@example.com`,
          appointmentDate: slot2.startTime,
          notes: "Tooth cleaning",
          doctorId: doctorProfile.id,
          slotId: slot2.id,
          status: "CONFIRMED",
          verified: true,
          meetLink: `https://meet.example.com/${randomUUID()}`,
          userId: patientUser.id,
        },
      });
      await prisma.doctorSlot.update({
        where: { id: slot2.id },
        data: { isBooked: true },
      });
      appointmentCount++;

      // Appointment 3 - Completed
      const slot3 = createdSlots[2];
      await prisma.appointment.create({
        data: {
          firstName: "Charlie",
          lastName: "Brown",
          age: 28,
          gender: "male",
          phoneCountry: "+1",
          phoneNo: "4445556677",
          email: `charlie.brown${seed}@example.com`,
          appointmentDate: slot3.startTime,
          notes: "Cavity filling",
          doctorId: doctorProfile.id,
          slotId: slot3.id,
          status: "COMPLETED",
          verified: true,
          userId: patientUser.id,
        },
      });
      await prisma.doctorSlot.update({
        where: { id: slot3.id },
        data: { isBooked: true },
      });
      appointmentCount++;
    }

    // Create one appointment without a slot (walk-in)
    await prisma.appointment.create({
      data: {
        firstName: "David",
        lastName: "Wilson",
        age: 35,
        gender: "male",
        phoneCountry: "+1",
        phoneNo: "7778889900",
        email: `david.wilson${seed}@example.com`,
        appointmentDate: getFutureDate(5, 10, 0),
        notes: "Emergency consultation",
        doctorId: doctorProfile.id,
        status: "PENDING",
        userId: patientUser.id,
      },
    });
    appointmentCount++;

    console.log(`✅ Created ${appointmentCount} appointments`);
    console.log("\n🌿 Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: 3 (1 admin, 1 patient, 1 doctor)`);
    console.log(
      `   - Doctor: ${doctorProfile.firstName} ${doctorProfile.lastName}`,
    );
    console.log(`   - Availabilities: ${createdAvailabilities.length}`);
    console.log(`   - Slots: ${createdSlots.length}`);
    console.log(`   - Appointments: ${appointmentCount}`);
    console.log("\n🔑 Login credentials:");
    console.log(`   Doctor: ${doctorEmail} / Doctor@1234`);
    console.log(`   Patient: ${patientEmail} / Doctor@1234`);
    console.log(`   Admin: ${adminEmail} / Doctor@1234`);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("\n✅ Done seeding.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Uncaught seed error:", e);
    process.exit(1);
  });
