import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doctorId } = body;

        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        // 1. Verify Super Admin Session
        const cookieStore = await cookies();
        const superAdminToken = cookieStore.get("SUPER_ADMIN")?.value;

        if (!superAdminToken) {
            return NextResponse.json({ error: "Unauthorized: Super Admin session not found" }, { status: 401 });
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(superAdminToken, secret);
        } catch (error) {
            console.error("Super Admin token verification failed:", error);
            return NextResponse.json({ error: "Unauthorized: Invalid Super Admin session" }, { status: 401 });
        }

        // 2. Find Doctor
        const doctor = await db.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        if (doctor.user.role !== "DOCTOR") {
            return NextResponse.json({ error: "Associated user is not a doctor" }, { status: 400 });
        }

        // 3. Generate JWT for Doctor
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            userId: doctor.user.id,
            role: doctor.user.role,
            email: doctor.user.email
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // 4. Set DOCTOR Cookie
        cookieStore.set("DOCTOR", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        console.log(`Impersonation successful for doctor: ${doctor.user.email}`);

        return NextResponse.json({
            message: "Impersonation successful",
            redirectUrl: "/doctor-panel/dashboard"
        });

    } catch (error) {
        console.error("Impersonation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
