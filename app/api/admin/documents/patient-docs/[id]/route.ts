import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
        }

        await db.docs.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("[ADMIN_DOC_DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
