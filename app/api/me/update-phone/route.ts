import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getPatientUserId } from "@/lib/patient-auth";

const phoneSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export async function PATCH(req: Request) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { phone: newPhone } = phoneSchema.parse(body);

        // Check if phone is already in use by another user
        const existingUser = await db.user.findFirst({
            where: {
                phone: newPhone,
                NOT: { id: userId },
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Phone number is already in use" }, { status: 409 });
        }

        // Update User phone
        await db.user.update({
            where: { id: userId },
            data: { phone: newPhone },
        });

        return NextResponse.json({
            message: "Phone number updated successfully",
        });
    } catch (error) {
        console.error("Phone update error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
