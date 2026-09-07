import { db } from "@/lib/db";

export const RESERVATION_TIMEOUT_MINUTES = 15;
export const BLOCKING_APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED", "RESCHEDULED"] as const;

export function getReservationThreshold(now = new Date()) {
    return new Date(now.getTime() - RESERVATION_TIMEOUT_MINUTES * 60 * 1000);
}

export function isExpiredPendingAppointment(createdAt: Date, now = new Date()) {
    return createdAt < getReservationThreshold(now);
}

export function isBlockingAppointment(status: string, createdAt: Date, now = new Date()) {
    if (status === "CANCELLED" || status === "COMPLETED") return false;
    if (status === "PENDING" && isExpiredPendingAppointment(createdAt, now)) return false;
    return (BLOCKING_APPOINTMENT_STATUSES as readonly string[]).includes(status);
}

export async function releasePendingAppointment(appointmentId: string, reason: string) {
    return db.appointment.updateMany({
        where: { id: appointmentId, status: "PENDING" },
        data: {
            status: "CANCELLED",
            cancelledBy: "SYSTEM",
            cancellationReason: reason,
            cancelledAt: new Date(),
        },
    });
}
