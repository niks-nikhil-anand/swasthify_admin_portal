import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password must be at most 16 characters")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol"),
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
        const validatedData = passwordSchema.parse(body);

        // Find user
        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found or password not set" }, { status: 404 });
        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(validatedData.currentPassword, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

        // Update password
        await db.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Password change error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
