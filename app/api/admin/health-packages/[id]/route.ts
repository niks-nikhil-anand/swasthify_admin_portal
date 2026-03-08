import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        if (!id) {
            return new NextResponse("Package ID is required", { status: 400 });
        }

        const healthPackage = await db.healthPackage.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                purpose,
                image,
                price: price !== undefined ? parseFloat(price) : undefined,
                originalPrice: originalPrice !== undefined ? parseFloat(originalPrice) : undefined,
                discount,
                tests,
                keywords,
                category,
                isActive: isActive !== undefined ? !!isActive : undefined,
            },
        });

        return NextResponse.json(healthPackage);
    } catch (error) {
        console.error("[HEALTH_PACKAGE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return new NextResponse("Package ID is required", { status: 400 });
        }

        const healthPackage = await db.healthPackage.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(healthPackage);
    } catch (error) {
        console.error("[HEALTH_PACKAGE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
