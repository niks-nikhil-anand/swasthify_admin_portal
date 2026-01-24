import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import LoginOtpEmail from "@/emails/auth/LoginOtpEmail";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const { email, role } = await req.json();

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
            // Don't reveal user existence
            return NextResponse.json(
                { message: "OTP sent if account exists" },
                { status: 200 }
            );
        }

        // 2. Validate Role (Optional strictness)
        // For now, checks are loose to allow shared login, but ideal to enforce matches.

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 4. Save to DB
        await db.user.update({
            where: { id: user.id },
            data: {
                loginOtp: hashedOtp,
                otpExpiry,
            },
        });

        // 5. Send Email
        // Pass role for context (e.g. "Doctor Panel", "SuperAdmin Panel")
        const displayRole = role === "DOCTOR" ? "Doctor" :
            role === "SUPERADMIN" ? "SuperAdmin" :
                role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        await resend.emails.send({
            from: "Swasthify <noreply@swasthify.in>",
            to: email,
            subject: "Your Login OTP",
            react: LoginOtpEmail({ otp, role: displayRole, userName: user.name }),
        });

        console.log(`OTP sent to ${email}`);

        return NextResponse.json(
            { message: "OTP sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("OTP Error:", error);
        return NextResponse.json(
            { error: "Failed to send OTP" },
            { status: 500 }
        );
    }
}
