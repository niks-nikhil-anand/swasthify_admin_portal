import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET);

export async function POST(req) {
    try {
        const { mobile, otp, role } = await req.json();

        if (!mobile || !otp) {
            return NextResponse.json(
                { error: "Mobile number and OTP are required" },
                { status: 400 }
            );
        }

        // 1. Find user by phone
        const user = await db.user.findUnique({
            where: { phone: mobile },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid OTP or user not found" },
                { status: 401 }
            );
        }

        // 2. Check OTP expiry
        if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
            return NextResponse.json(
                { error: "OTP has expired. Please request a new one." },
                { status: 401 }
            );
        }

        // 3. Validate OTP against hashed value
        if (!user.loginOtp) {
            return NextResponse.json(
                { error: "No OTP found. Please request a new one." },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(otp, user.loginOtp);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid OTP. Please try again." },
                { status: 401 }
            );
        }

        // 4. Clear OTP from DB after successful verification
        await db.user.update({
            where: { id: user.id },
            data: {
                loginOtp: null,
                otpExpiry: null,
            },
        });

        // 5. Issue JWT session token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            name: user.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(SECRET);

        // 6. Set session cookie
        const cookieStore = await cookies();
        cookieStore.set("session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // 7. Return user data (no sensitive fields)
        return NextResponse.json({
            message: "OTP verified successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json(
            { error: "Failed to verify OTP" },
            { status: 500 }
        );
    }
}
