import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlots, getDateBounds, getDayOfWeek, parseTimeToMinutes } from "@/lib/doctor-availability";

const BLOCKING_STATUSES = ["PENDING", "CONFIRMED", "RESCHEDULED"] as const;

function getCampaignSchedule(schedule: unknown, dayOfWeek: string) {
    if (!schedule || typeof schedule !== "object") return null;
    const value = schedule as { days?: unknown; startTime?: unknown; endTime?: unknown };
    const days = Array.isArray(value.days) ? value.days.map(String).map((day) => day.toUpperCase()) : [];
    if (!days.includes(dayOfWeek) || typeof value.startTime !== "string" || typeof value.endTime !== "string") return null;
    return { startTime: value.startTime, endTime: value.endTime };
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const date = new URL(req.url).searchParams.get("date");
        if (!id || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: "A valid campaign ID and date are required" }, { status: 400 });
        }

        const campaign = await db.campaign.findFirst({
            where: { id, status: "ACTIVE", isVerified: true, doctorId: { not: null } },
            include: {
                doctor: {
                    include: {
                        availability: true,
                        leaves: true,
                    },
                },
            },
        });

        if (!campaign?.doctor) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

        const { start, end } = getDateBounds(date);
        const campaignStart = new Date(campaign.startDate);
        const campaignEnd = new Date(campaign.endDate);
        const dayOfWeek = getDayOfWeek(date);
        const inCampaignWindow = start <= campaignEnd && end >= campaignStart;
        const onLeave = campaign.doctor.leaves.some((leave) => new Date(leave.startDate) <= end && new Date(leave.endDate) >= start);

        if (!inCampaignWindow || onLeave) {
            return NextResponse.json({ date, available: false, reason: onLeave ? "DOCTOR_ON_LEAVE" : "OUTSIDE_CAMPAIGN", slots: [] });
        }

        const persistedSchedules = campaign.doctor.availability
            .filter((availability) => availability.dayOfWeek === dayOfWeek)
            .map((availability) => ({ startTime: availability.startTime, endTime: availability.endTime }));
        const schedules = persistedSchedules.length > 0
            ? persistedSchedules
            : [getCampaignSchedule(campaign.schedule, dayOfWeek)].filter((schedule): schedule is { startTime: string; endTime: string } => Boolean(schedule));

        if (schedules.length === 0) {
            return NextResponse.json({ date, available: false, reason: "NO_SCHEDULE", slots: [] });
        }

        const appointments = await db.appointment.findMany({
            where: { doctorId: campaign.doctor.id, dateTime: { gte: start, lte: end }, status: { in: [...BLOCKING_STATUSES] } },
            select: { dateTime: true, duration: true },
        });
        const occupiedMinutes = new Set(appointments.map((appointment) => {
            const time = new Date(appointment.dateTime);
            return time.getUTCHours() * 60 + time.getUTCMinutes();
        }));

        const slots = schedules.flatMap((schedule) => generateSlots(schedule.startTime, schedule.endTime, 30))
            .filter((slot) => parseTimeToMinutes(slot.label.split(" - ")[0]) !== null)
            .map((slot) => ({
                ...slot,
                status: occupiedMinutes.has(slot.startMinutes) ? "BOOKED" : "AVAILABLE",
            }));

        return NextResponse.json({
            date,
            timeZone: campaign.doctor.timeZone,
            available: slots.some((slot) => slot.status === "AVAILABLE"),
            reason: slots.length === 0 ? "NO_SLOTS" : null,
            slots,
        });
    } catch (error) {
        console.error("[PUBLIC_CAMPAIGN_AVAILABILITY_GET]", error);
        return NextResponse.json({ error: "Unable to load availability" }, { status: 500 });
    }
}
