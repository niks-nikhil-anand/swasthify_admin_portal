import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
    status: z.enum(["DRAFT", "ACTIVE", "IN_REVIEW", "PAUSED", "COMPLETED"]).optional(),
    isVerified: z.boolean().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
        }

        const campaign = await db.campaign.findUnique({
            where: { id },
            include: {
                doctor: {
                    select: {
                        id: true,
                        licenseNumber: true,
                        bio: true,
                        experienceYears: true,
                        qualification: true,
                        clinicName: true,
                        hospitalName: true,
                        profilePhoto: true,
                        idProof: true,
                        associationProof: true,
                        isProfileComplete: true,
                        profileCompletionPercentage: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Error fetching campaign details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const validatedData = updateSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid input", details: validatedData.error.issues }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
        }

        const campaign = await db.campaign.update({
            where: { id },
            data: {
                ...validatedData.data,
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Error updating campaign:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
