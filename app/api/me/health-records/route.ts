import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { z } from "zod";
import { getPatientUserId } from "@/lib/patient-auth";

const documentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Find the patient record associated with this user
        const patient = await db.patient.findFirst({
            where: { userId },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate metadata
        const validatedData = documentSchema.parse({ title, description, category });

        // Basic validation for file
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and PDF are allowed." }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit for records
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }

        const timestamp = Date.now();
        const fileName = `health-records/${patient.id}/${timestamp}-${file.name.replace(/\s/g, "-")}`;

        const fileUrl = await uploadToS3(file, fileName, file.type);
        const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));

        // Create document entry in database
        const document = await db.docs.create({
            data: {
                patientId: patient.id,
                title: validatedData.title,
                description: validatedData.description,
                category: validatedData.category,
                fileUrl,
                sizeMb,
                uploadedBy: patient.id, // Uploaded by the patient themselves
            },
        });

        return NextResponse.json({
            message: "Health record uploaded successfully",
            document,
        });
    } catch (error) {
        console.error("Health record upload error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const patient = await db.patient.findFirst({
            where: { userId },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        const documents = await db.docs.findMany({
            where: { patientId: patient.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ documents });
    } catch (error) {
        console.error("Fetch health records error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
