import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const transitions = new Set(["ACTIVE", "PAUSED", "CANCELLED"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ subscriptionId: string }> }) {
  try {
    const { subscriptionId } = await params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : undefined;
    const notes = typeof body.notes === "string" ? body.notes.trim() || null : null;
    if (!status || !transitions.has(status)) return NextResponse.json({ error: "Invalid subscription status" }, { status: 400 });
    const current = await db.doctorSubscription.findUnique({ where: { id: subscriptionId } });
    if (!current) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    const subscription = await db.$transaction(async (tx) => {
      const updated = await tx.doctorSubscription.update({ where: { id: subscriptionId }, data: { status: status as "ACTIVE" | "PAUSED" | "CANCELLED", cancelledAt: status === "CANCELLED" ? new Date() : null, endedAt: status === "CANCELLED" ? new Date() : null } });
      await tx.doctorSubscriptionEvent.create({ data: { subscriptionId, eventType: status === "PAUSED" ? "PAUSED" : status === "CANCELLED" ? "CANCELLED" : "REACTIVATED", notes } });
      return updated;
    });
    return NextResponse.json(subscription);
  } catch (error) {
    console.error("[DOCTOR_SUBSCRIPTION_PATCH]", error);
    return NextResponse.json({ error: "Unable to update subscription" }, { status: 500 });
  }
}
