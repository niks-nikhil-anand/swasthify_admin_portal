import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getAuthenticatedDoctorId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("DOCTOR");

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "DOCTOR") return null;

        const doctor = await prisma.doctor.findFirst({
            where: { userId: payload.userId as string }
        });

        return doctor ? doctor.id : null;
    } catch (error) {
        return null;
    }
}

export async function PUT(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { bankName, accountHolderName, accountNumber, ifscCode } = body;

        // Regex Validation
        const accountNumberRegex = /^\d{9,18}$/;
        const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (accountNumber && !accountNumberRegex.test(accountNumber)) {
            return NextResponse.json({ error: "Invalid account number. It should be 9-18 digits." }, { status: 400 });
        }

        if (ifscCode && !ifscCodeRegex.test(ifscCode)) {
            return NextResponse.json({ error: "Invalid IFSC code. Expected format: ABCD0123456" }, { status: 400 });
        }

        const updatedDoctor = await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                bankName,
                accountHolderName,
                accountNumber,
                ifscCode
            } as any
        });

        return NextResponse.json({ success: true, doctor: updatedDoctor });

    } catch (error) {
        console.error("Payment details update error:", error);
        return NextResponse.json({ error: "Failed to update payment details" }, { status: 500 });
    }
}
