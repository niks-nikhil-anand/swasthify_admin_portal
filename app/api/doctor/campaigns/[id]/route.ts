import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Schema for campaign update validation
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
        state: z.string().optional(),
        district: z.string().optional(),
        pincode: z.string().regex(/^\d{6}$/, "Pin Code must be 6 digits").optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
    }),
    schedule: z.any().optional(),
    bookingRules: z.any().optional(),
    eligibility: z.any().optional(),
    appointmentConfig: z.object({
        dailyLimit: z.number().min(0),
        hourlyLimit: z.number().min(0),
        totalCapacity: z.number().nullable().optional(),
        requiredDetails: z.array(z.string()).optional(),
    }).optional(),
    doctorName: z.string().optional().nullable(),
    doctorImage: z.string().optional().nullable(),
    doctorExperience: z.number().int().min(0).optional().nullable(),
    specialisation: z.string().optional().nullable(),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
        }

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

        // 3. Find existing campaign and verify ownership
        const existingCampaign = await db.campaign.findUnique({
            where: { id },
        });

        if (!existingCampaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        if (existingCampaign.doctorId !== user.doctor.id) {
            return NextResponse.json({ error: "Unauthorized access to this campaign" }, { status: 403 });
        }

        // 4. Parse & Validate Body
        const body = await req.json();
        const result = campaignSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.format() },
                { status: 400 }
            );
        }

        const data = result.data;

        // 5. Update Campaign (and reset status to IN_REVIEW)
        const updatedCampaign = await db.campaign.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                type: data.type as any,
                price: data.price,
                discountPercentage: data.discountPercentage || 0,
                startDate: data.startDate,
                endDate: data.endDate,
                location: data.location,
                schedule: data.schedule || {},
                bookingRules: data.bookingRules || {},
                eligibility: data.eligibility || {},
                // Appointment Configuration
                dailyLimit: data.appointmentConfig?.dailyLimit || 0,
                hourlyLimit: data.appointmentConfig?.hourlyLimit || 0,
                totalCapacity: data.appointmentConfig?.totalCapacity || null,
                requiredDetails: data.appointmentConfig?.requiredDetails || [],
                status: "IN_REVIEW",
                doctorName: data.doctorName || null,
                doctorImage: data.doctorImage || null,
                doctorExperience: data.doctorExperience || null,
                specialisation: data.specialisation || null,
            },
        });

        return NextResponse.json({ campaign: updatedCampaign }, { status: 200 });
    } catch (error) {
        console.error("Error updating campaign:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
