import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("DOCTOR")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        // 1. Get Doctor ID from User ID
        const doctor = await db.doctor.findUnique({
            where: { userId }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
        }

        // 2. Fetch Appointments
        const appointments = await db.appointment.findMany({
            where: {
                doctorId: doctor.id,
                status: {
                    not: "PENDING"
                }
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                phone: true,
                                name: true
                            }
                        }
                    }
                },
                payment: true
            },
            orderBy: {
                dateTime: "desc"
            }
        });

        return NextResponse.json({ appointments });

    } catch (error: any) {
        console.error("Fetch doctor appointments error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
