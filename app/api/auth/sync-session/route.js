import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { logAuthEvent } from "@/lib/auth-tracking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json(
                { error: "Email and role are required" },
                { status: 400 }
            );
        }

        // 1. Find User
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 2. Verify Role
        const inputRoleUpper = role.toUpperCase();
        const dbRoleUpper = user.role.toUpperCase();

        let normalizedInputRole = inputRoleUpper;
        if (inputRoleUpper === "SUPERADMIN") normalizedInputRole = "SUPER_ADMIN";

        if (dbRoleUpper !== normalizedInputRole) {
            return NextResponse.json(
                { error: "Unauthorized for this role" },
                { status: 403 }
            );
        }

        // 3. Generate JWT (exact same as login route)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            userId: user.id,
            role: user.role,
            email: user.email
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // 4. Set Cookie (exact same as login route)
        let cookieName = "token";
        if (normalizedInputRole === "SUPER_ADMIN") {
            cookieName = "SUPER_ADMIN";
        } else if (normalizedInputRole === "PATIENT") {
            cookieName = "PATIENT";
        } else if (normalizedInputRole === "DOCTOR") {
            cookieName = "DOCTOR";
        } else if (normalizedInputRole === "LAB") {
            cookieName = "LAB";
        }

        const cookieStore = await cookies();
        cookieStore.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        await logAuthEvent(user.id, "SIGN_IN_FIREBASE");

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Session sync error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
