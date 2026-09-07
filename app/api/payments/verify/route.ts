import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendAppointmentEmails } from "@/lib/resend";
import { isExpiredPendingAppointment } from "@/lib/booking-reservation";

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

        // 2. Fetch full details for email BEFORE update to ensure we have data
        const appointment = await db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        const payment = await db.payment.findUnique({ where: { appointmentId } });
        if (appointment.status === "CONFIRMED" && payment?.status === "SUCCESS") {
            return NextResponse.json({ message: "Payment already verified", idempotent: true });
        }

        if (appointment.status !== "PENDING" || isExpiredPendingAppointment(appointment.createdAt)) {
            return NextResponse.json({ error: "This booking reservation has expired" }, { status: 409 });
        }

        if (!payment || (payment.transactionId && payment.transactionId !== razorpay_order_id)) {
            return NextResponse.json({ error: "Payment order does not match this booking" }, { status: 400 });
        }

        // 3. Update Payment and Appointment only once. updateMany makes a
        // repeated callback harmless when two callbacks arrive together.
        const confirmedNow = await db.$transaction(async (tx) => {
            const paymentUpdate = await tx.payment.updateMany({
                where: {
                    appointmentId,
                    status: "PENDING",
                    transactionId: razorpay_order_id,
                },
                data: {
                    status: "SUCCESS",
                    transactionId: razorpay_payment_id,
                    method: "ONLINE"
                }
            });

            if (paymentUpdate.count === 0) return false;

            await tx.appointment.updateMany({
                where: { id: appointmentId, status: "PENDING" },
                data: { status: "CONFIRMED" },
            });
            return true;
        });

        if (!confirmedNow) {
            const latest = await db.payment.findUnique({ where: { appointmentId } });
            if (latest?.status === "SUCCESS") {
                return NextResponse.json({ message: "Payment already verified", idempotent: true });
            }
            return NextResponse.json({ error: "Payment has already been processed" }, { status: 409 });
        }

        // 4. Send Emails (Async - don't block response)
        if (appointment.patient.user.email && appointment.doctor?.user.email) {
            sendAppointmentEmails({
                patientEmail: appointment.patient.user.email,
                patientName: appointment.patient.user.name,
                doctorEmail: appointment.doctor.user.email,
                doctorName: appointment.doctor.user.name,
                date: appointment.dateTime,
                timeSlot: new Date(appointment.dateTime).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "numeric",
                    minute: "2-digit",
                }) + " IST",
                fee: appointment.consultationFee,
            }).catch(err => console.error("Email notification failed:", err));
        }

        return NextResponse.json({ message: "Payment verified successfully" });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
