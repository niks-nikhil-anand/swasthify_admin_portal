import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { SignJWT } from "jose";
import mobileAdmin, { mobileAdminApp } from "@/lib/firebaseAdminMobile";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");
    return new TextEncoder().encode(secret);
}

export async function POST(req: NextRequest) {
    try {
        console.log("Identity Mobile OTP request received");

        if (!mobileAdminApp) {
            console.error("Mobile Firebase Admin not initialized (missing credentials)");
            return NextResponse.json({ 
                error: "Server configuration for Mobile Auth is incomplete. Please provide MOBILE_FIREBASE_* credentials in .env" 
            }, { status: 500 });
        }
        
        const body = await req.json().catch(() => null);
        
        if (!body) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { idToken, role } = body;

        if (!idToken || !role) {
            return NextResponse.json({ error: "Missing required fields (idToken or role)" }, { status: 400 });
        }

        // Verify Firebase ID Token using mobile auth project
        const decodedToken = await mobileAdmin.auth().verifyIdToken(idToken);
        const phoneNumber = decodedToken.phone_number;

        if (!phoneNumber) {
            return NextResponse.json({ error: "Phone number not found in token" }, { status: 400 });
        }

        // Find user by phone number
        let user = await prisma.user.findFirst({
            where: {
                phone: phoneNumber,
                role: role.toUpperCase(),
            },
        });

        if (!user) {
            const trimmedPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
            user = await prisma.user.findFirst({
                where: {
                    phone: trimmedPhone,
                    role: role.toUpperCase(),
                },
            });
        }

        if (!user && phoneNumber.startsWith('+91')) {
            const purePhone = phoneNumber.substring(3);
            user = await prisma.user.findFirst({
                where: {
                    phone: purePhone,
                    role: role.toUpperCase(),
                },
            });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found or role mismatch" }, { status: 404 });
        }

        if (user.status === "BLOCKED") {
            return NextResponse.json({ error: "User account is blocked" }, { status: 403 });
        }

        // Create auth log
        await prisma.authLog.create({
            data: {
                userId: user.id,
                type: "SIGN_IN",
                ipAddress: req.headers.get("x-forwarded-for") || "unknown",
            },
        });

        // Generate JWT
        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(getJwtSecret());

        // Set Cookie
        const response = NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        // Use consistent cookie naming as expected by middleware
        const dbRole = user.role.toUpperCase();
        let cookieName = "token";
        if (dbRole === "SUPER_ADMIN" || dbRole === "ADMIN") cookieName = "SUPER_ADMIN";
        else if (dbRole === "DOCTOR") cookieName = "DOCTOR";
        else if (dbRole === "LAB") cookieName = "LAB";
        else if (dbRole === "PATIENT") cookieName = "PATIENT";

        console.log(`Setting cookie for ${dbRole}: ${cookieName}`);

        response.cookies.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error: any) {
        console.error("Identity Verification Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
