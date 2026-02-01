import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getAuthenticatedLabId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("LAB");

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        if (!payload.userId || payload.role !== "LAB") return null;

        const lab = await prisma.lab.findFirst({
            where: { userId: payload.userId as string }
        });

        return lab ? lab.id : null;
    } catch (error) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        console.log("LAB PROFILE GET: Request Received");
        const labId = await getAuthenticatedLabId();
        console.log("LAB PROFILE GET: Lab ID:", labId);

        if (!labId) {
            console.error("LAB PROFILE GET: Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const lab = await prisma.lab.findUnique({
            where: { id: labId },
            include: { user: true }
        });

        if (!lab) {
            console.error("LAB PROFILE GET: Lab not found");
            return NextResponse.json({ error: "Lab profile not found" }, { status: 404 });
        }

        // Fetch address
        const address = await prisma.address.findFirst({
            where: { userId: lab.userId, label: "Main Lab" }
        });

        console.log("LAB PROFILE GET: Success", { labId, name: lab.user.name });

        return NextResponse.json({
            success: true,
            lab: {
                ...lab,
                labName: lab.user.name || "",
                email: lab.user.email,
                phone: lab.user.phone,
                address: address?.street || "",
                city: address?.city || "",
                zip: address?.zipCode || ""
            }
        });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        console.log("LAB PROFILE PATCH: Request Received");
        const labId = await getAuthenticatedLabId();
        console.log("LAB PROFILE PATCH: Lab ID:", labId);

        if (!labId) {
            console.error("LAB PROFILE PATCH: Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("LAB PROFILE PATCH: Body:", JSON.stringify(body, null, 2));

        const {
            labName,
            email,
            phone,
            description,
            website,
            licenseNumber,
            address,
            city,
            zip,
            ownerIdProof,
            addressProof,
            profilePhoto
        } = body;

        // Calculate profile completion percentage
        let filledFields = 0;

        const fieldsToCheck = [
            labName, email, phone, description,
            licenseNumber, address, city, zip,
            ownerIdProof, addressProof
        ];

        fieldsToCheck.forEach(field => {
            if (field && field.trim() !== "") filledFields++;
        });

        const percentage = Math.round((filledFields / fieldsToCheck.length) * 100);
        console.log("LAB PROFILE PATCH: Calculated Completion:", percentage);

        const lab = await prisma.lab.findUnique({
            where: { id: labId },
            include: { user: true }
        });

        if (!lab) {
            return NextResponse.json({ error: "Lab not found" }, { status: 404 });
        }

        // Transaction
        const updatedLab = await prisma.$transaction(async (tx: any) => {
            // Update User
            console.log("LAB PROFILE PATCH: Updating User...", { userId: lab.userId, name: labName });
            await tx.user.update({
                where: { id: lab.userId },
                data: {
                    name: labName,
                    email: email,
                    phone: phone
                }
            });

            // Update Lab
            console.log("LAB PROFILE PATCH: Updating Lab...");
            return await tx.lab.update({
                where: { id: labId },
                data: {
                    description,
                    website,
                    licenseNumber,
                    ownerIdProof,
                    addressProof,
                    profilePhoto,
                    isProfileComplete: percentage === 100,
                    profileCompletionPercentage: percentage
                }
            });
        });

        // Handle Address
        console.log("LAB PROFILE PATCH: Handling Address...");
        const existingAddress = await prisma.address.findFirst({
            where: { userId: lab.userId, label: "Main Lab" }
        });

        if (existingAddress) {
            await prisma.address.update({
                where: { id: existingAddress.id },
                data: {
                    street: address,
                    city: city,
                    zipCode: zip
                }
            });
        } else {
            await prisma.address.create({
                data: {
                    userId: lab.userId,
                    label: "Main Lab",
                    street: address,
                    city: city,
                    state: "Maharashtra", // Default
                    zipCode: zip,
                    country: "India"
                }
            });
        }

        console.log("LAB PROFILE PATCH: Success");
        return NextResponse.json({ success: true, lab: updatedLab });

    } catch (error: any) {
        console.error("Profile update error:", error);
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'Field';
            console.error("LAB PROFILE PATCH: Unique Constraint Violation:", field);
            return NextResponse.json(
                { error: `${field} is already in use.` },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
