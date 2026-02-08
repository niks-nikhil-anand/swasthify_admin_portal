import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { DoctorValidation } from "@/lib/validators"
import { Role, UserStatus } from "@prisma/client"
import { Resend } from "resend";
import DoctorApplicationEmail from "@/emails/DoctorApplicationEmail";
import { logAuthEvent } from "@/lib/auth-tracking";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = DoctorValidation.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.flatten() },
                { status: 400 }
            )
        }

        const validatedData = result.data

        // Check availability
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { phone: validatedData.phone }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or phone already exists" },
                { status: 409 }
            )
        }

        const name = `${validatedData.firstName} ${validatedData.lastName || ""}`.trim()

        const newUser = await db.$transaction(async (tx) => {
            // 1. Create User (Password is optional now)
            const user = await tx.user.create({
                data: {
                    name,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    role: Role.DOCTOR,
                    isVerified: false,
                    status: UserStatus.PENDING
                }
            })

            // 2. Map Specializations
            const specializations = validatedData.specialization.map(id => {
                // Convert IDs like "general_physician" to "General Physician"
                // Assuming the ID from frontend is roughly the name, or we just format it nicely
                // Ideally this mapping should be more robust or fetched from a constant, 
                // but strictly following the plan:
                const formattedName = id.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')

                return {
                    where: { name: formattedName },
                    create: { name: formattedName }
                }
            })

            // 3. Create Doctor
            await tx.doctor.create({
                data: {
                    userId: user.id,
                    qualification: validatedData.qualification,
                    experienceYears: parseInt(validatedData.experience) || 0,
                    licenseNumber: validatedData.licenseNumber,
                    clinicName: validatedData.clinicName,
                    hospitalName: validatedData.hospitalName,
                    specializations: {
                        connectOrCreate: specializations
                    }
                }
            })

            // 4. Create Address
            await tx.address.create({
                data: {
                    userId: user.id,
                    street: validatedData.street,
                    city: validatedData.city,
                    state: validatedData.state,
                    zipCode: validatedData.zipCode,
                    country: validatedData.country,
                    label: "Clinic"
                }
            })

            return user
        })

        // Log sign-up event
        await logAuthEvent(newUser.id, "SIGN_UP");

        // Send email notification
        try {
            await resend.emails.send({
                from: "Swasthify <onboarding@swasthify.in>",
                to: validatedData.email,
                subject: "Welcome to Swasthify - Application Received",
                react: DoctorApplicationEmail({
                    name: name
                })
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Non-blocking error
        }

        return NextResponse.json({
            message: "Doctor registration successful",
            userId: newUser.id
        }, { status: 201 })

    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const doctors = await db.doctor.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                        isVerified: true,
                        createdAt: true,
                        addresses: true
                    }
                },
                specializations: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.user.name,
            email: doctor.user.email,
            phone: doctor.user.phone,
            specialization: doctor.specializations.map(s => s.name).join(", "),
            qualification: doctor.qualification,
            experience: doctor.experienceYears,
            status: doctor.user.status,
            isVerified: doctor.user.isVerified,
            clinicName: doctor.clinicName,
            joinedDate: doctor.user.createdAt,
            city: doctor.user.addresses.find(a => a.label === "Clinic")?.city || "N/A",
            permissions: (doctor as any).permissions,
            isProfileComplete: (doctor as any).isProfileComplete,
            profileCompletionPercentage: (doctor as any).profileCompletionPercentage
        }))

        return NextResponse.json(formattedDoctors)
    } catch (error) {
        console.error("Error fetching doctors:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
