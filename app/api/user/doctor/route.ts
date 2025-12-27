
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { DoctorValidation } from "@/lib/validators"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"
import * as z from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validatedData = DoctorValidation.parse(body)

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

        const hashedPassword = await bcrypt.hash("Doctor@123", 10)

        const name = `${validatedData.firstName} ${validatedData.lastName || ""}`.trim()

        const result = await db.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    name,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    password: hashedPassword,
                    role: Role.DOCTOR,
                    isVerified: false, 
                    status: true
                }
            })

            // 2. Map Specializations
            // Convert "general_physician" -> "General Physician"
            const specializations = validatedData.specialization.map(id => {
                const name = id.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                return {
                    where: { name },
                    create: { name }
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
            userId: result.id 
        }, { status: 201 })

    } catch (error: any) {
        console.error("Registration error:", error)
        if (error instanceof z.ZodError) {
             return NextResponse.json({ error: (error as any).errors }, { status: 400 })
        }
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        )
    }
}
