import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const phoneSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
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
