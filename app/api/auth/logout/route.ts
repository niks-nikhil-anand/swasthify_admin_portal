import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { role } = body;

        console.log("Logout request received for role:", role);

        if (!role) {
            return NextResponse.json(
                { error: "Role is required for logout" },
                { status: 400 }
            );
        }

        const roleUpper = role.toUpperCase();
        let cookieName = "token"; // Default for 'USER', 'ADMIN', etc.

        if (roleUpper === "SUPERADMIN" || roleUpper === "SUPER_ADMIN") {
            cookieName = "SUPER_ADMIN";
        } else if (roleUpper === "DOCTOR") {
            cookieName = "DOCTOR";
        } else if (roleUpper === "PATIENT") {
            cookieName = "PATIENT";
        } else if (roleUpper === "LAB") {
            cookieName = "LAB";
        } else if (roleUpper === "PHARMACY") {
            cookieName = "PHARMACY";
        }

        console.log(`Clearing cookie: ${cookieName}`);

        const cookieStore = await cookies();
        cookieStore.delete(cookieName);

        return NextResponse.json({
            message: "Logout successful",
            clearedCookie: cookieName
        });

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
