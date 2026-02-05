import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const patients = await db.patient.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        phone: true,
                        status: true,
                        lastLogin: true,
                    },
                },
                appointments: {
                    orderBy: {
                        dateTime: "desc",
                    },
                    take: 1,
                    select: {
                        dateTime: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedPatients = patients.map((patient) => ({
            id: patient.id,
            name: patient.name || "N/A",
            email: patient.user.email || "N/A",
            age: patient.dateOfBirth
                ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                : "N/A",
            gender: patient.gender ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase() : "N/A",
            contact: patient.user.phone || "N/A",
            bloodGroup: patient.bloodGroup || "N/A",
            lastVisit: patient.appointments[0]?.dateTime.toISOString().split("T")[0] || "No visits",
            status: patient.user.status === "ACTIVE" ? "Active" : "Inactive",
        }));

        return NextResponse.json(formattedPatients);
    } catch (error) {
        console.error("[PATIENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
