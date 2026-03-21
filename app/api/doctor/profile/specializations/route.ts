import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getAuthenticatedDoctorId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("DOCTOR");

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "DOCTOR") return null;

        const doctor = await prisma.doctor.findFirst({
            where: { userId: payload.userId as string }
        });

        return doctor ? doctor.id : null;
    } catch (error) {
        return null;
    }
}

export async function PUT(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { specializations } = body;

        if (!Array.isArray(specializations)) {
            return NextResponse.json({ error: "Invalid specializations format" }, { status: 400 });
        }

        const updatedDoctor = await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                specializations: {
                    set: specializations.map((id: string) => ({ id }))
                }
            },
            include: { specializations: true }
        });

        return NextResponse.json({ success: true, specializations: updatedDoctor.specializations });

    } catch (error) {
        console.error("Specializations update error:", error);
        return NextResponse.json({ error: "Failed to update specializations" }, { status: 500 });
    }
}
