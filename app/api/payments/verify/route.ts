import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendAppointmentEmails } from "@/lib/resend";

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

        // 3. Update Payment and Appointment
        await db.$transaction([
            db.payment.update({
                where: { appointmentId },
                data: {
                    status: "SUCCESS",
                    transactionId: razorpay_payment_id,
                    method: "ONLINE"
                }
            }),
            db.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: "CONFIRMED"
                }
            })
        ]);

        // 4. Send Emails (Async - don't block response)
        if (appointment.patient.user.email && appointment.doctor?.user.email) {
            sendAppointmentEmails({
                patientEmail: appointment.patient.user.email,
                patientName: appointment.patient.user.name,
                doctorEmail: appointment.doctor.user.email,
                doctorName: appointment.doctor.user.name,
                date: appointment.dateTime,
                timeSlot: "Confirmed Slot", // Ideally parse from dateTime if not stored elsewhere
                fee: appointment.consultationFee,
            }).catch(err => console.error("Email notification failed:", err));
        }

        return NextResponse.json({ message: "Payment verified successfully" });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
