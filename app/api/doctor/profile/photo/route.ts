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

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        const photoUrl = doctor.profilePhoto;

        if (photoUrl) {
            // Delete from S3
            await deleteFromS3(photoUrl);

            // Update DB to remove photo
            await prisma.doctor.update({
                where: { id: doctorId },
                data: { profilePhoto: null }
            });

            return NextResponse.json({ success: true, message: "Profile photo deleted" });
        } else {
            return NextResponse.json({ success: true, message: "No profile photo to delete" });
        }

    } catch (error) {
        console.error("Photo delete error:", error);
        return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
    }
}
