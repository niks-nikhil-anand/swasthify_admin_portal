import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const lab = await db.lab.findUnique({
            where: { id },
            include: {
                user: true,
                addresses: true,
            },
        });

        if (!lab) {
            return NextResponse.json(
                { error: "Lab not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(lab);
    } catch (error) {
        console.error("Error fetching lab:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const {
            // User fields
            name,
            phone,
            isVerified,
            status,
            // Lab fields
            licenseNumber,
            description,
            website,
            testTypes,
        } = body;

        // First check if lab exists
        const lab = await db.lab.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!lab) {
            return NextResponse.json(
                { error: "Lab not found" },
                { status: 404 }
            );
        }

        // Update Lab and User
        const updatedLab = await db.$transaction(async (tx) => {
            // Update User if needed
            if (name || phone || isVerified !== undefined || status) {
                await tx.user.update({
                    where: { id: lab.userId },
                    data: {
                        name,
                        phone,
                        isVerified,
                        status,
                    },
                });
            }

            // Update Lab
            return await tx.lab.update({
                where: { id },
                data: {
                    licenseNumber,
                    description,
                    website,
                    testTypes,
                },
                include: {
                    user: true,
                    addresses: true,
                }
            });
        });

        return NextResponse.json(updatedLab);
    } catch (error) {
        console.error("Error updating lab:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const lab = await db.lab.findUnique({
            where: { id },
        });

        if (!lab) {
            return NextResponse.json(
                { error: "Lab not found" },
                { status: 404 }
            );
        }

        // Delete the User record
        // This will cascade delete the Lab record and other relations due to onDelete: Cascade in schema
        await db.user.delete({
            where: { id: lab.userId },
        });

        return NextResponse.json({ message: "Lab account deleted successfully" });
    } catch (error) {
        console.error("Error deleting lab:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
