import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { DoctorValidation } from "@/lib/validators"
import { Role } from "@prisma/client"
import * as z from "zod"

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
                    status: true
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
