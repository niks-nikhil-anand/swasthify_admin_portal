import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { subject, body } = await req.json();

        if (!subject || !body) {
            return NextResponse.json(
                { error: "Subject and body are required" },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: "Swasthify Admin <noreply@swasthify.in>",
            to: "niks.anand.developer@gmail.com",
            subject: `[Support] ${subject}`,
            html: `
                <h2>Support Request from Admin Portal</h2>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${body.replace(/\n/g, "<br>")}</p>
            `,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Email sent successfully", data });
    } catch (error) {
        console.error("Support Email Error:", error);
        return NextResponse.json(
            { error: "Failed to send support email" },
            { status: 500 }
        );
    }
}
