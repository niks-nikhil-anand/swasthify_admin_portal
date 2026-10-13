import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function requireSuperAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("SUPER_ADMIN")?.value;

    if (!token) return false;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "SUPER_ADMIN";
}

export async function GET(req: Request) {
    try {
        const isSuperAdmin = await requireSuperAdmin();

        if (!isSuperAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const rating = searchParams.get("rating");

        const reviews = await db.review.findMany({
            where: {
                doctorId: { not: null },
                ...(rating && rating !== "all" ? { rating: Number(rating) } : {}),
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                appointment: {
                    select: {
                        id: true,
                        dateTime: true,
                        status: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Fetch admin reviews error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
