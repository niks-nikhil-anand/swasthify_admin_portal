import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import DoctorBlockedEmail from "@/emails/DoctorBlockedEmail";
import DoctorActiveEmail from "@/emails/DoctorActiveEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

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
            permissions,
            isProfileComplete,
            profileCompletionPercentage
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

        const oldStatus = doctor.user.status;

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
                    // Permission fields
                    permissions,
                    isProfileComplete,
                    profileCompletionPercentage: profileCompletionPercentage ? Number(profileCompletionPercentage) : undefined,
                },
                include: {
                    user: true,
                    specializations: true,
                }
            });
        });

        // Send Email Notifications based on status change
        // We do this after the transaction to ensure data is committed
        if (status && status !== oldStatus) {
            try {
                const userEmail = doctor.user.email;
                const userName = doctor.user.name;

                if (status === "BLOCKED") {
                    await resend.emails.send({
                        from: "Swasthify <noreply@swasthify.in>",
                        to: userEmail,
                        subject: "Your Swasthify Account Has Been Blocked",
                        react: DoctorBlockedEmail({ name: userName }),
                    });
                } else if (status === "ACTIVE") {
                    await resend.emails.send({
                        from: "Swasthify <noreply@swasthify.in>",
                        to: userEmail,
                        subject: "Your Swasthify Account Is Now Active",
                        react: DoctorActiveEmail({ name: userName }),
                    });
                }
            } catch (emailError) {
                console.error("Failed to send status change email:", emailError);
                // We don't fail the request if email fails, just log it
            }
        }

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
