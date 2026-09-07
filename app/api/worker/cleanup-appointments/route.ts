import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getReservationThreshold } from "@/lib/booking-reservation";

export async function GET(req: Request) {
    try {
        // 1. Basic security check (Optional: could use a CRON_SECRET env var)
        const authHeader = req.headers.get("authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Pending appointments act as temporary reservations for 15 minutes.
        const threshold = getReservationThreshold();

        // Keep the appointment record for auditability while releasing its slot.
        const released = await db.appointment.updateMany({
            where: {
                status: "PENDING",
                createdAt: {
                    lt: threshold
                }
            },
            data: {
                status: "CANCELLED",
                cancelledBy: "SYSTEM",
                cancellationReason: "Reservation expired",
                cancelledAt: new Date(),
            },
        });

        console.log(`[Cleanup] Released ${released.count} stale pending reservations.`);

        return NextResponse.json({
            message: "Cleanup successful",
            releasedCount: released.count,
            threshold: threshold.toISOString()
        });

    } catch (error: unknown) {
        console.error("[Cleanup Error]:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
    }
}
