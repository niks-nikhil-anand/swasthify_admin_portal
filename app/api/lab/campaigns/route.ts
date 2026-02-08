import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const campaignSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(["HEALTH_CHECKUP_CAMP", "DISCOUNTED_TESTS", "HOME_COLLECTION_DRIVE", "COMMUNITY_SCREENING"]),
    startDate: z.string(),
    endDate: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    district: z.string(),
    pincode: z.string(),
    latitude: z.string().optional(), // Received as string from frontend
    longitude: z.string().optional(),
    selectedDays: z.array(z.string()),
    scheduleStartTime: z.string(),
    scheduleEndTime: z.string(),
    totalCampaignAppointments: z.string().optional(),
    dailyAppointmentLimit: z.string(),
    hourlyAppointmentLimit: z.string(),
    appointmentRequirements: z.array(z.string()),
    price: z.string(),
    discountPercentage: z.string().optional(),
    // Lab Specifics
    healthConcern: z.array(z.string()).optional(),
    gender: z.string().optional(),
    isFreeHomeSampleCollection: z.boolean().optional(),
    reportTime: z.string().optional(),
    testCategory: z.array(z.string()).optional(),
    testsIncluded: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("LAB");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "LAB") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const lab = await db.lab.findUnique({
            where: { userId: payload.userId as string },
        });

        if (!lab) {
            return NextResponse.json({ message: "Lab profile not found" }, { status: 404 });
        }

        const body = await req.json();
        const result = campaignSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.issues }, { status: 400 });
        }

        const validatedData = result.data;

        const campaign = await db.campaign.create({
            data: {
                labId: lab.id,
                name: validatedData.name,
                description: validatedData.description,
                type: validatedData.type as any, // Cast to Enum
                startDate: new Date(validatedData.startDate),
                endDate: new Date(validatedData.endDate),

                // Location JSON
                location: {
                    address: validatedData.address,
                    city: validatedData.city,
                    state: validatedData.state,
                    district: validatedData.district,
                    pincode: validatedData.pincode,
                    latitude: validatedData.latitude ? parseFloat(validatedData.latitude) : undefined,
                    longitude: validatedData.longitude ? parseFloat(validatedData.longitude) : undefined,
                },

                // Schedule JSON
                schedule: [
                    {
                        days: validatedData.selectedDays,
                        startTime: validatedData.scheduleStartTime,
                        endTime: validatedData.scheduleEndTime,
                    }
                ],

                // Eligibility JSON (Basic for now)
                eligibility: {
                    gender: validatedData.gender,
                },

                // Booking Rules JSON (Defaults)
                bookingRules: {
                    gap: 15,
                },

                totalCapacity: validatedData.totalCampaignAppointments ? parseInt(validatedData.totalCampaignAppointments) : null,
                dailyLimit: parseInt(validatedData.dailyAppointmentLimit),
                hourlyLimit: parseInt(validatedData.hourlyAppointmentLimit),
                requiredDetails: validatedData.appointmentRequirements,

                price: parseFloat(validatedData.price),
                discountPercentage: validatedData.discountPercentage ? parseFloat(validatedData.discountPercentage) : 0,

                // Lab Specifics
                healthConcern: validatedData.healthConcern || [],
                gender: validatedData.gender,
                isFreeHomeSampleCollection: validatedData.isFreeHomeSampleCollection || false,
                reportTime: validatedData.reportTime,
                testCategory: validatedData.testCategory || [],
                testsIncluded: validatedData.testsIncluded || [],

                status: "IN_REVIEW", // Default to In Review
            }
        });

        return NextResponse.json(campaign, { status: 201 });

    } catch (error: any) {
        console.error("Error creating lab campaign:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("LAB");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "LAB") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const lab = await db.lab.findUnique({
            where: { userId: payload.userId as string },
        });

        if (!lab) {
            return NextResponse.json({ message: "Lab profile not found" }, { status: 404 });
        }

        const campaigns = await db.campaign.findMany({
            where: { labId: lab.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(campaigns, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching lab campaigns:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
