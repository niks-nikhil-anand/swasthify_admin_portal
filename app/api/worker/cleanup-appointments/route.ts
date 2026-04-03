import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        // 1. Basic security check (Optional: could use a CRON_SECRET env var)
        const authHeader = req.headers.get("authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Define "stale" threshold (e.g., 30 minutes ago)
        const threshold = new Date(Date.now() - 30 * 60 * 1000);

        // 3. Delete PENDING appointments older than the threshold
        const deleted = await db.appointment.deleteMany({
            where: {
                status: "PENDING",
                createdAt: {
                    lt: threshold
                }
            }
        });

        console.log(`[Cleanup] Deleted ${deleted.count} stale PENDING appointments.`);

        return NextResponse.json({
            message: "Cleanup successful",
            deletedCount: deleted.count,
            threshold: threshold.toISOString()
        });

    } catch (error: any) {
        console.error("[Cleanup Error]:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
