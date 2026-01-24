import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import DoctorLoginEmail from "@/emails/auth/DoctorLoginOtpEmail";
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
        // Only send the specialized email for doctors/superadmins for now, or generic.
        // Using DoctorLoginEmail as requested, can serve others too.

        await resend.emails.send({
            from: "Swasthify <noreply@swasthify.in>", 
            to: email,
            subject: "Your Login OTP",
            react: DoctorLoginEmail({ otp }),
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
