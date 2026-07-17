import { db } from "@/lib/db";

export async function getDoctorCampaignEntitlement(doctorId: string) {
  const subscription = await db.doctorSubscription.findFirst({ where: { doctorId, status: { in: ["ACTIVE", "TRIAL"] } }, include: { package: true }, orderBy: { createdAt: "desc" } });
  if (!subscription) return { allowed: false, reason: "An active package is required before creating campaigns.", used: 0, limit: 0, remaining: 0, subscription: null };
  const limits = subscription.package.limits && typeof subscription.package.limits === "object" && !Array.isArray(subscription.package.limits) ? subscription.package.limits as Record<string, unknown> : {};
  const limit = typeof limits.campaignsPerMonth === "number" ? limits.campaignsPerMonth : null;
  const used = await db.campaign.count({ where: { doctorId, createdAt: { gte: subscription.currentPeriodStart, lt: subscription.currentPeriodEnd } } });
  const remaining = limit === null ? null : Math.max(0, limit - used);
  return { allowed: remaining === null || remaining > 0, reason: remaining === 0 ? `You have reached your ${limit}-campaign limit for this billing period.` : null, used, limit, remaining, periodEnd: subscription.currentPeriodEnd, packageName: subscription.package.name, subscriptionStatus: subscription.status, subscription: { id: subscription.id } };
}
