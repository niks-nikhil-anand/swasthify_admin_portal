import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import mobileAdmin, { mobileAdminApp } from "@/lib/firebaseAdminMobile";
import { db } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

function normalizePhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    if (digits.length === 13 && digits.startsWith("+91")) return `+${digits.slice(1)}`;
    return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function POST(req: NextRequest) {
    try {
        if (!mobileAdminApp) {
            return NextResponse.json({ error: "Mobile authentication is not configured" }, { status: 500 });
        }

        const { idToken, name } = await req.json();
        if (!idToken || !name?.trim()) {
            return NextResponse.json({ error: "Verified mobile number and full name are required" }, { status: 400 });
        }

        const decodedToken = await mobileAdmin.auth().verifyIdToken(idToken);
        if (!decodedToken.phone_number) {
            return NextResponse.json({ error: "Phone number not found in verified token" }, { status: 400 });
        }

        const phone = normalizePhone(decodedToken.phone_number);
        const phoneDigits = phone.replace(/\D/g, "");
        const phoneVariants = Array.from(new Set([
            phone,
            phoneDigits,
            phoneDigits.startsWith("91") ? phoneDigits.slice(2) : phoneDigits,
        ]));
        let user = await db.user.findFirst({ where: { phone: { in: phoneVariants } } });

        if (user && user.role !== "PATIENT") {
            return NextResponse.json({ error: "This mobile number belongs to another account type" }, { status: 409 });
        }
        if (user?.status === "BLOCKED") {
            return NextResponse.json({ error: "User account is blocked" }, { status: 403 });
        }

        const isNewUser = !user;
        if (!user) {
            user = await db.user.create({
                data: {
                    name: name.trim(),
                    email: `${phone.replace(/\D/g, "")}@phone.swasthify.local`,
                    phone,
                    role: "PATIENT",
                    isVerified: true,
                    patients: { create: { name: name.trim() } },
                },
            });
        } else {
            user = await db.user.update({
                where: { id: user.id },
                data: {
                    name: user.name || name.trim(),
                    isVerified: true,
                },
            });

            const patient = await db.patient.findFirst({ where: { userId: user.id } });
            if (patient) {
                await db.patient.update({ where: { id: patient.id }, data: { name: name.trim() } });
            } else {
                await db.patient.create({ data: { userId: user.id, name: name.trim() } });
            }
        }

        await db.authLog.create({
            data: {
                userId: user.id,
                type: isNewUser ? "SIGN_UP" : "SIGN_IN",
                ipAddress: req.headers.get("x-forwarded-for") || "unknown",
            },
        });

        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            success: true,
            isNewUser,
            user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
        });

        response.cookies.set("PATIENT", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Guest mobile authentication error:", error);
        return NextResponse.json({ error: "Unable to complete mobile authentication" }, { status: 500 });
    }
}
