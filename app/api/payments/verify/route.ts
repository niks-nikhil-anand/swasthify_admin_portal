import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentId
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify Signature
        const secret = process.env.RAZORPAY_SECRET_API_KEY!;
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // 2. Update Payment and Appointment
        await db.$transaction([
            db.payment.update({
                where: { appointmentId },
                data: {
                    status: "SUCCESS",
                    transactionId: razorpay_payment_id,
                    method: "ONLINE" // Generic
                }
            }),
            db.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: "CONFIRMED"
                }
            })
        ]);

        return NextResponse.json({ message: "Payment verified successfully" });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
