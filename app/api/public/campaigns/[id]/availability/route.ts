import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateDoctorAvailability, getDateBounds } from "@/lib/doctor-availability";

const APPOINTMENT_STATUSES_TO_CHECK = ["PENDING", "CONFIRMED", "RESCHEDULED"] as const;

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

        const appointments = await db.appointment.findMany({
            where: { doctorId: campaign.doctor.id, dateTime: { gte: start, lte: end }, status: { in: [...APPOINTMENT_STATUSES_TO_CHECK] } },
            select: { dateTime: true, status: true, createdAt: true },
        });

        const availability = calculateDoctorAvailability({
            date,
            campaignStartDate: campaign.startDate,
            campaignEndDate: campaign.endDate,
            campaignSchedule: campaign.schedule,
            doctorSchedules: campaign.doctor.availability.map((availability) => ({
                dayOfWeek: availability.dayOfWeek,
                startTime: availability.startTime,
                endTime: availability.endTime,
            })),
            doctorLeaves: campaign.doctor.leaves,
            existingAppointments: appointments,
            timeZone: campaign.doctor.timeZone,
        });

        return NextResponse.json({
            date,
            timeZone: campaign.doctor.timeZone,
            ...availability,
        });
    } catch (error) {
        console.error("[PUBLIC_CAMPAIGN_AVAILABILITY_GET]", error);
        return NextResponse.json({ error: "Unable to load availability" }, { status: 500 });
    }
}
