import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const addMonths = (date: Date, months: number) => { const next = new Date(date); next.setMonth(next.getMonth() + months); return next; };
const graceDays = Math.max(0, Number(process.env.DOCTOR_PACKAGE_GRACE_DAYS || 7));

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authorization !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dryRun = new URL(request.url).searchParams.get("dryRun") === "true";
  const now = new Date();
  const summary = { dryRun, checked: 0, trialsConverted: 0, periodsRenewed: 0, paymentsCreated: 0, markedPastDue: 0, expired: 0 };
  try {
    const subscriptions = await db.doctorSubscription.findMany({
      where: { status: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] } },
      include: { package: true, payments: { where: { status: { in: ["PENDING", "FAILED"] } }, orderBy: { dueAt: "desc" }, take: 1 } },
    });
    summary.checked = subscriptions.length;
    for (const subscription of subscriptions) {
      const isFreePackage = subscription.package.isFree || Number(subscription.monthlyPrice) === 0;
      const freeEnded = subscription.status === "TRIAL" && (!subscription.freePeriodEndsAt || subscription.freePeriodEndsAt <= now);
      const periodEnded = subscription.currentPeriodEnd <= now;
      const latestDue = subscription.payments[0];
      const graceEnds = latestDue ? new Date(latestDue.dueAt.getTime() + graceDays * 86_400_000) : null;
      if (freeEnded) {
        summary.trialsConverted++;
        if (!dryRun) await db.$transaction(async (tx) => { const periodStart = subscription.freePeriodEndsAt || now; await tx.doctorSubscription.update({ where: { id: subscription.id }, data: { status: isFreePackage ? "ACTIVE" : "ACTIVE", currentPeriodStart: periodStart, currentPeriodEnd: addMonths(periodStart, 1) } }); await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: subscription.id, eventType: "PERIOD_RENEWED", notes: isFreePackage ? "Free package period renewed automatically." : "Free period ended; paid billing is now active." } }); });
        continue;
      }
      if (isFreePackage && periodEnded) {
        summary.periodsRenewed++;
        if (!dryRun) await db.$transaction(async (tx) => { await tx.doctorSubscription.update({ where: { id: subscription.id }, data: { currentPeriodStart: subscription.currentPeriodEnd, currentPeriodEnd: addMonths(subscription.currentPeriodEnd, 1) } }); await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: subscription.id, eventType: "PERIOD_RENEWED", notes: "Free package period renewed automatically." } }); });
        continue;
      }
      if (!isFreePackage && periodEnded && !latestDue) {
        summary.paymentsCreated++;
        if (!dryRun) await db.$transaction(async (tx) => { await tx.doctorPackagePayment.create({ data: { subscriptionId: subscription.id, amount: subscription.monthlyPrice, currency: subscription.currency, dueAt: subscription.currentPeriodEnd, periodStart: subscription.currentPeriodStart, periodEnd: subscription.currentPeriodEnd } }); await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: subscription.id, eventType: "PAYMENT_CREATED", notes: "Monthly package payment is now due." } }); });
      }
      if (!isFreePackage && latestDue && latestDue.dueAt <= now && subscription.status === "ACTIVE") {
        summary.markedPastDue++;
        if (!dryRun) await db.$transaction(async (tx) => { await tx.doctorSubscription.update({ where: { id: subscription.id }, data: { status: "PAST_DUE" } }); await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: subscription.id, eventType: "STATUS_CHANGED", notes: "Subscription marked past due because payment is outstanding." } }); });
      }
      if (!isFreePackage && latestDue && graceEnds && graceEnds <= now && subscription.status === "PAST_DUE") {
        summary.expired++;
        if (!dryRun) await db.$transaction(async (tx) => { await tx.doctorSubscription.update({ where: { id: subscription.id }, data: { status: "EXPIRED", endedAt: now } }); await tx.doctorSubscriptionEvent.create({ data: { subscriptionId: subscription.id, eventType: "STATUS_CHANGED", notes: `Subscription expired after ${graceDays} grace day(s) with an outstanding payment.` } }); });
      }
    }
    return NextResponse.json({ message: dryRun ? "Dry run completed" : "Doctor package renewal job completed", ...summary, ranAt: now.toISOString() });
  } catch (error) { console.error("[DOCTOR_PACKAGE_RENEWALS]", error); return NextResponse.json({ error: "Doctor package renewal job failed" }, { status: 500 }); }
}
