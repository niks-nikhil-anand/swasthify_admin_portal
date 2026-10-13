import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { canReviewAppointment, recalculateDoctorRating } from "@/lib/reviews";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getPatientFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("PATIENT")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    return db.patient.findFirst({
        where: { userId },
    });
}

export async function GET() {
    try {
        const patient = await getPatientFromToken();

        if (!patient) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const reviews = await db.review.findMany({
            where: { patientId: patient.id, doctorId: { not: null } },
            include: {
                doctor: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
                appointment: {
                    select: { id: true, dateTime: true, status: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Fetch patient reviews error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const patient = await getPatientFromToken();

        if (!patient) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const appointmentId = String(body.appointmentId || "");
        const rating = Number(body.rating);
        const comment = typeof body.comment === "string" ? body.comment.trim() : "";

        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment is required" }, { status: 400 });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        if (comment.length > 1000) {
            return NextResponse.json({ error: "Comment must be 1000 characters or less" }, { status: 400 });
        }

        const appointment = await db.appointment.findUnique({
            where: { id: appointmentId },
            include: { review: true },
        });

        if (!appointment || appointment.patientId !== patient.id) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (!appointment.doctorId) {
            return NextResponse.json({ error: "Only doctor appointments can be reviewed" }, { status: 400 });
        }

        if (!canReviewAppointment(appointment.status, appointment.dateTime)) {
            return NextResponse.json(
                { error: "You can review this doctor after the appointment is completed" },
                { status: 400 }
            );
        }

        if (appointment.review) {
            return NextResponse.json({ error: "This appointment has already been reviewed" }, { status: 409 });
        }

        const review = await db.review.create({
            data: {
                appointmentId: appointment.id,
                patientId: patient.id,
                doctorId: appointment.doctorId,
                rating,
                comment: comment || null,
            },
        });

        await recalculateDoctorRating(appointment.doctorId);

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error("Create patient review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
