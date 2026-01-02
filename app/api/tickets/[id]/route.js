import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await db.ticket.findUnique({
            where: { id }
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKET_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await db.ticket.update({
            where: { id },
            data: { ...body }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKET_PATCH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, email, phone, subject, message, status } = body;

        if (!id) {
            return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
        }

        if (!name || !email || !phone || !subject || !message || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ticket = await db.ticket.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                subject,
                message,
                status
            }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKET_PUT]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await db.ticket.delete({
            where: { id }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("[TICKET_DELETE]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
