import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { logAuthEvent } from "@/lib/auth-tracking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, role: inputRole, name } = body;

        console.log("Session sync request:", { email, inputRole, name });

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // 1. Find or Create User
        // Note: For social login, if the user doesn't exist, we create them.
        let user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log(`User not found for ${email}. Creating new account via social login...`);

            // Normalize role
            const roleToSet = (inputRole?.toUpperCase() || "PATIENT");

            user = await db.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email,
                        name: name || email.split('@')[0],
                        role: roleToSet,
                        isVerified: true, // Social login verifies email
                    },
                });

                if (roleToSet === "PATIENT") {
                    await tx.patient.create({
                        data: {
                            userId: newUser.id,
                            name: newUser.name,
                        }
                    });
                }

                return newUser;
            });

            await logAuthEvent(user.id, "SIGN_UP_SOCIAL");
        }

        console.log(`User found/created: ${user.email}, DB Role: ${user.role}`);

        const dbRole = user.role;

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
            },
            token: token
        });

    } catch (error) {
        console.error("Session sync error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
