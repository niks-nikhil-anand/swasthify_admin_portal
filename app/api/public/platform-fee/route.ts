import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // Fetch all active platform fees
        const fees = await db.platformFee.findMany({
            where: {
                isActive: true,
            }
        });

        // We'll return the fees so the frontend can find the most relevant one (DOCTOR or ALL)
        return NextResponse.json(fees);
    } catch (error) {
        console.error("[PUBLIC_PLATFORM_FEE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
