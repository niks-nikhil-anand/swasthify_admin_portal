import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return new NextResponse("Campaign ID required", { status: 400 });
        }

        const campaign = await db.campaign.findUnique({
            where: {
                id,
                status: "ACTIVE", // Ensure only active campaigns can be viewed publicly
                isVerified: true
            },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                        specializations: true,
                        reviews: {
                            include: {
                                patient: {
                                    include: {
                                        user: {
                                            select: {
                                                name: true,
                                                profilePic: true,
                                            }
                                        }
                                    }
                                },
                                appointment: {
                                    select: {
                                        dateTime: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                            take: 10,
                        },
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            }
                        }
                    }
                }
            }
        });

        if (!campaign) {
            return new NextResponse("Campaign not found", { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("[PUBLIC_CAMPAIGN_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
