import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { deleteFromS3 } from "@/lib/s3";

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

export async function DELETE(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        if (!type || !["idProof", "associationProof"].includes(type)) {
            return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        // @ts-ignore
        const docUrl = doctor[type] as string | null;

        if (docUrl) {
            // Delete from S3
            await deleteFromS3(docUrl);

            // Fetch address for completeness check (as in PATCH route)
            const address = await prisma.address.findFirst({
                where: { userId: doctor.userId, label: "Clinic" }
            });

            // Prepare data for completion check
            // We set the current field to null effectively
            const currentData = {
                firstName: doctor.user.name?.split(" ")[0] || "",
                lastName: doctor.user.name?.split(" ").slice(1).join(" ") || "",
                email: doctor.user.email,
                phone: doctor.user.phone,
                bio: doctor.bio,
                clinicName: doctor.clinicName,
                address: address?.street || "",
                city: address?.city || "",
                zip: address?.zipCode || "",
                profilePhoto: doctor.profilePhoto,
                idProof: doctor.idProof,
                associationProof: doctor.associationProof,
            };

            // Update the specific field to null in our local object for calculation
            // @ts-ignore
            currentData[type] = "";

            // Calculate profile completion percentage
            let filledFields = 0;
            const fieldsToCheck = [
                currentData.firstName, currentData.lastName, currentData.email, currentData.phone,
                currentData.bio, currentData.clinicName, currentData.address,
                currentData.city, currentData.zip, currentData.profilePhoto,
                currentData.idProof, currentData.associationProof
            ];

            fieldsToCheck.forEach(field => {
                if (field && field.trim() !== "") filledFields++;
            });

            const percentage = Math.round((filledFields / fieldsToCheck.length) * 100);

            // Update DB to remove document and update completion stats
            await prisma.doctor.update({
                where: { id: doctorId },
                data: {
                    [type]: null,
                    isProfileComplete: percentage === 100,
                    profileCompletionPercentage: percentage
                }
            });

            return NextResponse.json({ success: true, message: "Document deleted" });
        } else {
            return NextResponse.json({ success: true, message: "No document to delete" });
        }

    } catch (error) {
        console.error("Document delete error:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId();

        if (!doctorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { clinicImages } = body;

        if (!Array.isArray(clinicImages)) {
            return NextResponse.json({ error: "clinicImages must be an array" }, { status: 400 });
        }

        const updatedDoctor = await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                clinicImages: clinicImages
            }
        });

        return NextResponse.json({ success: true, doctor: updatedDoctor });

    } catch (error) {
        console.error("Clinic images update error:", error);
        return NextResponse.json({ error: "Failed to update clinic images" }, { status: 500 });
    }
}
