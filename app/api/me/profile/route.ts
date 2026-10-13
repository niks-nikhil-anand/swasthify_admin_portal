import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getPatientUserId } from "@/lib/patient-auth";

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
    profilePic: z.string().optional().nullable(),
});

export async function PATCH(req: Request) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        console.log("PROFILE UPDATE REQUEST BODY:", body);
        const validatedData = profileSchema.parse(body);

        // Find the patient record associated with this user
        const patient = await db.patient.findFirst({
            where: { userId },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        // Update patient record
        const updateData: any = { ...validatedData };

        if (validatedData.dateOfBirth !== undefined) {
            updateData.dateOfBirth = (validatedData.dateOfBirth && validatedData.dateOfBirth.trim() !== "")
                ? new Date(validatedData.dateOfBirth)
                : null;
        }

        const updatedPatient = await db.patient.update({
            where: { id: patient.id },
            data: updateData,
        });

        // Update user name and profilePic if provided
        const userUpdateData: any = {};
        if (validatedData.name) userUpdateData.name = validatedData.name;
        if (validatedData.profilePic) userUpdateData.profilePic = validatedData.profilePic;

        if (Object.keys(userUpdateData).length > 0) {
            console.log("UPDATING USER MODEL WITH:", userUpdateData);
            await db.user.update({
                where: { id: userId },
                data: userUpdateData,
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
