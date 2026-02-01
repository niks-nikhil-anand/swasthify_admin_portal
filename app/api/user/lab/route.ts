import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { LabValidation } from "@/lib/validators"
import { Role, UserStatus } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = LabValidation.safeParse(body)

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

        const newUser = await db.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    name: validatedData.labName,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    role: Role.LAB,
                    isVerified: false,
                    status: UserStatus.PENDING
                }
            })

            // 2. Create Lab Profile
            await tx.lab.create({
                data: {
                    userId: user.id,
                    licenseNumber: validatedData.licenseNumber,
                    website: validatedData.website,
                    description: validatedData.description,
                    testTypes: validatedData.testTypes,
                }
            })

            // 3. Create Address
            await tx.address.create({
                data: {
                    userId: user.id,
                    street: validatedData.street,
                    city: validatedData.city,
                    state: validatedData.state,
                    zipCode: validatedData.zipCode,
                    country: validatedData.country,
                    label: "Main Lab"
                }
            })

            return user
        })

        return NextResponse.json({
            message: "Lab registration successful",
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
        const labs = await db.lab.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                        isVerified: true,
                    }
                },
                addresses: true
            }
        })

        // Transform data to match UI needs
        const formattedLabs = labs.map(lab => ({
            id: lab.id,
            name: lab.user.name,
            email: lab.user.email,
            contact: lab.user.phone || "N/A",
            location: lab.addresses.find(a => a.isDefault || a.label === "Main Lab")?.city
                ? `${lab.addresses.find(a => a.isDefault || a.label === "Main Lab")?.city}, ${lab.addresses.find(a => a.isDefault || a.label === "Main Lab")?.state}`
                : "Location N/A",
            status: lab.user.status,
            isVerified: lab.user.isVerified,
            rating: lab.averageRating,
            description: lab.description,
            website: lab.website,
            licenseNumber: lab.licenseNumber,
            testTypes: lab.testTypes,
            userId: lab.userId
        }))

        return NextResponse.json(formattedLabs)
    } catch (error) {
        console.error("Error fetching labs:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
