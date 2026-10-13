import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("DOCTOR")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "DOCTOR") {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        const doctor = await db.doctor.findUnique({
            where: { userId: payload.userId as string },
            select: {
                id: true,
                averageRating: true,
                totalReviews: true,
            },
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
        }

        const reviews = await db.review.findMany({
            where: { doctorId: doctor.id },
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },
                appointment: {
                    select: {
                        id: true,
                        dateTime: true,
                        type: true,
                        status: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const distribution = [5, 4, 3, 2, 1].map((rating) => ({
            rating,
            count: reviews.filter((review) => review.rating === rating).length,
        }));

        return NextResponse.json({
            summary: {
                averageRating: doctor.averageRating,
                totalReviews: doctor.totalReviews,
                distribution,
            },
            reviews,
        });
    } catch (error) {
        console.error("Fetch doctor reviews error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
