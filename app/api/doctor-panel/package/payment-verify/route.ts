import crypto from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const addMonth = (date: Date) => { const next = new Date(date); next.setMonth(next.getMonth() + 1); return next; };

export async function POST(request: Request) {
  try {
    const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (![paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every((value) => typeof value === "string" && value)) return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    const token = (await cookies()).get("DOCTOR")?.value; if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)); if (payload.role !== "DOCTOR" || !payload.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payment = await db.doctorPackagePayment.findUnique({ where: { id: paymentId }, include: { subscription: { include: { doctor: true } } } });
    if (!payment || payment.subscription.doctor.userId !== payload.userId) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (payment.status === "PAID") return NextResponse.json({ message: "Payment already verified" });
    if (payment.razorpayOrderId !== razorpay_order_id) return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_API_KEY!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    await db.$transaction(async (tx) => { const now = new Date(); await tx.doctorPackagePayment.update({ where: { id: payment.id }, data: { status: "PAID", paidAt: now, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature } }); await tx.doctorSubscription.updateMany({ where: { doctorId: payment.subscription.doctorId, id: { not: payment.subscriptionId }, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE", "PAUSED"] } }, data: { status: "CANCELLED", cancelledAt: now, endedAt: now } }); await tx.doctorSubscription.update({ where: { id: payment.subscriptionId }, data: { status: "ACTIVE", currentPeriodStart: payment.periodEnd, currentPeriodEnd: addMonth(payment.periodEnd) } }); await tx.doctorSubscriptionEvent.createMany({ data: [{ subscriptionId: payment.subscriptionId, eventType: "PAYMENT_PAID", notes: `Razorpay payment ${razorpay_payment_id} verified.` }, { subscriptionId: payment.subscriptionId, eventType: "PERIOD_RENEWED", notes: "Package renewed after successful payment." }] }); });
    return NextResponse.json({ message: "Package renewed successfully" });
  } catch (error) { console.error("[PACKAGE_PAYMENT_VERIFY]", error); return NextResponse.json({ error: "Unable to verify payment" }, { status: 500 }); }
}
