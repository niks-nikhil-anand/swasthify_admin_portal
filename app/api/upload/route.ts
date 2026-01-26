import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // 'profile', 'idProof', 'associationProof' or similar

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Basic validation
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        const timestamp = Date.now();
        const fileName = `doctor-uploads/${type}/${timestamp}-${file.name.replace(/\s/g, "-")}`;

        const url = await uploadToS3(file, fileName, file.type);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
