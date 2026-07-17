import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export async function GET(_request: Request, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const subscriptions = await db.doctorSubscription.findMany({
      where: { doctorId },
      include: { package: true, payments: { orderBy: { dueAt: "desc" } }, events: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("[DOCTOR_SUBSCRIPTIONS_GET]", error);
    return NextResponse.json({ error: "Unable to load subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const body = await request.json();
    const packageId = typeof body.packageId === "string" ? body.packageId : "";
    const freeMonthsGranted = Math.max(0, Number(body.freeMonthsGranted) || 0);
    const overridePrice = body.monthlyPrice === undefined || body.monthlyPrice === "" ? undefined : Number(body.monthlyPrice);
    const notes = typeof body.notes === "string" ? body.notes.trim() || null : null;
    if (!packageId) return NextResponse.json({ error: "Package is required" }, { status: 400 });
    if (overridePrice !== undefined && (!Number.isFinite(overridePrice) || overridePrice < 0)) return NextResponse.json({ error: "Invalid monthly price" }, { status: 400 });

    const [doctor, doctorPackage] = await Promise.all([
      db.doctor.findUnique({ where: { id: doctorId }, select: { id: true } }),
      db.doctorPackage.findUnique({ where: { id: packageId } }),
    ]);
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    if (!doctorPackage || !doctorPackage.isActive) return NextResponse.json({ error: "Select an active package" }, { status: 400 });

    const startedAt = body.startedAt ? new Date(body.startedAt) : new Date();
    if (Number.isNaN(startedAt.getTime())) return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
    const freePeriodEndsAt = freeMonthsGranted ? addMonths(startedAt, freeMonthsGranted) : null;
    const monthlyPrice = doctorPackage.isFree ? 0 : overridePrice ?? Number(doctorPackage.monthlyPrice);

    const subscription = await db.$transaction(async (tx) => {
      await tx.doctorSubscription.updateMany({
        where: { doctorId, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE", "PAUSED"] } },
        data: { status: "CANCELLED", cancelledAt: new Date(), endedAt: startedAt },
      });
      const created = await tx.doctorSubscription.create({
        data: {
          doctorId, packageId, monthlyPrice, currency: doctorPackage.currency,
          isPriceOverride: overridePrice !== undefined, priceOverrideReason: overridePrice !== undefined ? notes : null,
          status: freePeriodEndsAt ? "TRIAL" : "ACTIVE", startedAt, currentPeriodStart: startedAt,
          currentPeriodEnd: addMonths(startedAt, 1), freeMonthsGranted, freePeriodEndsAt,
        }, include: { package: true },
      });
      await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: created.id, eventType: "ASSIGNED", notes } });
      if (freeMonthsGranted) await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: created.id, eventType: "FREE_MONTHS_GRANTED", notes: `Granted ${freeMonthsGranted} free month(s).${notes ? ` ${notes}` : ""}` } });
      return created;
    });
    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("[DOCTOR_SUBSCRIPTIONS_POST]", error);
    return NextResponse.json({ error: "Unable to assign package" }, { status: 500 });
  }
}
