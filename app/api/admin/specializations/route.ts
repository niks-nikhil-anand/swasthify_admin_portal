import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { uploadToS3 } from "@/lib/s3";

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

export async function GET(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const specializations = await db.specialization.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(specializations);
    } catch (error) {
        console.error("[SPECIALIZATIONS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const type = formData.get("type") as string || "DOCTOR";
        const startingPrice = parseFloat(formData.get("startingPrice") as string || "0");
        const description = formData.get("description") as string;
        const imageFile = formData.get("image") as File;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        let imageUrl = null;
        if (imageFile) {
            const fileName = `specializations/${Date.now()}-${imageFile.name}`;
            imageUrl = await uploadToS3(imageFile, fileName, imageFile.type);
        }

        const specialization = await db.specialization.create({
            data: {
                name,
                type: type as any,
                startingPrice,
                description,
                image: imageUrl
            }
        });

        return NextResponse.json(specialization);
    } catch (error: any) {
        console.error("[SPECIALIZATIONS_POST]", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Specialization with this name already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
