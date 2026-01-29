import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const type = searchParams.get("type");

        const campaigns = await db.campaign.findMany({
            where: {
                status: "ACTIVE",
                isVerified: true,
                ...(type ? { type: type as any } : {}),
                ...(query ? {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        {
                            doctor: {
                                user: {
                                    name: { contains: query, mode: "insensitive" }
                                }
                            }
                        }
                    ]
                } : {})
            },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        },
                        specializations: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("[PUBLIC_CAMPAIGNS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
