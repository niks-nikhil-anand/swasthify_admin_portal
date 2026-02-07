import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { parse, format, add } from "date-fns";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

        // 3. Parse dateTime
        // timeSlot is like "10:00 AM - 11:00 AM"
        const startTimeStr = timeSlot.split(" - ")[0]; // "10:00 AM"
        const appointmentDateTime = new Date(date);

        // Extract hours and minutes from startTimeStr
        const [time, period] = startTimeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        appointmentDateTime.setHours(hours, minutes, 0, 0);

        // 4. Create Appointment
        const appointmentData: any = {
            patientId: patient.id,
            dateTime: appointmentDateTime,
            status: "PENDING",
        };

        if (type === "DOCTOR") {
            appointmentData.doctorId = organizerId;
        } else if (type === "LAB") {
            appointmentData.labId = organizerId;
        }

        const appointment = await db.appointment.create({
            data: appointmentData
        });

        return NextResponse.json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
