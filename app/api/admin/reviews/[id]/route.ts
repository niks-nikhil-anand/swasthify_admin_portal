import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { recalculateDoctorRating } from "@/lib/reviews";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function requireSuperAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("SUPER_ADMIN")?.value;

    if (!token) return false;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "SUPER_ADMIN";
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isSuperAdmin = await requireSuperAdmin();

        if (!isSuperAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const review = await db.review.findUnique({
            where: { id },
            select: { id: true, doctorId: true },
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        await db.review.delete({
            where: { id },
        });

        if (review.doctorId) {
            await recalculateDoctorRating(review.doctorId);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete admin review error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
