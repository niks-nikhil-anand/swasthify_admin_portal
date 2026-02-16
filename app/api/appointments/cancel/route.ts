import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { appointmentId, reason } = body;

        if (!appointmentId) {
            return NextResponse.json(
                { error: "Appointment ID is required" },
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
                { error: "Patient profile not found" },
                { status: 403 }
            );
        }

        // 3. Find and verify appointment
        const appointment = await db.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            return NextResponse.json(
                { error: "Appointment not found" },
                { status: 404 }
            );
        }

        if (appointment.patientId !== patient.id) {
            return NextResponse.json(
                { error: "Unauthorized access to this appointment" },
                { status: 403 }
            );
        }

        if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
            return NextResponse.json(
                { error: `Cannot cancel appointment with status: ${appointment.status}` },
                { status: 400 }
            );
        }

        // 4. Update status to CANCELLED
        await db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: "CANCELLED",
                cancelledBy: "PATIENT",
                cancellationReason: reason || "Cancelled by patient",
                cancelledAt: new Date()
            }
        });

        return NextResponse.json({
            message: "Appointment cancelled successfully"
        });

    } catch (error: any) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
