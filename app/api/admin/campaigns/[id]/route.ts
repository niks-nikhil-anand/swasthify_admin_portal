import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
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
