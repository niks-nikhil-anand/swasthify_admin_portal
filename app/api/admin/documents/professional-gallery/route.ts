import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const doctors = await prisma.doctor.findMany({
            include: { user: true }
        });

        const formattedDocs: any[] = [];

        doctors.forEach((doctor: any) => {
            if (doctor.clinicImages && doctor.clinicImages.length > 0) {
                doctor.clinicImages.forEach((imgUrl: string, idx: number) => {
                    formattedDocs.push({
                        id: `${doctor.id}-clinicImage-${idx}`,
                        entityId: doctor.id,
                        userId: doctor.userId,
                        entityName: doctor.user.name || "Unknown Doctor",
                        entityType: "Doctor",
                        docType: "Clinic Image",
                        fileUrl: imgUrl,
                        submissionDate: doctor.createdAt.toISOString().split("T")[0],
                        createdAt: doctor.createdAt,
                        field: "clinicImages",
                        imageIndex: idx
                    });
                });
            }
        });

        // Sort by newest first
        formattedDocs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return NextResponse.json(formattedDocs);
    } catch (error) {
        console.error("[ADMIN_CLINIC_IMAGES_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get("entityId");
        const fileUrl = searchParams.get("fileUrl");

        if (!entityId || !fileUrl) {
            return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
        }

        const doctor = await prisma.doctor.findUnique({ where: { id: entityId } });
        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        const newImages = doctor.clinicImages.filter((url: string) => url !== fileUrl);

        await prisma.doctor.update({
            where: { id: entityId },
            data: { clinicImages: newImages }
        });

        return NextResponse.json({ success: true, message: "Clinic image removed" });
    } catch (error) {
        console.error("[ADMIN_CLINIC_IMAGES_DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
