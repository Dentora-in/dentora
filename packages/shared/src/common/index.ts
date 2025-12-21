import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const isDevelopmentMode = NODE_ENV === "dev";

export const getWeekStartAndEnd = (date: Date) => {
  const base = new Date(date);

  const day = base.getDay();

  const startOfWeek = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() - day,
    0,
    0,
    0,
    0,
  );

  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6,
    23,
    59,
    59,
    999,
  );

  return { startOfWeek, endOfWeek };
};

export const generateTimeSlots = (
  date: Date,
  startTime: Date,
  endTime: Date,
  slotMinutes: number,
) => {
  const slots = [];

  let current = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime.getHours(),
    startTime.getMinutes(),
  );

  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endTime.getHours(),
    endTime.getMinutes(),
  );

  while (current < end) {
    const slotEnd = new Date(current);
    slotEnd.setMinutes(slotEnd.getMinutes() + slotMinutes);

    if (slotEnd > end) break;

    slots.push({
      date,
      startTime: new Date(current),
      endTime: slotEnd,
    });

    current = slotEnd;
  }

  return slots;
};
