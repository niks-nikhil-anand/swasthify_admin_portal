import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const supportedCurrencies = new Set(["INR", "USD", "EUR", "GBP"]);

function normalisePackage(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const monthlyPrice = Number(body.monthlyPrice);
  const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "INR";
  const isFree = Boolean(body.isFree);
  if (!name) throw new Error("Package name is required");
  if (!Number.isFinite(monthlyPrice) || monthlyPrice < 0) throw new Error("Monthly price must be a non-negative number");
  if (!supportedCurrencies.has(currency)) throw new Error("Unsupported currency");
  return {
    name,
    description: typeof body.description === "string" ? body.description.trim() || null : null,
    monthlyPrice: isFree ? 0 : monthlyPrice,
    currency,
    isFree,
    isActive: body.isActive !== false,
    benefits: Array.isArray(body.benefits) ? body.benefits.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [],
    limits: body.limits && typeof body.limits === "object" && !Array.isArray(body.limits) ? body.limits : {},
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ packageId: string }> }) {
  try {
    const { packageId } = await params;
    const doctorPackage = await db.doctorPackage.update({
      where: { id: packageId },
      data: normalisePackage(await request.json()),
    });
    return NextResponse.json(doctorPackage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update doctor package";
    return new NextResponse(message, { status: message === "Unable to update doctor package" ? 500 : 400 });
  }
}
