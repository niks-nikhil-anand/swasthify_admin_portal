import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Schema for campaign creation
const campaignSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["OPD", "HEALTH_CAMP", "FREE_CHECKUP"]),
    price: z.number().min(0),
    discountPercentage: z.number().min(0).max(100).optional(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    location: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
    }),
    schedule: z.any().optional(), // Can be more specific if we define the JSON structure
    bookingRules: z.any().optional(),
    eligibility: z.any().optional(),
});

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get("DOCTOR");

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "DOCTOR") {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        // 2. Get Doctor ID
        const user = await db.user.findUnique({
            where: { id: payload.userId as string },
            include: { doctor: true },
        });

        if (!user || !user.doctor) {
            return NextResponse.json(
                { error: "Doctor profile not found" },
                { status: 404 }
            );
        }

        // 3. Parse Body
        const body = await req.json();
        const result = campaignSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.format() },
                { status: 400 }
            );
        }

        const data = result.data;

        // 4. Create Campaign
        const campaign = await db.campaign.create({
            data: {
                doctorId: user.doctor.id,
                name: data.name,
                description: data.description,
                type: data.type,
                price: data.price,
                discountPercentage: data.discountPercentage || 0,
                startDate: data.startDate,
                endDate: data.endDate,
                location: data.location,
                schedule: data.schedule || {},
                bookingRules: data.bookingRules || {},
                eligibility: data.eligibility || {},
                status: "DRAFT", // Default status
            },
        });

        return NextResponse.json({ campaign }, { status: 201 });
    } catch (error) {
        console.error("Error creating campaign:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
