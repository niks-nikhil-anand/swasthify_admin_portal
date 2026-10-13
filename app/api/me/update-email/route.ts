import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getPatientUserId } from "@/lib/patient-auth";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function PATCH(req: Request) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { email: newEmail } = emailSchema.parse(body);

        // Check if email is already in use by another user
        const existingUser = await db.user.findFirst({
            where: {
                email: newEmail,
                NOT: { id: userId },
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
        }

        // Update User email
        await db.user.update({
            where: { id: userId },
            data: { email: newEmail },
        });

        return NextResponse.json({
            message: "Email updated successfully",
        });
    } catch (error) {
        console.error("Email update error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
