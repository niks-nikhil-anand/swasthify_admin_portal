import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("PATIENT")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

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
