import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
    try {
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
        console.log("Debug: userId from token:", userId);

        // 1. Find Patient profile
        const patient = await db.patient.findFirst({
            where: { userId: userId }
        });
        console.log("Debug: Patient profile found:", patient);

        if (!patient) {
            console.log("Debug: No patient profile found for userId:", userId);
            return NextResponse.json(
                { error: "Patient profile not found." },
                { status: 403 }
            );
        }

        // 2. Fetch Appointments
        console.log("Debug: Fetching appointments for patientId:", patient.id);
        const appointments = await db.appointment.findMany({
            where: { patientId: patient.id },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        },
                        specializations: true
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                dateTime: "desc"
            }
        });
        console.log("Debug: Number of appointments found:", appointments.length);

        const formattedAppointments = appointments.map((apt) => {
            const organizer = apt.doctor || apt.lab;
            const organizerName = organizer?.user?.name || "Unknown";
            const speciality = apt.doctor ? apt.doctor.specializations.map(s => s.name).join(", ") : "Lab Test";

            return {
                id: apt.id,
                doctor: organizerName, // UI expects 'doctor' field
                speciality: speciality,
                date: apt.dateTime.toISOString(),
                type: apt.type === "VIDEO" ? "Video Consultation" : "In-Person Visit",
                status: apt.status === "PENDING" || apt.status === "CONFIRMED" ? "Upcoming" : apt.status,
                img: organizerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                rawStatus: apt.status
            };
        });
        console.log("Debug: Formatted appointments count:", formattedAppointments.length);

        return NextResponse.json(formattedAppointments);

    } catch (error) {
        console.error("Fetch appointments error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
