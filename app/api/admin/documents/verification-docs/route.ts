import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const [doctors, labs] = await Promise.all([
            prisma.doctor.findMany({
                where: {
                    OR: [
                        { idProof: { not: null } },
                        { associationProof: { not: null } }
                    ]
                },
                include: { user: true }
            }),
            prisma.lab.findMany({
                where: {
                    OR: [
                        { ownerIdProof: { not: null } },
                        { addressProof: { not: null } }
                    ]
                },
                include: { user: true }
            })
        ]);

        const formattedDocs: any[] = [];

        // Add Doctor Docs
        doctors.forEach((doctor: any) => {
            if (doctor.idProof) {
                formattedDocs.push({
                    id: `${doctor.id}-idProof`,
                    entityId: doctor.id,
                    userId: doctor.userId,
                    entityName: doctor.user.name || "Unknown Doctor",
                    entityType: "Doctor",
                    docType: "ID Proof",
                    fileUrl: doctor.idProof,
                    submissionDate: doctor.createdAt.toISOString().split("T")[0],
                    createdAt: doctor.createdAt,
                    field: "idProof"
                });
            }
            if (doctor.associationProof) {
                formattedDocs.push({
                    id: `${doctor.id}-associationProof`,
                    entityId: doctor.id,
                    userId: doctor.userId,
                    entityName: doctor.user.name || "Unknown Doctor",
                    entityType: "Doctor",
                    docType: "Association Proof",
                    fileUrl: doctor.associationProof,
                    submissionDate: doctor.createdAt.toISOString().split("T")[0],
                    createdAt: doctor.createdAt,
                    field: "associationProof"
                });
            }
        });

        // Add Lab Docs
        labs.forEach((lab: any) => {
            if (lab.ownerIdProof) {
                formattedDocs.push({
                    id: `${lab.id}-ownerIdProof`,
                    entityId: lab.id,
                    userId: lab.userId,
                    entityName: lab.user.name || "Unknown Lab",
                    entityType: "Lab",
                    docType: "Owner ID Proof",
                    fileUrl: lab.ownerIdProof,
                    submissionDate: lab.createdAt.toISOString().split("T")[0],
                    createdAt: lab.createdAt,
                    field: "ownerIdProof"
                });
            }
            if (lab.addressProof) {
                formattedDocs.push({
                    id: `${lab.id}-addressProof`,
                    entityId: lab.id,
                    userId: lab.userId,
                    entityName: lab.user.name || "Unknown Lab",
                    entityType: "Lab",
                    docType: "Address Proof",
                    fileUrl: lab.addressProof,
                    submissionDate: lab.createdAt.toISOString().split("T")[0],
                    createdAt: lab.createdAt,
                    field: "addressProof"
                });
            }
        });

        // Sort by newest first
        formattedDocs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return NextResponse.json(formattedDocs);
    } catch (error) {
        console.error("[ADMIN_VERIFICATION_DOCS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
