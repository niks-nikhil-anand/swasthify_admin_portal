import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const profileSchema = z.object({
    name: z.string().optional(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    height: z.number().optional().nullable(),
    weight: z.number().optional().nullable(),
    allergies: z.string().optional().nullable(),
    chronicDiseases: z.string().optional().nullable(),
    emergencyContactName: z.string().optional().nullable(),
    emergencyContactPhone: z.string().optional().nullable(),
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
        const validatedData = profileSchema.parse(body);

        // Find the patient record associated with this user
        const patient = await db.patient.findFirst({
            where: { userId },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        // Update patient record
        const updatedPatient = await db.patient.update({
            where: { id: patient.id },
            data: {
                ...validatedData,
                dateOfBirth: (validatedData.dateOfBirth && validatedData.dateOfBirth.trim() !== "")
                    ? new Date(validatedData.dateOfBirth)
                    : null,
            },
        });

        // Update user name if provided (since Name is also in User model)
        if (validatedData.name) {
            await db.user.update({
                where: { id: userId },
                data: { name: validatedData.name },
            });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            patient: updatedPatient,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
