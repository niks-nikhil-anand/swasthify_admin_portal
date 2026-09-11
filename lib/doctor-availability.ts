export interface GeneratedSlot {
    startMinutes: number;
    endMinutes: number;
    label: string;
}

export type AvailabilityReason =
    | "OUTSIDE_CAMPAIGN"
    | "OUTSIDE_CAMPAIGN_SCHEDULE"
    | "DOCTOR_ON_LEAVE"
    | "NO_DOCTOR_AVAILABILITY"
    | "NO_CAMPAIGN_SCHEDULE"
    | "NO_FUTURE_SLOTS"
    | "NO_SLOTS"
    | null;

export interface AvailabilitySchedule {
    dayOfWeek?: string;
    startTime: string;
    endTime: string;
}

export interface AvailabilityLeave {
    startDate: Date | string;
    endDate: Date | string;
}

export interface ExistingAppointmentSlot {
    dateTime: Date | string;
    status: string;
    createdAt?: Date | string;
}

export interface CalculatedAvailability {
    available: boolean;
    reason: AvailabilityReason;
    slots: Array<GeneratedSlot & { status: "AVAILABLE" | "BOOKED" }>;
}

const DEFAULT_APPOINTMENT_TIME_ZONE = "Asia/Kolkata";

export function parseTimeToMinutes(value: string) {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3]?.toUpperCase();
    if (minutes > 59 || hours > 23) return null;
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

