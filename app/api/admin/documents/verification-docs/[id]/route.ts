import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get("entityId");
        const entityType = searchParams.get("entityType");
        const field = searchParams.get("field");

        if (!entityId || !entityType || !field) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        if (entityType === "Doctor") {
            await prisma.doctor.update({
                where: { id: entityId },
                data: { [field]: null }
            });
        } else if (entityType === "Lab") {
            await prisma.lab.update({
                where: { id: entityId },
                data: { [field]: null }
            });
        } else {
            return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
        }

        return NextResponse.json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("[ADMIN_VERIFICATION_DOC_DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
