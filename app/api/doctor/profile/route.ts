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

export async function GET(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
        }

        // Fetch address
        const address = await prisma.address.findFirst({
            where: { userId: doctor.userId, label: "Clinic" }
        });

        return NextResponse.json({
            success: true,
            doctor: {
                ...doctor,
                firstName: doctor.user.name?.split(" ")[0] || "",
                lastName: doctor.user.name?.split(" ").slice(1).join(" ") || "",
                email: doctor.user.email,
                phone: doctor.user.phone,
                address: address?.street || "",
                city: address?.city || "",
                zip: address?.zipCode || ""
            }
        });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            bio,
            clinicName,
            address,
            city,
            zip,
            profilePhoto,
            idProof,
            associationProof
        } = body;

        // Calculate profile completion percentage
        let filledFields = 0;

        const fieldsToCheck = [
            firstName, lastName, email, phone, bio,
            clinicName, address, city, zip, profilePhoto,
            idProof, associationProof
        ];

        fieldsToCheck.forEach(field => {
            if (field && field.trim() !== "") filledFields++;
        });

        const percentage = Math.round((filledFields / fieldsToCheck.length) * 100);

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        // Transaction to update both User (common fields) and Doctor (specific fields)
        const updatedDoctor = await prisma.$transaction(async (tx: any) => {
            // Update User name/email/phone if changed
            await tx.user.update({
                where: { id: doctor.userId },
                data: {
                    name: `${firstName} ${lastName}`,
                    email: email,
                    phone: phone
                }
            });

            // Update Doctor details
            return await tx.doctor.update({
                where: { id: doctorId },
                data: {
                    bio,
                    clinicName,
                    profilePhoto,
                    idProof,
                    associationProof,
                    isProfileComplete: percentage === 100,
                    profileCompletionPercentage: percentage
                }
            });
        });

        // Handle Address Update Separately
        const existingAddress = await prisma.address.findFirst({
            where: { userId: doctor.userId, label: "Clinic" }
        });

        if (existingAddress) {
            await prisma.address.update({
                where: { id: existingAddress.id },
                data: {
                    street: address,
                    city: city,
                    zipCode: zip
                }
            });
        } else {
            await prisma.address.create({
                data: {
                    userId: doctor.userId,
                    label: "Clinic",
                    street: address,
                    city: city,
                    state: "Maharashtra", // Default
                    zipCode: zip,
                    country: "India"
                }
            });
        }

        return NextResponse.json({ success: true, doctor: updatedDoctor });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
