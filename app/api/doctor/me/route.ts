import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("DOCTOR");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "DOCTOR") {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 403 }
            );
        }

        const user = await db.user.findUnique({
            where: { id: payload.userId as string },
            include: {
                doctor: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,        // e.g. ACTIVE, BLOCKED
                isVerified: user.isVerified,
            },
            doctor: user.doctor
        });

    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
