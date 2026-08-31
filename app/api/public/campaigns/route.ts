import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const type = searchParams.get("type");
        const specialization = searchParams.get("specialization");
        const sort = searchParams.get("sort") || "recommended";
        const source = searchParams.get("source"); // "doctor" or "lab"

        const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9") || 9));
        const skip = (page - 1) * limit;
        const allowedTypes = ["OPD", "HEALTH_CAMP", "FREE_CHECKUP"] as const;
        const allowedSorts = ["recommended", "newest", "price_asc", "price_desc", "rating_desc", "experience_desc"] as const;
        const normalizedQuery = query?.trim();

        const whereClause = {
            status: "ACTIVE" as const,
            isVerified: true,
            ...(type && allowedTypes.includes(type as typeof allowedTypes[number]) ? { type: type as typeof allowedTypes[number] } : {}),
            ...(source === "doctor" ? { doctorId: { not: null } } : {}),
            ...(source === "lab" ? { labId: { not: null } } : {}),
            ...(specialization ? {
                doctor: {
                    specializations: {
                        some: {
                            OR: [
                                { id: specialization },
                                { name: { equals: specialization, mode: "insensitive" as const } }
                            ]
                        }
                    }
                }
            } : {}),
            ...(normalizedQuery ? {
                OR: [
                    { name: { contains: normalizedQuery, mode: "insensitive" as const } },
                    { specialisation: { contains: normalizedQuery, mode: "insensitive" as const } },
                    {
                        doctor: {
                            user: {
                                name: { contains: normalizedQuery, mode: "insensitive" as const }
                            }
                        }
                    },
                    { doctor: { clinicName: { contains: normalizedQuery, mode: "insensitive" as const } } },
                    { doctor: { hospitalName: { contains: normalizedQuery, mode: "insensitive" as const } } },
                    {
                        doctor: {
                            specializations: {
                                some: { name: { contains: normalizedQuery, mode: "insensitive" as const } }
                            }
                        }
                    }
                ]
            } : {})
        };

        const safeSort = allowedSorts.includes(sort as typeof allowedSorts[number])
            ? sort as typeof allowedSorts[number]
            : "recommended";
        const orderBy = {
            recommended: { createdAt: "desc" },
            newest: { createdAt: "desc" },
            price_asc: { price: "asc" },
            price_desc: { price: "desc" },
            rating_desc: { doctor: { averageRating: "desc" } },
            experience_desc: { doctor: { experienceYears: "desc" } },
        } as const;

        // Get total count for pagination
        const total = await db.campaign.count({ where: whereClause });

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
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: orderBy[safeSort],
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
