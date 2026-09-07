import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { isExpiredPendingAppointment, releasePendingAppointment } from "@/lib/booking-reservation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    console.log("Create Order API started");
    try {
        const body = await req.json();
        const { appointmentId } = body;
        console.log("Request appointmentId:", appointmentId);

        if (!appointmentId) {
            return NextResponse.json({ error: "No appointmentId provided" }, { status: 400 });
        }

        // 1. Authenticate user
        const cookieStore = await cookies();
        const token = cookieStore.get("PATIENT")?.value;
        if (!token) {
            console.log("Auth failed: No token");
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        // 2. Fetch appointment
        const appointment = await db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
                doctor: { include: { user: true } },
                payment: true,
            }
        });

        if (!appointment) {
            console.log("Appointment not found in DB");
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (appointment.patient.userId !== userId) {
            console.log("Ownership mismatch");
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (appointment.status !== "PENDING" || isExpiredPendingAppointment(appointment.createdAt)) {
            return NextResponse.json({ error: "This booking reservation has expired" }, { status: 409 });
        }

        if (appointment.payment?.status === "PENDING" && appointment.payment.transactionId) {
            return NextResponse.json({
                orderId: appointment.payment.transactionId,
                amount: Math.round(appointment.payment.amount * 100),
                currency: "INR",
                key: process.env.RAZORPAY_LIVE_API_KEY,
                appointmentDetails: {
                    doctorName: appointment.doctor?.user.name || "Doctor",
                    patientName: appointment.patient.name || "Patient",
                },
            });
        }

        // 3. Amount calculation
        let fee = appointment.consultationFee;
        if (fee === undefined || fee === null || fee === 0) {
            fee = 500; // Fallback
        }
        const amount = Math.floor(fee * 100);
        console.log("Calculating amount:", fee, "->", amount);

        // 4. Create Razorpay order
        let order;
        try {
            console.log("Invoking Razorpay API...");
            order = await razorpay.orders.create({
                amount: amount,
                currency: "INR",
                receipt: `receipt_${appointmentId.substring(0, 30)}`,
            });
            console.log("Razorpay Order ID:", order.id);
        } catch (rzpError: unknown) {
            console.error("Razorpay Order Creation Failed:", rzpError);
            await releasePendingAppointment(appointmentId, "Payment order creation failed");
            return NextResponse.json({
                error: "Payment Gateway Error",
                details: rzpError instanceof Error ? rzpError.message : "Failed to create Razorpay order"
            }, { status: 502 });
        }

        // 5. Update database
        try {
            await db.payment.upsert({
                where: { appointmentId: appointmentId },
                update: {
                    amount: fee,
                    status: "PENDING",
                    transactionId: order.id,
                },
                create: {
                    appointmentId: appointmentId,
                    amount: fee,
                    status: "PENDING",
                    transactionId: order.id,
                }
            });
        } catch (dbError: unknown) {
            console.error("Database Payment Update Failed:", dbError);
            await releasePendingAppointment(appointmentId, "Payment record creation failed");
            return NextResponse.json({ error: "Unable to prepare payment" }, { status: 500 });
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_LIVE_API_KEY,
            appointmentDetails: {
                doctorName: appointment.doctor?.user.name || "Doctor",
                patientName: appointment.patient.name || "Patient",
            }
        });

    } catch (error: unknown) {
        console.error("CRITICAL API ERROR:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
    }
}
