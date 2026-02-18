import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { logAuthEvent } from "@/lib/auth-tracking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, role: inputRole } = body;

        console.log("Session sync request:", { email, inputRole });

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // 1. Find User
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`Session sync failed: User not found for email ${email}`);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        console.log(`User found: ${user.email}, DB Role: ${user.role}`);

        // 2. Validate/Normalize Role
        // Instead of strictly failing if inputRole doesn't match, 
        // we use the DB role as the source of truth for the session.
        // This makes the magic link more robust if someone clicks a link with a stale role.

        const dbRole = user.role; // This is the Prisma enum value

        // 3. Generate JWT
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            userId: user.id,
            role: dbRole,
            email: user.email
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // 4. Set Cookie based on actual DB role
        let cookieName = "token";
        if (dbRole === "SUPER_ADMIN") {
            cookieName = "SUPER_ADMIN";
        } else if (dbRole === "PATIENT") {
            cookieName = "PATIENT";
        } else if (dbRole === "DOCTOR") {
            cookieName = "DOCTOR";
        } else if (dbRole === "LAB") {
            cookieName = "LAB";
        }

        console.log(`Setting session cookie: ${cookieName} for user: ${user.email}`);

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
                role: dbRole,
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
