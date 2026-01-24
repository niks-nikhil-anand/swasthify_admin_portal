import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import ContactFormEmail from "@/emails/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !phone || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ticket = await db.ticket.create({
            data: {
                name,
                email,
                phone,
                subject,
                message,
                status: "OPEN"
            }
        });

        // Send email notification
        try {
            await resend.emails.send({
                from: "Swasthify <noreply@swasthify.in>",
                to: email, // Sending to the user
                subject: `Ticket Created: ${subject}`,
                react: ContactFormEmail({
                    name,
                    email,
                    phone,
                    subject,
                    message
                })
            });
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // We don't block the response if email fails, as the ticket is saved
        }

        return NextResponse.json(ticket, { status: 201 });
    } catch (error: any) {
        console.error("[TICKETS_POST]", error);
        return NextResponse.json({ error: "Internal Error", details: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const tickets = await db.ticket.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(tickets);
    } catch (error) {
        console.error("[TICKETS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ticket = await db.ticket.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKETS_PATCH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await db.ticket.delete({
            where: { id }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKETS_DELETE]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
