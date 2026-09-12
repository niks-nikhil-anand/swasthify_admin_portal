import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type CampaignLocation = {
    latitude?: unknown;
    longitude?: unknown;
};

type CampaignWithKnownDistance<T> = T & { distanceKm: number };

function toNumber(value: string | null) {
    if (value === null) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function getCoordinate(location: unknown, key: "latitude" | "longitude") {
    if (!location || typeof location !== "object") return null;
    const value = (location as CampaignLocation)[key];
    const number = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
    return Number.isFinite(number) ? number : null;
}

function getDistanceKm(originLat: number, originLng: number, destinationLat: number, destinationLng: number) {
    const earthRadiusKm = 6371;
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const latDelta = toRadians(destinationLat - originLat);
    const lngDelta = toRadians(destinationLng - originLng);
    const a =
        Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
        Math.cos(toRadians(originLat)) *
        Math.cos(toRadians(destinationLat)) *
        Math.sin(lngDelta / 2) *
        Math.sin(lngDelta / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const type = searchParams.get("type");
        const specialization = searchParams.get("specialization");
        const sort = searchParams.get("sort") || "recommended";
        const source = searchParams.get("source"); // "doctor" or "lab"
        const lat = toNumber(searchParams.get("lat"));
        const lng = toNumber(searchParams.get("lng"));
        const radiusKm = toNumber(searchParams.get("radiusKm")) ?? 25;
        const hasLocation = lat !== null && lng !== null;

        const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9") || 9));
        const skip = hasLocation ? 0 : (page - 1) * limit;
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
        const orderBy: Record<
            typeof allowedSorts[number],
            Prisma.CampaignOrderByWithRelationInput | Prisma.CampaignOrderByWithRelationInput[]
        > = {
            recommended: [
                { doctor: { user: { name: "asc" } } },
                { name: "asc" },
                { createdAt: "desc" },
            ],
            newest: { createdAt: "desc" },
            price_asc: { price: "asc" },
            price_desc: { price: "desc" },
            rating_desc: { doctor: { averageRating: "desc" } },
            experience_desc: { doctor: { experienceYears: "desc" } },
        } as const;

        const total = hasLocation ? 0 : await db.campaign.count({ where: whereClause });

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
            take: hasLocation ? Math.max(limit * 4, 50) : limit
        });

        if (hasLocation) {
            const campaignsWithDistance = campaigns
                .map((campaign) => {
                    const campaignLat = getCoordinate(campaign.location, "latitude");
                    const campaignLng = getCoordinate(campaign.location, "longitude");
                    const distanceKm = campaignLat !== null && campaignLng !== null
                        ? getDistanceKm(lat, lng, campaignLat, campaignLng)
                        : null;
                    return { ...campaign, distanceKm };
                })
                .filter((campaign): campaign is CampaignWithKnownDistance<typeof campaign> => {
                    return campaign.distanceKm !== null && campaign.distanceKm <= radiusKm;
                })
                .sort((a, b) => {
                    return a.distanceKm - b.distanceKm;
                });

            const paginatedCampaigns = campaignsWithDistance.slice((page - 1) * limit, page * limit);

            return NextResponse.json({
                data: paginatedCampaigns,
                pagination: {
                    total: campaignsWithDistance.length,
                    page,
                    limit,
                    totalPages: Math.ceil(campaignsWithDistance.length / limit)
                }
            });
        }

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
        // Prisma P1001 means the database endpoint is unavailable. Returning a
        // service-unavailable response lets clients retry instead of treating
        // this as a malformed request or an application bug.
        if (error && typeof error === "object" && "code" in error && error.code === "P1001") {
            return NextResponse.json(
                { error: "Campaigns are temporarily unavailable. Please try again shortly." },
                { status: 503, headers: { "Retry-After": "30" } }
            );
        }
        return NextResponse.json({ error: "Unable to load campaigns" }, { status: 500 });
    }
}
