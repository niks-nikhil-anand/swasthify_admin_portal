import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: Promise<{ packageId: string }> }) {
  try {
    const { packageId } = await params;
    const doctorPackage = await db.$transaction(async (tx) => {
      const target = await tx.doctorPackage.findUnique({ where: { id: packageId } });
      if (!target) throw new Error("Package not found");
      if (!target.isActive) throw new Error("An inactive package cannot be the default");
      await tx.doctorPackage.updateMany({ data: { isDefault: false }, where: { isDefault: true } });
      return tx.doctorPackage.update({ where: { id: packageId }, data: { isDefault: true } });
    });
    return NextResponse.json(doctorPackage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to set default package";
    return new NextResponse(message, { status: message === "Unable to set default package" ? 500 : 400 });
  }
}