export function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(mins).padStart(2, "0")} ${period}`;
}

export function generateSlots(startTime: string, endTime: string, duration = 30): GeneratedSlot[] {
    const start = parseTimeToMinutes(startTime);
    const end = parseTimeToMinutes(endTime);
    if (start === null || end === null || end <= start || duration <= 0) return [];

    const slots: GeneratedSlot[] = [];
    for (let cursor = start; cursor + duration <= end; cursor += duration) {
        slots.push({
            startMinutes: cursor,
            endMinutes: cursor + duration,
            label: `${formatMinutes(cursor)} - ${formatMinutes(cursor + duration)}`,
        });
    }
    return slots;
}

function generateSlotsFromMinutes(start: number, end: number, duration = 30): GeneratedSlot[] {
    if (end <= start || duration <= 0) return [];

    const slots: GeneratedSlot[] = [];
    for (let cursor = start; cursor + duration <= end; cursor += duration) {
        slots.push({
            startMinutes: cursor,
            endMinutes: cursor + duration,
            label: `${formatMinutes(cursor)} - ${formatMinutes(cursor + duration)}`,
        });
    }
    return slots;
}

export function getDayOfWeek(date: string) {
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    return ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][day];
}

export function getDateBounds(date: string) {
    return {
        start: new Date(`${date}T00:00:00.000Z`),
        end: new Date(`${date}T23:59:59.999Z`),
    };
}

function getCampaignScheduleForDay(schedule: unknown, dayOfWeek: string) {
    if (!schedule || typeof schedule !== "object") return null;
    const value = schedule as { days?: unknown; startTime?: unknown; endTime?: unknown };

    const days = Array.isArray(value.days)
        ? value.days.map(String).map((day) => day.toUpperCase())
        : [];
    if (!days.includes(dayOfWeek) || typeof value.startTime !== "string" || typeof value.endTime !== "string") {
        return null;
    }

    const startMinutes = parseTimeToMinutes(value.startTime);
    const endMinutes = parseTimeToMinutes(value.endTime);
    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null;

    return { startMinutes, endMinutes };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const zonedAsUtc = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
    );
    return zonedAsUtc - date.getTime();
}

function getSlotDateTime(date: string, startMinutes: number, timeZone: string) {
    const [year, month, day] = date.split("-").map(Number);
    const hours = Math.floor(startMinutes / 60);
    const minutes = startMinutes % 60;
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const offset = getTimeZoneOffsetMs(utcGuess, timeZone);
    return new Date(utcGuess.getTime() - offset);
}

function isBlockingAppointment(status: string, createdAt?: Date | string, now = new Date()) {
    if (status === "CANCELLED" || status === "COMPLETED") return false;
    if (status === "PENDING" && createdAt) {
        const createdAtDate = new Date(createdAt);
        const reservationThreshold = new Date(now.getTime() - 15 * 60 * 1000);
        if (createdAtDate < reservationThreshold) return false;
    }
    return ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(status);
}

export function calculateDoctorAvailability({
    date,
    campaignStartDate,
    campaignEndDate,
    campaignSchedule,
    doctorSchedules,
    doctorLeaves,
    existingAppointments,
    timeZone = DEFAULT_APPOINTMENT_TIME_ZONE,
    now = new Date(),
    slotDuration = 30,
}: {
    date: string;
    campaignStartDate: Date | string;
    campaignEndDate: Date | string;
    campaignSchedule?: unknown;
    doctorSchedules: AvailabilitySchedule[];
    doctorLeaves: AvailabilityLeave[];
    existingAppointments: ExistingAppointmentSlot[];
    timeZone?: string | null;
    now?: Date;
    slotDuration?: number;
}): CalculatedAvailability {
    const effectiveTimeZone = !timeZone || timeZone === "UTC" ? DEFAULT_APPOINTMENT_TIME_ZONE : timeZone;
    const { start, end } = getDateBounds(date);
    const dayOfWeek = getDayOfWeek(date);
    const inCampaignWindow = start <= new Date(campaignEndDate) && end >= new Date(campaignStartDate);
    if (!inCampaignWindow) {
        return { available: false, reason: "OUTSIDE_CAMPAIGN", slots: [] };
    }

    const onLeave = doctorLeaves.some((leave) => new Date(leave.startDate) <= end && new Date(leave.endDate) >= start);
    if (onLeave) {
        return { available: false, reason: "DOCTOR_ON_LEAVE", slots: [] };
    }

    const campaignScheduleForDay = getCampaignScheduleForDay(campaignSchedule, dayOfWeek);
    if (campaignSchedule && doctorSchedules.length > 0 && !campaignScheduleForDay) {
        return { available: false, reason: "OUTSIDE_CAMPAIGN_SCHEDULE", slots: [] };
    }

    const doctorSchedulesForDay = doctorSchedules.filter((schedule) => !schedule.dayOfWeek || schedule.dayOfWeek === dayOfWeek);
    const schedulesForDay = doctorSchedules.length > 0
        ? doctorSchedulesForDay
        : campaignScheduleForDay
            ? [{ startTime: formatMinutes(campaignScheduleForDay.startMinutes), endTime: formatMinutes(campaignScheduleForDay.endMinutes) }]
            : [];

    if (schedulesForDay.length === 0) {
        return {
            available: false,
            reason: doctorSchedules.length > 0 ? "NO_DOCTOR_AVAILABILITY" : "NO_CAMPAIGN_SCHEDULE",
            slots: [],
        };
    }

    const baseSlots = schedulesForDay.flatMap((schedule) => {
        const doctorStart = parseTimeToMinutes(schedule.startTime);
        const doctorEnd = parseTimeToMinutes(schedule.endTime);
        if (doctorStart === null || doctorEnd === null || doctorEnd <= doctorStart) return [];

        const startMinutes = campaignScheduleForDay ? Math.max(doctorStart, campaignScheduleForDay.startMinutes) : doctorStart;
        const endMinutes = campaignScheduleForDay ? Math.min(doctorEnd, campaignScheduleForDay.endMinutes) : doctorEnd;
        return generateSlotsFromMinutes(startMinutes, endMinutes, slotDuration);
    });

    const futureSlots = baseSlots.filter((slot) => getSlotDateTime(date, slot.startMinutes, effectiveTimeZone) > now);
    if (baseSlots.length > 0 && futureSlots.length === 0) {
        return { available: false, reason: "NO_FUTURE_SLOTS", slots: [] };
    }

    const occupiedMinutes = new Set(existingAppointments
        .filter((appointment) => isBlockingAppointment(appointment.status, appointment.createdAt, now))
        .map((appointment) => {
            const time = new Date(appointment.dateTime);
            return time.getUTCHours() * 60 + time.getUTCMinutes();
        }));

    const slots = futureSlots.map((slot) => ({
        ...slot,
        status: occupiedMinutes.has(slot.startMinutes) ? "BOOKED" as const : "AVAILABLE" as const,
    }));

    return {
        available: slots.some((slot) => slot.status === "AVAILABLE"),
        reason: slots.length === 0 ? "NO_SLOTS" : null,
        slots,
    };
}
