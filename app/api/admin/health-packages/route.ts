import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const packages = await db.healthPackage.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(packages);
    } catch (error) {
        console.error("[HEALTH_PACKAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            purpose,
            image,
            price,
            originalPrice,
            discount,
            tests,
            keywords,
            category,
            isActive,
        } = body;

        if (!title || price === undefined || originalPrice === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const healthPackage = await db.healthPackage.create({
            data: {
                title,
                description,
                purpose,
                image,
                price: parseFloat(price),
                originalPrice: parseFloat(originalPrice),
                discount,
                tests: tests || [],
                keywords: keywords || [],
                category: category || "General",
                isActive: isActive !== undefined ? !!isActive : true,
            },
        });

        return NextResponse.json(healthPackage);
    } catch (error) {
        console.error("[HEALTH_PACKAGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
