import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const addMonth = (date: Date) => { const next = new Date(date); next.setMonth(next.getMonth() + 1); return next; };

export async function POST(request: Request) {
  try {
    const { packageId } = await request.json();
    const token = (await cookies()).get("DOCTOR")?.value;
    if (!token || typeof packageId !== "string") return NextResponse.json({ error: "Package selection is required" }, { status: 400 });
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload.role !== "DOCTOR" || !payload.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [doctor, doctorPackage] = await Promise.all([db.doctor.findUnique({ where: { userId: payload.userId as string } }), db.doctorPackage.findUnique({ where: { id: packageId } })]);
    if (!doctor || !doctorPackage?.isActive) return NextResponse.json({ error: "Selected package is unavailable" }, { status: 400 });
    const now = new Date();
    const subscription = await db.$transaction(async (tx) => {
      const created = await tx.doctorSubscription.create({ data: { doctorId: doctor.id, packageId, monthlyPrice: doctorPackage.isFree ? 0 : doctorPackage.monthlyPrice, currency: doctorPackage.currency, status: doctorPackage.isFree ? "ACTIVE" : "PAST_DUE", startedAt: now, currentPeriodStart: now, currentPeriodEnd: addMonth(now, 1) } });
      if (doctorPackage.isFree) await tx.doctorSubscription.updateMany({ where: { doctorId: doctor.id, id: { not: created.id }, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE", "PAUSED"] } }, data: { status: "CANCELLED", cancelledAt: now, endedAt: now } });
      await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: created.id, eventType: "ASSIGNED", notes: doctorPackage.isFree ? "Doctor selected a free package." : "Doctor selected package and is awaiting payment." } });
      return created;
    });
    return NextResponse.json({ subscriptionId: subscription.id, isFree: doctorPackage.isFree });
  } catch (error) { console.error("[DOCTOR_PACKAGE_SELECT]", error); return NextResponse.json({ error: "Unable to select package" }, { status: 500 }); }
}
