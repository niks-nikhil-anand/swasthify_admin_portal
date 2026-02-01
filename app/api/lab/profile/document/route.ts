import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // "ownerIdProof" or "addressProof"

        if (!labId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!type || (type !== "ownerIdProof" && type !== "addressProof")) {
            return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
        }

        // Ideally we would delete from S3 here too, but for now just clear DB field

        await prisma.lab.update({
            where: { id: labId },
            data: {
                [type]: null
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete document error:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}
