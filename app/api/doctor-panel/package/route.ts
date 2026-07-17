import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { getDoctorCampaignEntitlement } from "@/lib/doctor-package-entitlement";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const token = (await cookies()).get("DOCTOR")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (!payload.userId || payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const doctor = await db.doctor.findUnique({ where: { userId: payload.userId as string }, select: { id: true } });
    if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    const subscription = await db.doctorSubscription.findFirst({
      where: { doctorId: doctor.id, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE", "PAUSED"] } },
      include: {
        package: true,
        payments: { orderBy: { dueAt: "desc" }, take: 12 },
        events: { orderBy: { createdAt: "desc" }, take: 12, select: { id: true, eventType: true, notes: true, createdAt: true } },
      },
      orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
    });

    if (!subscription) return NextResponse.json({ subscription: null, entitlement: await getDoctorCampaignEntitlement(doctor.id) });

    const now = Date.now();
    const periodStart = subscription.currentPeriodStart.getTime();
    const periodEnd = subscription.currentPeriodEnd.getTime();
    const freePeriodEnd = subscription.freePeriodEndsAt?.getTime();
    return NextResponse.json({
      subscription: {
        ...subscription,
        daysRemaining: freePeriodEnd ? Math.max(0, Math.ceil((freePeriodEnd - now) / 86_400_000)) : null,
        periodProgress: periodEnd > periodStart ? Math.min(100, Math.max(0, ((now - periodStart) / (periodEnd - periodStart)) * 100)) : 0,
      },
      entitlement: await getDoctorCampaignEntitlement(doctor.id),
    });
  } catch (error) {
    console.error("[DOCTOR_PACKAGE_GET]", error);
    return NextResponse.json({ error: "Unable to load package details" }, { status: 500 });
  }
}
