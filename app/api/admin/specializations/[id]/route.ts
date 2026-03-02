import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("SUPER_ADMIN") || cookieStore.get("ADMIN");

    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);
        return payload.role === "SUPER_ADMIN" || payload.role === "ADMIN";
    } catch (error) {
        return false;
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const imageFile = formData.get("image") as File;

        const existingSpecialization = await db.specialization.findUnique({
            where: { id: id }
        });

        if (!existingSpecialization) {
            return NextResponse.json({ error: "Specialization not found" }, { status: 404 });
        }

        let imageUrl = existingSpecialization.image;

        if (imageFile) {
            // Upload new image
            const fileName = `specializations/${Date.now()}-${imageFile.name}`;
            imageUrl = await uploadToS3(imageFile, fileName, imageFile.type);

            // Delete old image if it exists
            if (existingSpecialization.image) {
                await deleteFromS3(existingSpecialization.image);
            }
        }

        const specialization = await db.specialization.update({
            where: { id: id },
            data: {
                name,
                type: type as any,
                description,
                image: imageUrl
            }
        });

        return NextResponse.json(specialization);
    } catch (error: any) {
        console.error("[SPECIALIZATION_PATCH]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const specialization = await db.specialization.findUnique({
            where: { id: id }
        });

        if (specialization?.image) {
            await deleteFromS3(specialization.image);
        }

        await db.specialization.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[SPECIALIZATION_DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
