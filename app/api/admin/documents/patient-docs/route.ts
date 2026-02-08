import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const documents = await db.docs.findMany({
            include: {
                patient: {
                    select: {
                        name: true,
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedDocs = documents.map((doc: any) => ({
            id: doc.id,
            patientName: doc.patient.name || "N/A",
            docType: doc.category || "General",
            uploadDate: doc.createdAt.toISOString().split("T")[0],
            status: "Approved", // Currently, all records are implicitly approved or don't have a status field in schema
            size: `${doc.sizeMb || 0} MB`,
            fileUrl: doc.fileUrl,
            uploadedBy: doc.uploadedBy,
            title: doc.title,
            description: doc.description
        }));

        return NextResponse.json(formattedDocs);
    } catch (error) {
        console.error("[ADMIN_DOCS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
