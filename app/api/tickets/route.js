import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
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

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("[TICKETS_POST]", error);
        return NextResponse.json({ error: "Internal Error", details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
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

export async function PATCH(req) {
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

export async function DELETE(req) {
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
