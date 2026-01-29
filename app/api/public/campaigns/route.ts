import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const type = searchParams.get("type");
        const specialization = searchParams.get("specialization");

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const skip = (page - 1) * limit;

        const whereClause = {
            status: "ACTIVE" as any,
            isVerified: true,
            ...(type ? { type: type as any } : {}),
            ...(specialization ? {
                doctor: {
                    specializations: {
                        some: {
                            name: {
                                equals: specialization,
                                mode: "insensitive" as const
                            }
                        }
                    }
                }
            } : {}),
            ...(query ? {
                OR: [
                    { name: { contains: query, mode: "insensitive" as const } },
                    {
                        doctor: {
                            user: {
                                name: { contains: query, mode: "insensitive" as const }
                            }
                        }
                    }
                ]
            } : {})
        };

        // Get total count for pagination
        // @ts-ignore
        const total = await db.campaign.count({ where: whereClause });

        // @ts-ignore
        const campaigns = await db.campaign.findMany({
            where: whereClause,
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
            },
            skip,
            take: limit
        });

        return NextResponse.json({
            data: campaigns,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("[PUBLIC_CAMPAIGNS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
