import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPatientUserId } from "@/lib/patient-auth";

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
            if (appointment.status === "CANCELLED") {
                return NextResponse.json({ message: "Appointment was already cancelled", alreadyCancelled: true });
            }
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

    } catch (error: unknown) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
