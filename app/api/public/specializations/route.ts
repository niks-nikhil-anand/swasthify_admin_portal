import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EntityType } from "@prisma/client";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "50");

        const whereClause = {
            ...(type && Object.values(EntityType).includes(type as EntityType)
                ? { type: type as EntityType }
                : {}),
            // Optionally, we could require that there is at least one active campaign
            // for these specializations, but for now we'll return all available ones.
        };

        const specializations = await db.specialization.findMany({
            where: whereClause,
            orderBy: {
                name: 'asc'
            },
            take: limit
        });

        // We map the database output to match what the frontend expects.
        // If an image isn't set, we can provide a fallback or the frontend will handle it.
        const mappedSpecializations = specializations.map(spec => ({
            id: spec.id,
            title: spec.name,
            price: `₹${(spec.startingPrice || 0).toLocaleString("en-IN")}`,
            image: spec.image || "/images/specialities/general_physician_real.png", // A reasonable default
            color: "bg-emerald-50/50 dark:bg-emerald-900/20", // Default color if dynamic colors aren't provided by DB
            type: spec.type
        }));

        return NextResponse.json(mappedSpecializations);
    } catch (error) {
        console.error("[PUBLIC_SPECIALIZATIONS_GET]", error);
        if (error && typeof error === "object" && "code" in error && error.code === "P1001") {
            return NextResponse.json(
                { error: "Specializations are temporarily unavailable. Please try again shortly." },
                { status: 503, headers: { "Retry-After": "30" } }
            );
        }
        return NextResponse.json({ error: "Unable to load specializations" }, { status: 500 });
    }
}
