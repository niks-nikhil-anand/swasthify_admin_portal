import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getDoctorId() {
  const token = (await cookies()).get("DOCTOR")?.value;
  if (!token) return null;
  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  if (payload.role !== "DOCTOR" || !payload.userId) return null;
  return (await db.doctor.findUnique({ where: { userId: payload.userId as string }, select: { id: true } }))?.id || null;
}

export async function POST(request: Request) {
  try {
    const doctorId = await getDoctorId();
    if (!doctorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const subscription = await db.doctorSubscription.findFirst({
      where: {
        doctorId,
        ...(typeof body.subscriptionId === "string" ? { id: body.subscriptionId } : {}),
        status: { in: ["ACTIVE", "PAST_DUE"] },
      },
      include: { payments: { where: { status: "PENDING" }, orderBy: { dueAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });
    if (!subscription || Number(subscription.monthlyPrice) <= 0) return NextResponse.json({ error: "No paid package is available for payment" }, { status: 400 });
    if (subscription.freePeriodEndsAt && subscription.freePeriodEndsAt > new Date()) return NextResponse.json({ error: "Your free period is still active" }, { status: 400 });
    let payment = subscription.payments[0] || await db.doctorPackagePayment.findUnique({ where: { subscriptionId_periodStart_periodEnd: { subscriptionId: subscription.id, periodStart: subscription.currentPeriodStart, periodEnd: subscription.currentPeriodEnd } } });
    if (payment?.status === "PAID") return NextResponse.json({ error: "This period has already been paid" }, { status: 409 });
    if (!payment) payment = await db.doctorPackagePayment.create({ data: { subscriptionId: subscription.id, amount: subscription.monthlyPrice, currency: subscription.currency, dueAt: subscription.currentPeriodEnd, periodStart: subscription.currentPeriodStart, periodEnd: subscription.currentPeriodEnd } });
    if (payment.razorpayOrderId) return NextResponse.json({ paymentId: payment.id, orderId: payment.razorpayOrderId, amount: Math.round(Number(payment.amount) * 100), currency: payment.currency, key: process.env.RAZORPAY_LIVE_API_KEY });
    const order = await razorpay.orders.create({ amount: Math.round(Number(payment.amount) * 100), currency: payment.currency, receipt: `pkg_${payment.id.slice(0, 30)}`, notes: { subscriptionId: subscription.id, packagePaymentId: payment.id } });
    payment = await db.doctorPackagePayment.update({ where: { id: payment.id }, data: { razorpayOrderId: order.id } });
    return NextResponse.json({ paymentId: payment.id, orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_LIVE_API_KEY });
  } catch (error) { console.error("[PACKAGE_PAYMENT_ORDER]", error); return NextResponse.json({ error: "Unable to create payment order" }, { status: 500 }); }
}
