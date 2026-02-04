import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const campaigns = await db.campaign.findMany({
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedCampaigns = campaigns.map(campaign => {
            const organizerName = campaign.doctor?.user.name || campaign.lab?.user.name || "Unknown";

            return {
                id: campaign.id,
                name: campaign.name,
                doctorName: organizerName, // Keeping key as doctorName for frontend compatibility
                type: campaign.type,
                price: campaign.price,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                status: campaign.status,
                isVerified: campaign.isVerified,
                dailyLimit: campaign.dailyLimit,
                createdAt: campaign.createdAt,
            };
        });

        return NextResponse.json(formattedCampaigns);
    } catch (error) {
        console.error("Error fetching admin campaigns:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
