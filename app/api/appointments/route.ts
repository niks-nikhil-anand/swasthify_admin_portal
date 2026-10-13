import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { calculateDoctorAvailability, getDateBounds, parseTimeToMinutes } from "@/lib/doctor-availability";
import { getPatientUserId } from "@/lib/patient-auth";

const APPOINTMENT_STATUSES_TO_CHECK = ["PENDING", "CONFIRMED", "RESCHEDULED"] as const;
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

        if (type !== "DOCTOR" && type !== "LAB") {
            return NextResponse.json(
                { error: "Invalid appointment type" },
                { status: 400 }
            );
        }

        // 1. Authenticate user
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

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
            const existingAppointments = await db.appointment.findMany({
                where: {
                    doctorId: campaign.doctor.id,
                    dateTime: { gte: appointmentDayStart, lte: appointmentDayEnd },
                    status: { in: [...APPOINTMENT_STATUSES_TO_CHECK] },
                },
                select: { dateTime: true, status: true, createdAt: true },
            });

            const availability = calculateDoctorAvailability({
                date: appointmentDateKey,
                campaignStartDate: campaign.startDate,
                campaignEndDate: campaign.endDate,
                campaignSchedule: campaign.schedule,
                doctorSchedules: campaign.doctor.availability.map((availability) => ({
                    dayOfWeek: availability.dayOfWeek,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                })),
                doctorLeaves: campaign.doctor.leaves,
                existingAppointments,
                timeZone: campaign.doctor.timeZone,
            });
            const requestedSlot = availability.slots.find((slot) => slot.startMinutes === startTimeMinutes && slot.label === timeSlot);
            if (!requestedSlot || requestedSlot.status !== "AVAILABLE") {
                return NextResponse.json({ error: "This appointment slot is not available" }, { status: 409 });
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
                const platformFeeObj = platformFees.find((fee) => fee.entityType === "DOCTOR") || platformFees.find((fee) => fee.entityType === "ALL");

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
        const doctorId = type === "DOCTOR" ? campaign?.doctor?.id : null;
        const appointmentData: Prisma.AppointmentUncheckedCreateInput = {
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
                    },
                    select: { queueNumber: true },
                });

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
                const [lock] = await tx.$queryRaw<{ locked: boolean }[]>`SELECT pg_try_advisory_xact_lock(hashtext(${lockKey})) AS locked`;
                if (!lock?.locked) {
                    throw new SlotConflictError("SLOT_LOCK_CONFLICT");
                }

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

            return tx.appointment.create({ data: appointmentData });
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
