import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("SUPER_ADMIN")?.value ||
            cookieStore.get("DOCTOR")?.value ||
            cookieStore.get("PATIENT")?.value ||
            cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json({
            user: {
                id: payload.userId,
                email: payload.email,
                role: payload.role
            }
        });

    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        );
    }
}
