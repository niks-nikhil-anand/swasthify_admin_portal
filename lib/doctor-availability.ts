export interface GeneratedSlot {
    startMinutes: number;
    endMinutes: number;
    label: string;
}

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
