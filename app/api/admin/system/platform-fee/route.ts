import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const fees = await db.platformFee.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(fees);
    } catch (error) {
        console.error("[PLATFORM_FEE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            feeType,
            fee,
            discount,
            discountType,
            entityType,
            minAmount,
            maxAmount,
            isActive,
        } = body;

        if (!name || !feeType || fee === undefined || !entityType) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check if a fee for this entity type already exists
        const existingFee = await db.platformFee.findFirst({
            where: {
                entityType,
            },
        });

        let platformFee;

        if (existingFee) {
            platformFee = await db.platformFee.update({
                where: {
                    id: existingFee.id,
                },
                data: {
                    name,
                    description,
                    feeType,
                    fee: parseFloat(fee),
                    discount: parseFloat(discount || 0),
                    discountType,
                    minAmount: minAmount ? parseFloat(minAmount) : null,
                    maxAmount: maxAmount ? parseFloat(maxAmount) : null,
                    isActive: isActive !== undefined ? !!isActive : true,
                },
            });
        } else {
            platformFee = await db.platformFee.create({
                data: {
                    name,
                    description,
                    feeType,
                    fee: parseFloat(fee),
                    discount: parseFloat(discount || 0),
                    discountType,
                    entityType,
                    minAmount: minAmount ? parseFloat(minAmount) : null,
                    maxAmount: maxAmount ? parseFloat(maxAmount) : null,
                    isActive: isActive !== undefined ? !!isActive : true,
                },
            });
        }

        return NextResponse.json(platformFee);
    } catch (error) {
        console.error("[PLATFORM_FEE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            id,
            name,
            description,
            feeType,
            fee,
            discount,
            discountType,
            entityType,
            minAmount,
            maxAmount,
            isActive,
        } = body;

        if (!id) {
            return new NextResponse("Fee ID is required", { status: 400 });
        }

        const platformFee = await db.platformFee.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                feeType,
                fee: fee !== undefined ? parseFloat(fee) : undefined,
                discount: discount !== undefined ? parseFloat(discount) : undefined,
                discountType,
                entityType,
                minAmount: minAmount !== undefined ? (minAmount ? parseFloat(minAmount) : null) : undefined,
                maxAmount: maxAmount !== undefined ? (maxAmount ? parseFloat(maxAmount) : null) : undefined,
                isActive: isActive !== undefined ? !!isActive : undefined,
            },
        });

        return NextResponse.json(platformFee);
    } catch (error) {
        console.error("[PLATFORM_FEE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
