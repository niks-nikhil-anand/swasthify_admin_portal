import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { role } = body;

        console.log("Logout request received for role:", role);

        const cookieStore = await cookies();
        const authCookies = ["SUPER_ADMIN", "DOCTOR", "PATIENT", "LAB", "PHARMACY", "token"];

        if (role) {
            const roleUpper = role.toUpperCase();
            let primaryCookie = "token";

            if (roleUpper === "SUPERADMIN" || roleUpper === "SUPER_ADMIN") {
                primaryCookie = "SUPER_ADMIN";
            } else if (roleUpper === "DOCTOR") {
                primaryCookie = "DOCTOR";
            } else if (roleUpper === "PATIENT") {
                primaryCookie = "PATIENT";
            } else if (roleUpper === "LAB") {
                primaryCookie = "LAB";
            } else if (roleUpper === "PHARMACY") {
                primaryCookie = "PHARMACY";
            }

            console.log(`Clearing primary cookie: ${primaryCookie}`);
            cookieStore.delete(primaryCookie);
        }

        // Clear all other potential auth cookies just in case
        console.log("Clearing all other potential auth cookies");
        authCookies.forEach(cookie => {
            cookieStore.delete(cookie);
        });

        return NextResponse.json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
