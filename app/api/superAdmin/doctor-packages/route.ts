import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const supportedCurrencies = new Set(["INR", "USD", "EUR", "GBP"]);

function normalisePackage(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const monthlyPrice = Number(body.monthlyPrice);
  const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "INR";
  const isFree = Boolean(body.isFree);

  if (!name) throw new Error("Package name is required");
  if (!Number.isFinite(monthlyPrice) || monthlyPrice < 0) {
    throw new Error("Monthly price must be a non-negative number");
  }
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

export async function GET() {
  try {
    const packages = await db.doctorPackage.findMany({
      include: { _count: { select: { subscriptions: true } } },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("[DOCTOR_PACKAGES_GET]", error);
    return new NextResponse("Unable to load doctor packages", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = normalisePackage(await request.json());
    const doctorPackage = await db.doctorPackage.create({ data: payload });
    return NextResponse.json(doctorPackage, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create doctor package";
    return new NextResponse(message, { status: message === "Unable to create doctor package" ? 500 : 400 });
  }
}
