import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 1. Find user to confirm they exist and get their role
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 2. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update the password in the database
        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                // Also clear any legacy reset tokens if they exist
                resetToken: null,
                resetTokenExpiry: null
            },
        });

        console.log(`Password synced for user: ${email}, Role: ${user.role}`);

        return NextResponse.json({
            message: "Password updated successfully in database",
            role: user.role
        });

    } catch (error) {
        console.error("Password sync error:", error);
        return NextResponse.json(
            { error: "Internal server error during password sync" },
            { status: 500 }
        );
    }
}
