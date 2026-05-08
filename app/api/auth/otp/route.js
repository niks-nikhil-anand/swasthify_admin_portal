import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import LoginOtpEmail from "@/emails/auth/LoginOtpEmail";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const { email, mobile, role } = await req.json();

        if ((!email && !mobile) || !role) {
            return NextResponse.json(
                { error: "Email/mobile and role are required" },
                { status: 400 }
            );
        }

        // 1. Find User either by email or by phone
        let user;
        if (email && email.includes('@')) {
            user = await db.user.findUnique({
                where: { email },
            });
        } else {
            // Frontend might pass phone in the 'mobile' key or 'email' key
            const phoneSearch = mobile || email;
            user = await db.user.findUnique({
                where: { phone: phoneSearch },
            });
        }

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

        // 5. Send Deliverable
        const displayRole = role === "DOCTOR" ? "Doctor" :
            role === "SUPERADMIN" ? "SuperAdmin" :
                role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        // If an email address was used to request this, actually send the email.
        if (email && email.includes('@') && user.email) {
            await resend.emails.send({
                from: "Swasthify <noreply@swasthify.in>",
                to: user.email,
                subject: "Your Login OTP",
                react: LoginOtpEmail({ otp, role: displayRole, userName: user.name }),
            });
            console.log(`OTP sent via email to ${user.email}`);
        } else {
            // Because no SMS provider is configured, we must mock the SMS so the developer can read the OTP
            console.log(`\n===========================================`);
            console.log(`📱 MOCK SMS DISPATCHED TO: ${user.phone}`);
            console.log(`🔑 YOUR OTP IS: ${otp}`);
            console.log(`===========================================\n`);
        }

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
