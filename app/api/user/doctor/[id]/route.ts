import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const doctor = await db.doctor.findUnique({
            where: { id },
            include: {
                user: true,
                specializations: true,
            },
        });

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
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
            // Doctor fields
            bio,
            experienceYears,
            consultationFee,
            qualification,
            clinicPhone,
            clinicName,
            hospitalName,
            licenseNumber,
        } = body;

        // First check if doctor exists
        const doctor = await db.doctor.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        // Update Doctor and User
        const updatedDoctor = await db.$transaction(async (tx) => {
            // Update User if needed
            if (name || phone || isVerified !== undefined || status) {
                await tx.user.update({
                    where: { id: doctor.userId },
                    data: {
                        name,
                        phone,
                        isVerified,
                        status,
                    },
                });
            }

            // Update Doctor
            return await tx.doctor.update({
                where: { id },
                data: {
                    bio,
                    experienceYears: experienceYears ? Number(experienceYears) : undefined,
                    consultationFee: consultationFee ? Number(consultationFee) : undefined,
                    qualification,
                    clinicPhone,
                    clinicName,
                    hospitalName,
                    licenseNumber,
                },
                include: {
                    user: true,
                    specializations: true,
                }
            });
        });

        return NextResponse.json(updatedDoctor);
    } catch (error) {
        console.error("Error updating doctor:", error);
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

        const doctor = await db.doctor.findUnique({
            where: { id },
        });

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        // Delete doctor
        await db.doctor.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
