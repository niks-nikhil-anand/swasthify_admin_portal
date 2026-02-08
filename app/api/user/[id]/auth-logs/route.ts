import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const authLogs = await db.authLog.findMany({
            where: { userId: id },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ authLogs });
    } catch (error) {
        console.error("Error fetching auth logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch auth logs" },
            { status: 500 }
        );
    }
}
