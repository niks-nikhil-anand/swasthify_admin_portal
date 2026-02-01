import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { deleteFromS3 } from "@/lib/s3";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getAuthenticatedLabId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("LAB");

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "LAB") return null;

        const lab = await prisma.lab.findFirst({
            where: { userId: payload.userId as string }
        });

        return lab ? lab.id : null;
    } catch (error) {
        return null;
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const labId = await getAuthenticatedLabId();

        if (!labId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const lab = await prisma.lab.findUnique({
            where: { id: labId }
        });

        if (!lab) {
            return NextResponse.json({ error: "Lab not found" }, { status: 404 });
        }

        const photoUrl = lab.profilePhoto;

        if (photoUrl) {
            // Delete from S3
            // Assuming deleteFromS3 is available and works similarly to doctor implementation
            // If deleteFromS3 is generic, this is fine. 
            await deleteFromS3(photoUrl);

            // Update DB to remove photo
            await prisma.lab.update({
                where: { id: labId },
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
