import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { generateSlots, getDateBounds, getDayOfWeek, parseTimeToMinutes } from "@/lib/doctor-availability";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
class SlotConflictError extends Error {}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, organizerId, date, timeSlot } = body;

        if (!type || !organizerId || !date || !timeSlot) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Authenticate user
        const cookieStore = await cookies();
        const token = cookieStore.get("PATIENT")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        // 2. Find Patient profile
        const patient = await db.patient.findFirst({
            where: { userId: userId }
        });

        if (!patient) {
            return NextResponse.json(
                { error: "Patient profile not found. Only patients can book appointments." },
                { status: 403 }
            );
        }

        // 3. Validate the requested doctor slot against persisted availability.
        const campaign = type === "DOCTOR" ? await db.campaign.findFirst({
            where: { id: organizerId, status: "ACTIVE", isVerified: true, doctorId: { not: null } },
            include: { doctor: { include: { availability: true, leaves: true } } },
        }) : null;

        if (type === "DOCTOR" && (!campaign?.doctor || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
            return NextResponse.json({ error: "Invalid doctor or appointment date" }, { status: 400 });
        }

        const appointmentDateKey = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
            ? date
            : new Date(date).toISOString().slice(0, 10);
        const { start: appointmentDayStart, end: appointmentDayEnd } = getDateBounds(appointmentDateKey);
        const startTimeMinutes = parseTimeToMinutes(String(timeSlot).split(" - ")[0] || "");
        const appointmentDateTime = new Date(appointmentDayStart);

        if (startTimeMinutes === null) {
            return NextResponse.json({ error: "Invalid appointment slot" }, { status: 400 });
        }
        appointmentDateTime.setUTCMinutes(startTimeMinutes);

        if (type === "DOCTOR" && campaign?.doctor) {
            const dayOfWeek = getDayOfWeek(appointmentDateKey);
            const onLeave = campaign.doctor.leaves.some((leave) => new Date(leave.startDate) <= appointmentDayEnd && new Date(leave.endDate) >= appointmentDayStart);
            const persistedSchedules = campaign.doctor.availability
                .filter((availability) => availability.dayOfWeek === dayOfWeek)
                .map((availability) => ({ startTime: availability.startTime, endTime: availability.endTime }));
            const campaignSchedule = campaign.schedule as { days?: string[]; startTime?: string; endTime?: string } | null;
            const schedules = persistedSchedules.length > 0 ? persistedSchedules : (
                campaignSchedule?.days?.map((day) => day.toUpperCase()).includes(dayOfWeek) && campaignSchedule.startTime && campaignSchedule.endTime
                    ? [{ startTime: campaignSchedule.startTime, endTime: campaignSchedule.endTime }]
                    : []
            );
            const validSlot = schedules.some((schedule) => generateSlots(schedule.startTime, schedule.endTime, 30).some((slot) => slot.startMinutes === startTimeMinutes && slot.label === timeSlot));
            if (onLeave || !validSlot || appointmentDateTime <= new Date()) {
                return NextResponse.json({ error: "This appointment slot is not available" }, { status: 409 });
            }

            const existingAppointment = await db.appointment.findFirst({
                where: {
                    doctorId: campaign.doctor.id,
                    dateTime: appointmentDateTime,
                    status: { in: ["PENDING", "CONFIRMED", "RESCHEDULED"] },
                },
                select: { id: true },
            });
            if (existingAppointment) {
                return NextResponse.json({ error: "This appointment slot is no longer available" }, { status: 409 });
            }
        }

        // 4. Calculate Consultation Fee (Campaign Price + Platform Fee - Discounts)
        let finalFee = 0;

        if (type === "DOCTOR") {
            if (campaign) {
                const doctorFee = campaign.price;
                const campaignDiscount = (doctorFee * (campaign.discountPercentage || 0)) / 100;

                // Get active platform fee
                const platformFees = await db.platformFee.findMany({
                    where: { isActive: true }
                });
                const platformFeeObj = platformFees.find((f: any) => f.entityType === "DOCTOR") || platformFees.find((f: any) => f.entityType === "ALL");

                let platformFeeValue = 0;
                let platformDiscountValue = 0;

                if (platformFeeObj) {
                    // Platform Fee is now always a flat amount (Rupees)
                    platformFeeValue = platformFeeObj.fee;

                    if (platformFeeObj.discountType === "PERCENTAGE") {
                        platformDiscountValue = (platformFeeValue * platformFeeObj.discount) / 100;
                    } else {
                        platformDiscountValue = platformFeeObj.discount;
                    }
                }

                finalFee = Math.max(0, doctorFee - campaignDiscount + platformFeeValue - platformDiscountValue);
            }
        }

        // 5. Create Appointment
        const doctorId = type === "DOCTOR" ? campaign?.doctorId : null;
        const appointmentData: any = {
            patientId: patient.id,
            dateTime: appointmentDateTime,
            status: "PENDING",
            consultationFee: Math.round(finalFee),
        };

        if (type === "DOCTOR") {
            // Need doctor's actual ID, not campaign ID
            appointmentData.doctorId = doctorId;

            if (doctorId) {
                // Calculate daily unique sequential queue number per doctor
                const start = startOfDay(appointmentDateTime);
                const end = endOfDay(appointmentDateTime);

                const lastAppointment = await db.appointment.findFirst({
                    where: {
                        doctorId: doctorId,
                        dateTime: {
                            gte: start,
                            lte: end,
                        }
                    },
                    orderBy: {
                        queueNumber: 'desc'
                    } as any
                }) as any;

                appointmentData.queueNumber = (lastAppointment?.queueNumber || 0) + 1;
            }
        } else if (type === "LAB") {
            appointmentData.labId = organizerId;
        }

        const appointment = await db.$transaction(async (tx) => {
            if (type === "DOCTOR" && doctorId) {
                // Serialize attempts for the same doctor and slot. This closes
                // the race between the availability check and INSERT without
                // requiring a destructive migration on existing appointments.
                const lockKey = `${doctorId}:${appointmentDateTime.toISOString()}`;
                await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

                const conflictingAppointment = await tx.appointment.findFirst({
                    where: {
                        doctorId,
                        dateTime: appointmentDateTime,
                        status: { in: ["PENDING", "CONFIRMED", "RESCHEDULED"] },
                    },
                    select: { id: true },
                });
                if (conflictingAppointment) {
                    throw new SlotConflictError("SLOT_CONFLICT");
                }
            }

            return tx.appointment.create({ data: appointmentData as any });
        });

        return NextResponse.json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        if (error instanceof SlotConflictError) {
            return NextResponse.json({ error: "This appointment slot is no longer available" }, { status: 409 });
        }
        console.error("Booking error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
