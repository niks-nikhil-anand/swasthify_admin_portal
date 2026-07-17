import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const packages = await db.doctorPackage.findMany({ where: { isActive: true }, orderBy: [{ isDefault: "desc" }, { monthlyPrice: "asc" }] });
    return NextResponse.json(packages);
  } catch (error) { console.error("[DOCTOR_AVAILABLE_PACKAGES]", error); return NextResponse.json({ error: "Unable to load packages" }, { status: 500 }); }
}
