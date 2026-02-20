import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const referer = req.headers.get("referer") || "";

        // Determine which token to check
        let token: string | undefined;
        let roleType: string | undefined;

        // Check Authorization header for Bearer token
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // Fallback to cookies if no Bearer token
        if (!token) {
            if (referer.includes("/superAdmin")) {
                token = cookieStore.get("SUPER_ADMIN")?.value;
                roleType = "SUPER_ADMIN";
            } else if (referer.includes("/doctor-panel")) {
                token = cookieStore.get("DOCTOR")?.value;
                roleType = "DOCTOR";
            } else if (referer.includes("/lab-panel")) {
                token = cookieStore.get("LAB")?.value;
                roleType = "LAB";
            } else if (referer.includes("/me") || referer.includes("/")) {
                token = cookieStore.get("PATIENT")?.value;
                roleType = "PATIENT";
            }

            // Fallback to any available token if the specific one isn't found
            if (!token) {
                token = cookieStore.get("SUPER_ADMIN")?.value ||
                    cookieStore.get("DOCTOR")?.value ||
                    cookieStore.get("LAB")?.value ||
                    cookieStore.get("PATIENT")?.value;
            }
        }

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const user = await db.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                patients: { take: 1 },
                doctor: true,
                lab: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                patient: user.patients[0] || null,
                doctor: user.doctor || null,
                lab: user.lab || null,
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
